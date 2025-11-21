/**
 * Vercel Serverless Function - Groq API Proxy
 * Frontend'den gelen istekleri Groq API'ye yönlendirir
 * API key backend'de güvenli şekilde saklanır
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get API key from environment variable
        const GROQ_API_KEY = process.env.GROQ_API_KEY;

        if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
            console.error('❌ GROQ_API_KEY environment variable bulunamadı');
            return res.status(500).json({ 
                error: 'API key not configured',
                message: 'GROQ_API_KEY environment variable is missing'
            });
        }

        // Get request body
        const { prompt, context, model, temperature, max_tokens } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Prepare Groq API request
        const groqRequest = {
            model: model || 'llama-3.3-70b-versatile',
            messages: [
                ...(context ? [{ role: 'system', content: context }] : []),
                { role: 'user', content: prompt }
            ],
            temperature: temperature || 0.7,
            max_tokens: max_tokens || 2048
        };

        console.log('🔍 Groq API Proxy Request:', {
            model: groqRequest.model,
            promptLength: prompt.length,
            hasContext: !!context
        });

        // Call Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groqRequest)
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            console.error('❌ Groq API Error:', groqResponse.status, errorText);
            return res.status(groqResponse.status).json({
                error: 'Groq API error',
                status: groqResponse.status,
                message: errorText
            });
        }

        const data = await groqResponse.json();

        // Return response
        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('❌ Proxy Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

