// pages/api/subscribe.js
import axios from 'axios';

const API_KEY = '3a2a06c09ef77ef041a78074b5de1f8a-us17';
const LIST_ID = 'f85c1f9815';
const DATACENTER = API_KEY.split('-')[1];
const BASE_URL = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, firstName } = req.body;

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
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}