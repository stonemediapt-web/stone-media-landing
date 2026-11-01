// Consentimento de cookies: o Google Analytics só é carregado depois de o visitante aceitar.
(function () {
  var GA_ID = 'G-RPNZCL57D6';
  var KEY = 'sm-cookie-consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // volta a perguntar ao fim de cerca de 6 meses
  var isEn = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var t = isEn ? {
    label: 'Cookie preferences',
    text: 'We use analytics cookies (Google Analytics) to understand how the site is used. They are only activated if you accept.',
    more: 'Privacy Policy',
    href: '/en/privacy.html',
    accept: 'Accept',
    reject: 'Reject'
  } : {
    label: 'Preferências de cookies',
    text: 'Usamos cookies de estatísticas (Google Analytics) para perceber como o site é utilizado. Só são ativados se aceitar.',
    more: 'Política de Privacidade',
    href: '/privacidade.html',
    accept: 'Aceitar',
    reject: 'Rejeitar'
  };

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && typeof c.analytics === 'boolean' && Date.now() - c.at < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }

  function save(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ analytics: analytics, at: Date.now() }));
    } catch (e) {}
  }

  var loaded = false;
  function loadAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function removeAnalyticsCookies() {
    window['ga-disable-' + GA_ID] = true;
    var parts = location.hostname.split('.');
    var domains = ['', location.hostname, '.' + location.hostname];
    if (parts.length > 1) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0 && name !== '_gid' && name !== '_gat') return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var banner = null;
  function closeBanner() {
    if (banner) banner.remove();
    banner = null;
  }

  function button(text, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.style.cssText = 'flex:1 1 0;min-width:110px;padding:11px 18px;border-radius:999px;border:1px solid #111827;background:#111827;color:#fff;font:600 14px/1.2 Inter,system-ui,sans-serif;cursor:pointer';
    b.addEventListener('click', onClick);
    return b;
  }

  function openBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', t.label);
    banner.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:460px;margin-left:auto;padding:20px;background:#fff;color:#374151;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.14);font:400 14px/1.5 Inter,system-ui,sans-serif';

    var p = document.createElement('p');
    p.style.cssText = 'margin:0 0 14px';
    p.textContent = t.text + ' ';
    var a = document.createElement('a');
    a.href = t.href;
    a.textContent = t.more;
    a.style.cssText = 'color:#111827;text-decoration:underline';
    p.appendChild(a);
    p.appendChild(document.createTextNode('.'));

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px';
    var accept = button(t.accept, function () {
      save(true);
      closeBanner();
      loadAnalytics();
    });
    var reject = button(t.reject, function () {
      var wasActive = loaded;
      save(false);
      removeAnalyticsCookies();
      closeBanner();
      if (wasActive) location.reload();
    });
    row.appendChild(reject);
    row.appendChild(accept);

    banner.appendChild(p);
    banner.appendChild(row);
    document.body.appendChild(banner);
    reject.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!el) return;
    e.preventDefault();
    openBanner();
  });

  var choice = read();
  if (choice && choice.analytics) {
    loadAnalytics();
  } else {
    removeAnalyticsCookies();
    window['ga-disable-' + GA_ID] = !!choice;
    if (!choice) openBanner();
  }
})();
