export default {
	async fetch(request, env) {
	  if (request.method === 'OPTIONS') {
		return new Response(null, {
		  status: 204,
		  headers: {
			'Access-Control-Allow-Origin': 'http://localhost:5173',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
		  },
		});
	  }
  
	  if (request.method === 'GET') {
		return new Response('Bienvenue sur le Worker AI. Utilisez une requête POST pour interagir avec l\'IA.', {
		  status: 200,
		  headers: { 'Content-Type': 'text/plain' },
		});
	  }
  
	  if (request.method !== 'POST') {
		return new Response('Méthode non autorisée', { status: 405 });
	  }
  
	  try {
		const body = await request.json();
		const prompt = body.prompt;
  
		if (!prompt) {
		  return new Response('Le prompt est requis', { status: 400 });
		}
  
		const frenchPrompt = `Répondez en français de manière plus au moins détaillée et professionnelle. ${prompt}`;
  
		const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
		  prompt: frenchPrompt,
		  max_tokens: 512,
		  temperature: 0.7,
		});
  
		const corsHeaders = {
		  'Access-Control-Allow-Origin': 'http://localhost:5173',
		  'Access-Control-Allow-Methods': 'POST, OPTIONS',
		  'Access-Control-Allow-Headers': 'Content-Type',
		};
  
		return new Response(JSON.stringify({ response }), {
		  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	  } catch (error) {
		return new Response(`Erreur: ${error.message}`, { status: 500 });
	  }
	},
  };
  