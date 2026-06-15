const projetos = [
  {
    nome: 'Stone Media',
    url: 'https://asoacvciftbjzgqsqfja.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzb2FjdmNpZnRianpncXNxZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzIyODEsImV4cCI6MjA5NjY0ODI4MX0.3KUBAqQut2j9HKXapWe8-F3XSe_8mw9POC2GMuMx3Tw',
  },
  {
    nome: 'Projeto 2',
    url: 'https://egeeipgwnlhulvgkqwuj.supabase.co',
    key: 'sb_publishable_ucTk5ffvE6kTSesUm3oWyw_1Az5Zizp',
  },
];

async function ping(projeto) {
  const res = await fetch(`${projeto.url}/rest/v1/`, {
    headers: {
      apikey: projeto.key,
      Authorization: `Bearer ${projeto.key}`,
    },
  });
  console.log(`[${projeto.nome}] Status: ${res.status} ${res.ok ? '✓' : '✗'}`);
}

(async () => {
  console.log(`Ping Supabase — ${new Date().toLocaleString('pt-BR')}\n`);
  for (const p of projetos) {
    try {
      await ping(p);
    } catch (e) {
      console.error(`[${p.nome}] Erro: ${e.message}`);
    }
  }
})();
