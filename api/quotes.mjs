// API dos orçamentos (/gest/api/quotes). Fala com o Supabase usando a service role key,
// que só existe no servidor — a tabela não tem políticas públicas.
import { isAuthorized, unauthorized } from '../lib/gest-auth.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://asoacvciftbjzgqsqfja.supabase.co';
const TABLE = `${SUPABASE_URL}/rest/v1/quotes`;

function supabase(url, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(url, {
    ...init,
    headers: {
      apikey: key,
      // Chaves antigas (JWT "eyJ...") também vão no Authorization; as novas "sb_secret_..." só no apikey
      ...(key && key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}),
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

async function relay(res) {
  if (res.ok) return new Response(res.status === 204 ? null : await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
  console.error('Supabase error', res.status, await res.text());
  return Response.json({ error: 'Erro ao comunicar com a base de dados.' }, { status: 502 });
}

async function guarded(request, fn) {
  if (!isAuthorized(request.headers.get('authorization'))) return unauthorized();
  try { return await fn(); }
  catch (e) {
    console.error(e);
    return Response.json({ error: 'Base de dados indisponível.' }, { status: 503 });
  }
}

// Lista todos os orçamentos
export function GET(request) {
  return guarded(request, async () =>
    relay(await supabase(`${TABLE}?select=id,label,saved_at,data&order=saved_at.desc`)));
}

// Cria ou atualiza um (ou vários) orçamentos: { id, label, savedAt, data }
export function PUT(request) {
  return guarded(request, async () => {
    const body = await request.json();
    const rows = (Array.isArray(body) ? body : [body]).map(q => ({
      id: String(q.id),
      label: String(q.label || ''),
      saved_at: Number(q.savedAt) || Date.now(),
      data: q.data || {},
    }));
    return relay(await supabase(TABLE, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows),
    }));
  });
}

// Apaga um orçamento: ?id=...
export function DELETE(request) {
  return guarded(request, async () => {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return Response.json({ error: 'Falta o id.' }, { status: 400 });
    return relay(await supabase(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    }));
  });
}
