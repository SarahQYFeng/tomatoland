(function () {
  var bgColor = getComputedStyle(document.body).backgroundColor;
  if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
    bgColor = '#ffffff';
  }

  var style = document.createElement('style');
  style.textContent = [
    '#page-transition-overlay {',
    '  position: fixed; top: 0; left: 0; right: 0; bottom: 0;',
    '  background: ' + bgColor + '; pointer-events: none; z-index: 999;',
    '  opacity: 1; will-change: opacity;',
    '}',
    '.no-hover-transition a {',
    '  transition: color .4s ease !important;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  var overlay = document.getElementById('page-transition-overlay');

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
            // 禁用 header 链接的 font-weight 过渡，防止光标位置导致字重动画透过 overlay 可见
            if (header) header.classList.add('no-hover-transition');

            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';

            overlay.addEventListener('transitionend', function onDone() {
              overlay.removeEventListener('transitionend', onDone);
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
    var dest = link.href;
    setTimeout(function () { window.location.href = dest; }, 400);
  });
})();
