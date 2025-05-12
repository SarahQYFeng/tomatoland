const images = document.querySelectorAll('.images');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible'); 
    }
  });
}, {
  threshold: 0.1
});

images.forEach(img => {
  observer.observe(img);
});

const ver_images = document.querySelectorAll('.ver_images');

const ver_observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible'); 
    }
  });
}, {
  threshold: 0.1
});

ver_images.forEach(img => {
  ver_observer.observe(img);
});