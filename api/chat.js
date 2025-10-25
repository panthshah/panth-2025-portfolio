// Serverless function for Vercel deployment
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Panth Shah\'s portfolio assistant. Provide helpful, concise responses about Panth\'s work, skills, and projects. Keep responses conversational and under 100 words. If you don\'t know something, be honest and encourage them to reach out directly.'
          },
          // Include recent history for context
          ...(Array.isArray(history) ? history.slice(-4).flatMap((h) => ([
            { role: 'user', content: h.user },
            { role: 'assistant', content: h.bot }
          ])) : []),
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.3
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return res.status(500).json({ 
        reply: "Sorry, I'm having trouble connecting right now. Please try again." 
      });
    }
    
    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      reply: "Sorry, something went wrong. Please try again." 
    });
  }
}

