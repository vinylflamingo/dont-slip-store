import { useState, useContext, useEffect } from 'react'
import { formatter } from '../../../utils/helpers'
import ProductOptions from './ProductOptions'
import { CartContext } from '../../../context/shopContext'
import { ShopifyProduct, VariantOption, ShopifyProductOption, ShopifySelectedOption } from '../../../types/shopify'

interface ProductFormProps {
  product: ShopifyProduct
}

export default function ProductForm({ product }: ProductFormProps) {
  const { addToCart, cartOpen, setCartOpen, cart } = useContext(CartContext);

  const [allVariantOptions, setAllVariantOptions] = useState<VariantOption[]>(product.variants.edges
    ?.map((variant) => {
        const allOptions: { [key: string]: string } = {};
        if (variant.node.quantityAvailable > 0) {
            variant.node.selectedOptions.map((item) => {
                allOptions[item.name] = item.value
            });
            return {
                id: variant.node.id,
                title: product.title,
                handle: product.handle,
                image: variant.node.image?.url,
                options: allOptions,
                variantTitle: variant.node.title,
                variantPrice: parseFloat(variant.node.priceV2.amount),
                variantQuantity: variant.node.quantityAvailable,
            };
        }
        return null;
    })
    .filter((variant): variant is VariantOption => variant !== null));

  const defaultValues: { [key: string]: string } = {};
  product.options.forEach((option) => {
    const validValues = option.values.filter((value: string) =>
      allVariantOptions.some((variant) => variant.options[option.name] === value)
    );
    defaultValues[option.name] = validValues[0];
  });

  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(allVariantOptions[0] || null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(defaultValues);

  function setOptions(name: string, value: string) {
    setSelectedOptions(prevState => {
      return { ...prevState, [name]: value };
    });

    const selection = {
      ...selectedOptions,
      [name]: value,
    };

    const matchingVariant = allVariantOptions.find((item) =>
      JSON.stringify(item.options) === JSON.stringify(selection)
    );
    setSelectedVariant(matchingVariant || null);
  }

  function updateVariants() {
    const updatedVariants = product.variants.edges
      .filter((variant) => {
        const cartItem = cart.find((item) => item.id === variant.node.id);
        return !cartItem || cartItem.variantQuantity < variant.node.quantityAvailable;
      })
      .map((variant) => {
        const allOptions: { [key: string]: string } = {};
        if (variant.node.quantityAvailable > 0) {
          variant.node.selectedOptions.map((item) => {
            allOptions[item.name] = item.value;
          });
          return {
            id: variant.node.id,
            title: product.title,
            handle: product.handle,
            image: variant.node.image?.url,
            options: allOptions,
            variantTitle: variant.node.title,
            variantPrice: parseFloat(variant.node.priceV2.amount),
            variantQuantity: variant.node.quantityAvailable,
          };
        }
        return null;
      })
      .filter((variant): variant is VariantOption => variant !== null);

    setAllVariantOptions(updatedVariants);
    if (updatedVariants.length > 0) {
      setSelectedVariant(updatedVariants[0]); // Update selected variant to the first one in the list
      setSelectedOptions(updatedVariants[0].options); // Update selected options to match the new selected variant
    } else {
      setSelectedVariant(null);
      setSelectedOptions(defaultValues); // Reset selected options if no variants are available
    }
  }

  useEffect(() => {
    updateVariants();
  }, [cart]);
  return (
    <div className="p-4 flex flex-col w-full md:w-1/3">
      <h2 className='text-4xl font-bold'>{product.title}</h2>
      <span className='pb-6'>{formatter.format(parseFloat(product.variants.edges[0].node.priceV2.amount))}</span>
      {product.descriptionHtml && (
        <div
          className="prose prose-sm mb-4"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      )}
      {product.options.map(({ name, values }) => (
        <ProductOptions
          key={`key-${name}`}
          name={name}
          values={values.filter((value: string) =>
            allVariantOptions.some((variant) => variant.options[name] === value)
          )}
          selectedOptions={selectedOptions}
          setOptions={setOptions}
        />
      ))}
      <button
        onClick={() => {
          if (selectedVariant) {
            addToCart(selectedVariant, 1, product);
            setCartOpen(!cartOpen);
          } else {
            alert('No variant selected or available');
          }
        }}
        className='bg-black rounded-lg text-white px-2 py-3 hover:bg-gray-800'>
        Add to Cart
      </button>
    </div>
  );
}
