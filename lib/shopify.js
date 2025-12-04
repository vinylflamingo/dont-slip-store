const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN;
const defaultCollection = process.env.DEFAULT_COLLECTION

async function ShopifyData(query) {
  const URL = `https://${domain}/api/2025-10/graphql.json`;

  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(URL, options).then((response) => {
      return response.json();
    });

    return data;
  } catch (error) {
    throw new Error("Products not fetched");
  }
}

export async function getProductsInCollection() {
  const query = `
  {
    collection(handle: "${defaultCollection}") {
      title
      products(first: 25) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }`;

  const response = await ShopifyData(query);

  const allProducts = response.data.collection.products.edges
    ? response.data.collection.products.edges
    : [];

  return allProducts;
}

export async function getAllProducts() {
  const query = `{
    products(first: 250) {
      edges {
        node {
          handle
          id
        }
      }
    }
  }`;

  const response = await ShopifyData(query);

  const slugs = response.data.products.edges
    ? response.data.products.edges
    : [];

  return slugs;
}

export async function getProduct(handle) {
  const query = `
  {
    product(handle: "${handle}") {
    	collections(first: 1) {
      	edges {
          node {
            products(first: 5) {
              edges {
                node {
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  handle
                  title
                  id
                  images(first: 5) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
    	}
      id
      title
      handle
      descriptionHtml
      totalInventory

      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 25) {
        edges {
          node {
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            title
            id
            quantityAvailable
            availableForSale
            priceV2 {
              amount
            }
          }
        }
      }
    }
  }`;

  const response = await ShopifyData(query);

  const product = response.data.product
    ? response.data.product
    : [];

  return product;
}

export async function createCheckout(id, quantity) {
  const query = `
    mutation {
      cartCreate(input: {
        lines: [{ merchandiseId: "${id}", quantity: ${quantity}}]
      })
       {
        cart {
          id
          checkoutUrl
        }
      }
    }`;

  const response = await ShopifyData(query);
  const cart = response.data.cartCreate.cart
    ? response.data.cartCreate.cart
    : [];

  return {
    id: cart.id,
    webUrl: cart.checkoutUrl
  };
}

export async function updateCheckout(id, lineItems) {
  // First, get the current cart to compare line items
  const getCartQuery = `
  query {
    cart(id: "${id}") {
      id
      checkoutUrl
      lines(first: 25) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
    }
  }`;

  const currentCartResponse = await ShopifyData(getCartQuery);
  const currentCart = currentCartResponse.data?.cart;

  if (!currentCart) {
    console.error('Cart not found');
    return { id, webUrl: '' };
  }

  const currentLines = currentCart.lines.edges.map(edge => ({
    lineId: edge.node.id,
    merchandiseId: edge.node.merchandise.id,
    quantity: edge.node.quantity
  }));

  // Prepare updates and additions
  const linesToUpdate = [];
  const linesToAdd = [];
  const processedMerchandiseIds = new Set();

  lineItems.forEach(item => {
    const existingLine = currentLines.find(line => line.merchandiseId === item.id);

    if (existingLine) {
      // Update existing line
      if (existingLine.quantity !== item.variantQuantity) {
        linesToUpdate.push({
          id: existingLine.lineId,
          quantity: item.variantQuantity
        });
      }
      processedMerchandiseIds.add(item.id);
    } else {
      // Add new line
      linesToAdd.push({
        merchandiseId: item.id,
        quantity: item.variantQuantity
      });
    }
  });

  // Find lines to remove
  const linesToRemove = currentLines
    .filter(line => !lineItems.some(item => item.id === line.merchandiseId))
    .map(line => line.lineId);

  // Execute mutations
  let updatedCart = currentCart;

  // Remove lines
  if (linesToRemove.length > 0) {
    const removeQuery = `
    mutation {
      cartLinesRemove(cartId: "${id}", lineIds: ${JSON.stringify(linesToRemove)}) {
        cart {
          id
          checkoutUrl
          lines(first: 25) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }`;
    const removeResponse = await ShopifyData(removeQuery);
    updatedCart = removeResponse.data?.cartLinesRemove?.cart || updatedCart;
  }

  // Update lines
  if (linesToUpdate.length > 0) {
    const updateLinesObject = linesToUpdate.map(line =>
      `{ id: "${line.id}", quantity: ${line.quantity} }`
    ).join(',');

    const updateQuery = `
    mutation {
      cartLinesUpdate(cartId: "${id}", lines: [${updateLinesObject}]) {
        cart {
          id
          checkoutUrl
          lines(first: 25) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }`;
    const updateResponse = await ShopifyData(updateQuery);
    updatedCart = updateResponse.data?.cartLinesUpdate?.cart || updatedCart;
  }

  // Add new lines
  if (linesToAdd.length > 0) {
    const addLinesObject = linesToAdd.map(line =>
      `{ merchandiseId: "${line.merchandiseId}", quantity: ${line.quantity} }`
    ).join(',');

    const addQuery = `
    mutation {
      cartLinesAdd(cartId: "${id}", lines: [${addLinesObject}]) {
        cart {
          id
          checkoutUrl
          lines(first: 25) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }`;
    const addResponse = await ShopifyData(addQuery);
    updatedCart = addResponse.data?.cartLinesAdd?.cart || updatedCart;
  }

  return {
    id: updatedCart.id,
    webUrl: updatedCart.checkoutUrl
  };
}

export async function recursiveCatalog(cursor = "", initialRequest = true) {
  let data;

  if (cursor !== "") {
    const query = `{
      products(after: "${cursor}", first: 250) {
        edges {
          cursor
          node {
            id
            handle
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }`;

    const response = await ShopifyData(query);
    data = response.data.products.edges ? response.data.products.edges : [];

    if (response.data.products.pageInfo.hasNextPage) {
      const num = response.data.products.edges.length;
      const cursor = response.data.products.edges[num - 1].cursor;

      return data.concat(await recursiveCatalog(cursor));
    } else {
      return data;
    }
  } else {
    const query = `{
      products(first: 250) {
        edges {
          cursor
          node {
            id
            handle
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
    `;

    const response = await ShopifyData(query);
    data = response.data.products.edges ? response.data.products.edges : [];

    if (response.data.products.pageInfo.hasNextPage) {
      const num = response.data.products.edges.length;
      const cursor = response.data.products.edges[num - 1].cursor;

      return data.concat(await recursiveCatalog(cursor));
    } else {
      return data;
    }
  }
}