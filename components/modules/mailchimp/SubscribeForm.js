// components/SubscribeForm.js
import { useState } from 'react';

export default function SubscribeForm() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, firstName }),
            });

            if (response.ok) {
                alert('Subscribed successfully!');
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-center flex flex-col justify-center items-center pt-5 text-sm">
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[200px] mb-4 bg-white text-black border-2 border-white placeholder-black placeholder-opacity-50 pl-[5px] pb-0.5"
                placeholder="email@example.com"
            />

            {email.length >= 2 && (
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-[200px] mb-4 bg-white text-black border-2 border-white placeholder-black placeholder-opacity-50 pl-[5px] pb-0.5"
                    placeholder="your name"
                />
            )}

            <button
                type="submit"
                className="w-16 bg-black text-white border-2 border-white transition-all duration-300 ease-in-out hover:bg-white hover:text-black pb-1 font-chivo-mono"
            >
                submit
            </button>
        </form>
    );
}