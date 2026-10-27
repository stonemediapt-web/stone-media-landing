// Vercel Routing Middleware: protege a área de gestão (/gest) e a API com password.
import { isAuthorized, unauthorized } from './lib/gest-auth.mjs';

export const config = {
  matcher: ['/gest', '/gest/:path*', '/api/:path*'],
};

export default function middleware(request) {
  if (!isAuthorized(request.headers.get('authorization'))) return unauthorized();
}
