// pages/api/orderhook.js
import axios from 'axios';
import updateInventory from '../../lib/shopifyAdmin';

export default async function handler(req, res) {
    console.log("Web hook hit");

    if (req.method === 'POST') {
        try {
            const lineItems = req.body.line_items;
            const inventoryUpdates = lineItems.map(item => ({
                variantId: item.variant_id,
                quantity: item.quantity
            }));
            
            // Log the formatted inventory updates for debugging
            console.log("Inventory Updates:", inventoryUpdates);

            await updateInventory(inventoryUpdates);

            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}