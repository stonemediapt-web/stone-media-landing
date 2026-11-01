// Gera assets/site.css e atualiza a versão nas páginas.
// Correr com "node build-assets.js" sempre que se usar uma classe Tailwind nova.
const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

fs.mkdirSync('assets', { recursive: true });
execSync('npx --yes tailwindcss@3.4.17 -c tailwind.config.js -i assets-src/tailwind.css -o assets/.tw.css --minify', { stdio: 'inherit' });

const css = fs.readFileSync('assets-src/fonts.css', 'utf8') + fs.readFileSync('assets/.tw.css', 'utf8');
fs.rmSync('assets/.tw.css');
fs.writeFileSync('assets/site.css', css, 'utf8');

const version = crypto.createHash('sha256').update(css).digest('hex').slice(0, 10);
const pages = ['index.html', 'en/index.html', ...fs.readdirSync('blog').filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const updated = html.replace(/\/assets\/site\.css(\?v=\w+)?/g, `/assets/site.css?v=${version}`);
  if (updated === html && !html.includes(`site.css?v=${version}`)) throw new Error('Sem ligação ao CSS: ' + page);
  fs.writeFileSync(page, updated, 'utf8');
}
console.log(`site.css: ${(css.length / 1024).toFixed(1)} KB, versão ${version}`);
