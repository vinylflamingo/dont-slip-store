import axios from 'axios';
import updateInventory from '../../lib/shopifyAdmin';
import type { NextApiRequest, NextApiResponse } from 'next';

interface LineItem {
    variant_id: number;
    quantity: number;
}

interface OrderHookRequest {
    line_items: LineItem[];
}

interface SuccessResponse {
    success: true;
}

interface ErrorResponse {
    success: false;
    error: string;
}

type OrderHookResponse = SuccessResponse | ErrorResponse;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<OrderHookResponse | { error: string }>
) {
    if (req.method === 'POST') {
        try {
            const { line_items } = req.body as OrderHookRequest;
            const inventoryUpdates = line_items.map(item => ({
                variantId: item.variant_id,
                quantity: item.quantity
            }));

            // Log the formatted inventory updates for debugging
            console.log("Inventory Updates:", inventoryUpdates);

            await updateInventory(inventoryUpdates);

            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ success: false, error: errorMessage });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
