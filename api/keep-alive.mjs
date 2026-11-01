// Chamado todos os dias pela Vercel (ver "crons" em vercel.json) para o Supabase não pausar por inatividade.
// Usa a chave pública, a mesma que já está em index.html, e só lê o id de uma linha.
const SUPABASE_URL = 'https://asoacvciftbjzgqsqfja.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzb2FjdmNpZnRianpncXNxZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzIyODEsImV4cCI6MjA5NjY0ODI4MX0.3KUBAqQut2j9HKXapWe8-F3XSe_8mw9POC2GMuMx3Tw';

export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=id&limit=1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('Keep-alive falhou:', e);
    return Response.json({ ok: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
