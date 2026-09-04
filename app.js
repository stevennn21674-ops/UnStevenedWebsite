(() => {
  const grid = document.getElementById('gameGrid');
  const search = document.getElementById('search');
  const count = document.getElementById('gameCount');
  const empty = document.getElementById('empty');
  const loadError = document.getElementById('loadError');
  let games = [];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));

  const cleanPart = (value) => String(value ?? '')
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .map(encodeURIComponent)
    .join('/');

  function render() {
    const q = search.value.trim().toLowerCase();
    const filtered = games.filter(g => (g.name || '').toLowerCase().includes(q));

    grid.innerHTML = '';

    filtered.forEach((g) => {
      const card = document.createElement('article');
      card.className = 'game-card';

      const thumb = g.thumbnail
        ? `<img class="thumb" src="${esc(g.thumbnail)}" alt="${esc(g.name)}" loading="lazy">`
        : `<div class="thumb-fallback">${esc(g.name)}</div>`;

      card.innerHTML = `
        ${thumb}
        <div class="card-body">
          <div class="card-title">${esc(g.name)}</div>
          <a class="play" href="${esc(g.url)}">Play</a>
        </div>`;

      const img = card.querySelector('img');
      if (img) {
        img.addEventListener('error', () => {
          const fallback = document.createElement('div');
          fallback.className = 'thumb-fallback';
          fallback.textContent = g.name;
          img.replaceWith(fallback);
        });
      }

      grid.appendChild(card);
    });

    empty.hidden = filtered.length !== 0;
    count.textContent = `${filtered.length} game${filtered.length === 1 ? '' : 's'}`;
  }

  function normalizeEntries(entries) {
    const result = [];

    for (const entry of entries) {
      if (!entry || !entry.folder) continue;

      const folder = String(entry.folder).replace(/^\/+|\/+$/g, '');
      const page = entry.page || 'index.html';
      const thumbnail = entry.thumbnail || '';
      const name = entry.name || folder;

      result.push({
        name,
        url: `${cleanPart(folder)}/${cleanPart(page)}`,
        thumbnail: thumbnail ? `${cleanPart(folder)}/${cleanPart(thumbnail)}` : ''
      });
    }

    return result.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }

  async function load() {
    // Preferred method: games.js. This works even when index.html is opened
    // directly from a computer with file:// and therefore avoids fetch errors.
    if (Array.isArray(window.UNSTEVENED_GAMES)) {
      games = normalizeEntries(window.UNSTEVENED_GAMES);
      render();
      return;
    }

    // Optional hosted fallback for older versions using games.json.
    try {
      const response = await fetch('games.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      games = normalizeEntries(Array.isArray(manifest.games) ? manifest.games : []);
      render();
    } catch (e) {
      console.error('Could not load game registry:', e);
      loadError.hidden = false;
      count.textContent = 'Games failed to load';
    }
  }

  search.addEventListener('input', render);
  load();
})();
