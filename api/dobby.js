// =====================================================
//  DOBBY AI PROXY - VERCEL SERVERLESS FUNCTION
//  Securely calls Fireworks AI without exposing API key
//  Built with 💜 by Cassxbt
// =====================================================

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Enable CORS for your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Get the word from request body
        const { word } = req.body;

        if (!word) {
            return res.status(400).json({ error: 'Word is required' });
        }

        // Get API key from environment variable (set in Vercel)
        const API_KEY = process.env.FIREWORKS_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ 
                error: 'API key not configured on server' 
            });
        }

        // Dobby AI configuration
        const API_URL = "https://api.fireworks.ai/inference/v1/completions";
        const MODEL_ID = "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new";

        // Craft the prompt for Dobby
        const prompt = `Define the word "${word}" in the context of AI, blockchain, and Sentient.xyz technology. Keep it brief (2-3 sentences) and beginner-friendly.`;

        // Call Fireworks AI
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL_ID,
                prompt: prompt,
                max_tokens: 200,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Fireworks API Error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: `Fireworks API error: ${response.status}` 
            });
        }

        const data = await response.json();

        // Validate response structure
        if (!data.choices || !data.choices[0] || !data.choices[0].text) {
            console.error('Invalid Fireworks API response:', data);
            return res.status(500).json({ 
                error: 'Invalid API response structure' 
            });
        }

        // Return the AI-generated definition
        const definition = data.choices[0].text.trim();
        return res.status(200).json({ 
            word,
            definition,
            success: true 
        });

    } catch (error) {
        console.error('Dobby AI Proxy Error:', error);
        return res.status(500).json({ 
            error: 'Failed to get definition from Dobby AI',
            message: error.message 
        });
    }
}

