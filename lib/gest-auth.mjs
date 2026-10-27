// Verifica o header Basic Auth contra a password guardada no Vercel (GEST_PASSWORD).
// O nome de utilizador é ignorado: só a password conta.
export function isAuthorized(authHeader) {
  const password = process.env.GEST_PASSWORD;
  if (!password || !authHeader || !authHeader.startsWith('Basic ')) return false;
  let decoded;
  try { decoded = atob(authHeader.slice(6)); } catch (e) { return false; }
  const given = decoded.slice(decoded.indexOf(':') + 1);
  // Comparação em tempo constante
  if (given.length !== password.length) return false;
  let diff = 0;
  for (let i = 0; i < password.length; i++) diff |= given.charCodeAt(i) ^ password.charCodeAt(i);
  return diff === 0;
}

export function unauthorized() {
  return new Response('Acesso restrito.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Stone Media Gest", charset="UTF-8"' },
  });
}
