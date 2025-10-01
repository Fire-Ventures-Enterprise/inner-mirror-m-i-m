import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: any) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
    
    if (!mistralApiKey) {
      throw new Error('Mistral API key not configured');
    }

    console.log('Received message:', message);
    console.log('Conversation history length:', conversationHistory.length);

    // Build the messages array for Mistral
    const messages = [
      {
        role: "system",
        content: `You are Lyla, a warm, empathetic AI companion for the My Inner Mirror app. 
        You help users with emotional growth and self-discovery through thoughtful conversation.
        You are:
        - Warm and supportive, like a wise friend
        - Emotionally intelligent and perceptive
        - Focused on helping users understand themselves better
        - Encouraging of self-reflection and personal growth
        - Non-judgmental and accepting
        - Able to ask thoughtful follow-up questions
        
        Keep responses concise but meaningful (2-3 sentences usually).
        Use a conversational, caring tone.
        Remember context from the conversation to provide personalized insights.`
      },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call Mistral API
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium-latest',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API error:', errorText);
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data: any = await response.json();
    const lylaResponse = data.choices[0].message.content;

    console.log('Lyla response:', lylaResponse);

    return new Response(
      JSON.stringify({ response: lylaResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-with-lyla function:', error);
    
    // Fallback response if API fails
    const fallbackResponse = "I'm here to listen and support you. What's on your heart today?";
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 200, // Return 200 with fallback instead of error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});