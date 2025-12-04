import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = '3a2a06c09ef77ef041a78074b5de1f8a-us17';
const LIST_ID = 'f85c1f9815';
const DATACENTER = API_KEY.split('-')[1];
const BASE_URL = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

interface SubscribeRequest {
    email: string;
    firstName: string;
}

interface SuccessResponse {
    success: true;
}

interface ErrorResponse {
    success: false;
    error: string;
}

type SubscribeResponse = SuccessResponse | ErrorResponse;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SubscribeResponse | { error: string }>
) {
    if (req.method === 'POST') {
        const { email, firstName } = req.body as SubscribeRequest;

        try {
            const response = await axios.post(
                BASE_URL,
                {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: firstName,
                    },
                },
                {
                    headers: {
                        Authorization: `apikey ${API_KEY}`,
                    },
                }
            );

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
