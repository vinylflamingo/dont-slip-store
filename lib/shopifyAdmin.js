import { createAdminApiClient } from '@shopify/admin-api-client';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESSTOKEN;

export default async function updateInventory(data) {
    const client = createAdminApiClient({
        storeDomain: domain,
        apiVersion: '2024-04',
        accessToken: accessToken,
    });

    const mutation = `
      mutation updateInventory($input: InventoryAdjustQuantityInput!) {
        inventoryAdjustQuantity(input: $input) {
          inventoryLevel {
            id
            available
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    for (const item of data) {
        try {
            const variables = {
                input: {
                    inventoryItemId: `gid://shopify/InventoryItem/${item.variantId}`,
                    availableDelta: -item.quantity
                }
            };

            const response = await client.request(mutation, { variables });
            const { data, errors } = response;

            if (errors) {
                console.error("Errors occurred while updating inventory:", errors);
            } else {
                console.log("Inventory updated successfully for variant:", item.variantId);
            }
        } catch (error) {
            console.error("Error updating inventory for variant:", item.variantId, error);
        }
    }
}