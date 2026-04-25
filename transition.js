(function () {
  var bgColor = getComputedStyle(document.body).backgroundColor;
  if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
    bgColor = '#ffffff';
  }

  var textColor = getComputedStyle(document.body).color;
  if (!textColor || textColor === 'rgba(0, 0, 0, 0)' || textColor === 'transparent') {
    textColor = '#000000';
  }

  var style = document.createElement('style');
  style.textContent = [
    '#page-transition-overlay {',
    '  position: fixed; top: 0; left: 0; right: 0; bottom: 0;',
    '  display: flex; align-items: center; justify-content: center;',
    '  background: ' + bgColor + '; pointer-events: none; z-index: 999;',
    '  opacity: 1; will-change: opacity;',
    '}',
    '#page-transition-overlay .pt-loading {',
    '  font-family: "Planar", sans-serif;',
    '  font-size: 12pt; font-weight: 300; line-height: 1.2; white-space: pre;',
    '  margin: 0; padding: 0; color: ' + textColor + ';',
    '}',
    '.no-hover-transition a {',
    '  transition: color .4s ease !important;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  var overlay = document.getElementById('page-transition-overlay');

  var LOADING = 'Loading...';
  var TYPEWRITER_MS = 50;
  var typeTimer = null;
  var typePos = 0;
  var loadingEl = null;

  function getLoadingNode() {
    if (!loadingEl) {
      loadingEl = document.createElement('p');
      loadingEl.className = 'pt-loading';
      loadingEl.setAttribute('aria-live', 'polite');
      if (overlay) overlay.appendChild(loadingEl);
    }
    return loadingEl;
  }

  function typewriterTick() {
    var el = getLoadingNode();
    typePos += 1;
    if (typePos > LOADING.length) {
      typePos = 0;
    }
    el.textContent = LOADING.slice(0, typePos);
  }

  function startTypewriter() {
    stopTypewriter();
    getLoadingNode();
    typePos = 0;
    function tick() {
      typewriterTick();
      typeTimer = window.setTimeout(tick, TYPEWRITER_MS);
    }
    typewriterTick();
    typeTimer = window.setTimeout(tick, TYPEWRITER_MS);
  }

  function stopTypewriter() {
    if (typeTimer !== null) {
      clearTimeout(typeTimer);
      typeTimer = null;
    }
  }

  if (overlay) {
    startTypewriter();
  }

  function revealPage() {
    var images = Array.prototype.slice.call(document.images);
    var videos = Array.prototype.slice.call(document.querySelectorAll('video'));

    var decodeAll = images.map(function (img) {
      if (!img.complete || img.naturalWidth === 0) return Promise.resolve();
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    });

    var videoReady = videos.map(function (video) {
      if (video.readyState >= 2) return Promise.resolve();
      return new Promise(function (resolve) {
        video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', resolve, { once: true });
        setTimeout(resolve, 3000);
      });
    });

    var fontsReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready.catch(function () {})
      : Promise.resolve();

    Promise.all(decodeAll.concat(videoReady).concat([fontsReady])).then(function () {
      var header = document.querySelector('.site-header') || document.querySelector('header');

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            if (header) header.classList.add('no-hover-transition');

            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';

            overlay.addEventListener('transitionend', function onDone() {
              stopTypewriter();
              if (header) header.classList.remove('no-hover-transition');
            }, { once: true });
          });
        });
      });
    });
  }

  window.addEventListener('load', revealPage);

  var prefetched = {};
  document.addEventListener('mouseover', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || /^(https?:|mailto:|#|\/\/)/.test(href) || prefetched[href]) return;
    prefetched[href] = true;
    var el = document.createElement('link');
    el.rel = 'prefetch';
    el.href = link.href;
    document.head.appendChild(el);
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || /^(https?:|mailto:|#|\/\/)/.test(href)) return;

    e.preventDefault();
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.opacity = '1';
    startTypewriter();
    var dest = link.href;
    setTimeout(function () { window.location.href = dest; }, 400);
  });
})();
