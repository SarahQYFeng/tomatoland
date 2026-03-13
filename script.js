// ——— 作品过滤（保持你的逻辑） ———
(function () {
  const btns = document.querySelectorAll('.tag-btn');
  const items = document.querySelectorAll('.work, .not_available_work, .tomato_work');

  function applyFilter(tag) {
    const wanted = (tag || 'all').toLowerCase();

    items.forEach(el => {
      const raw = el.getAttribute('data-tags') || '';
      const tags = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const isArchive = tags.includes('archive');

      let show = false;
      if (wanted === 'archive') {
        // 点击 Archive：只显示归档
        show = isArchive;
      } else {
        // 其他筛选 & 默认：永远不显示归档
        show = !isArchive && (wanted === 'all' || tags.includes(wanted));
      }

      el.style.display = show ? '' : 'none';
    });

    // 切换按钮态（保持你原来的 active 状态逻辑）
    btns.forEach(b => {
      const isActive =
        (b.dataset.tag || '').toLowerCase() === wanted ||
        (wanted === 'all' && b.dataset.tag === 'all');
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    }); 
  }


  function setQuery(tag) {
    const url = new URL(window.location);
    if (tag && tag.toLowerCase() !== 'all') url.searchParams.set('tag', tag);
    else url.searchParams.delete('tag');
    history.replaceState(null, '', url);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag || 'all';
      applyFilter(tag);
      setQuery(tag);
    });
  });

  const startTag = new URLSearchParams(location.search).get('tag') || 'all';
  applyFilter(startTag);

  if (!location.search && location.hash.startsWith('#tag=')) {
    applyFilter(decodeURIComponent(location.hash.slice(5)));
  }
})();

// ——— 悬浮描述 ———
const descriptionArea = document.getElementById('description-area');
const descriptionCopy = descriptionArea?.querySelector('.description-copy');
const defaultDescription = '<span class="desc-title">🍅↖(#^.^#)↗🍅 Hi human, welcome to TOMATOLAND.</span><br>This is Sarah\'s universe of graphic design, interactive systems, and random ideas.';

function setDescription(html) {
  if (!descriptionCopy) return;
  descriptionCopy.innerHTML = html;
}

const works = document.querySelectorAll('.work');
works.forEach(work => {
  const desc = work.getAttribute('data-description');
  work.addEventListener('mouseenter', () => setDescription(desc));
  work.addEventListener('mouseleave', () => setDescription(defaultDescription));
});
const unavailableWorks = document.querySelectorAll('.not_available_work');
unavailableWorks.forEach(el => {
  const desc = el.getAttribute('data-description');
  el.addEventListener('mouseenter', () => setDescription(desc));
  el.addEventListener('mouseleave', () => setDescription(defaultDescription));
});
const tomatoWorks = document.querySelectorAll('.tomato_work');
tomatoWorks.forEach(el => {
  const desc = el.getAttribute('data-description');
  el.addEventListener('mouseenter', () => setDescription(desc));
  el.addEventListener('mouseleave', () => setDescription(defaultDescription));
});

// 左上角标题悬浮描述
const titleEl = document.querySelector('.site-header .title');
titleEl?.addEventListener('mouseenter', () => setDescription(defaultDescription));
titleEl?.addEventListener('mouseleave', () => setDescription(defaultDescription));

// ——— 左下角滚动指示翻转 ———
const scrollIndicator = document.querySelector('.scroll-indicator');

function updateIndicatorFlip() {
  if (!scrollIndicator) return;
  const doc = document.documentElement;
  const reachedBottom = doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 2;
  scrollIndicator.classList.toggle('flip', reachedBottom);
}

updateIndicatorFlip();
window.addEventListener('scroll', updateIndicatorFlip, { passive: true });
window.addEventListener('resize', updateIndicatorFlip);

// ——— 番茄雨 ———
const rainContainer = document.getElementById('rain-container');
const raindropSrc = 'assets/meta/tomato.png';
const dropSize = 20;
const removeDelay = 8000;
const initialDelay = 100000;

function createRaindrop() {
  const drop = document.createElement('img');
  drop.src = raindropSrc;
  drop.classList.add('raindrop');

  const startX = Math.random() * window.innerWidth;
  const startY = -Math.random() * window.innerHeight;
  const rotate = (Math.random() * 20 - 10).toFixed(2);
  const speedY = Math.random() * 5 + 5;
  const scale = Math.random() * 0.5 + 0.85;
  const opacity = (Math.random() * 0.5 + 0.5).toFixed(2);

  let x = startX;
  let y = startY - dropSize * scale;

  drop.style.width = `${dropSize * scale}px`;
  drop.style.opacity = opacity;
  drop.style.position = 'absolute';
  drop.style.left = '0px';
  drop.style.top = '0px';

  rainContainer.appendChild(drop);

  function animate() {
    y += speedY;
    const drift = Math.sin(y / 50 + x) * 2;
    drop.style.transform = `translate(${x + drift}px, ${y}px) rotate(${rotate}deg)`;

    if (y < window.innerHeight - dropSize * scale) {
      requestAnimationFrame(animate);
    } else {
      drop.style.transform = `translate(${x}px, ${window.innerHeight - dropSize * scale}px) rotate(${rotate}deg)`;
      setTimeout(() => {
        drop.classList.add('fade-out');
        setTimeout(() => drop.remove(), 500);
      }, removeDelay);
    }
  }

  requestAnimationFrame(animate);
}

function startRainCycle() {
  const rainDuration = Math.random() * 10000 + 6000;
  const rainInterval = setInterval(() => {
    const drops = Math.floor(Math.random() * 3 + 8);
    for (let i = 0; i < drops; i++) createRaindrop();
  }, 800);

  setTimeout(() => {
    clearInterval(rainInterval);
    setTimeout(startRainCycle, Math.random() * 200000 + 80000);
  }, rainDuration);
}
setTimeout(startRainCycle, initialDelay);
