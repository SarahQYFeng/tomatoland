const descriptionArea = document.getElementById('description-area');
const works = document.querySelectorAll('.work');

works.forEach(work => {
    const desc = work.getAttribute('data-description');

    work.addEventListener('mouseenter', () => {
        // descriptionArea.textContent = desc;
        descriptionArea.innerHTML = desc;
    });

    work.addEventListener('mouseleave', () => {
        descriptionArea.innerHTML = '🍅↖(#^.^#)↗🍅<br>Hi human, welcome to <br>TOMATOLAND.';
    });
});

const unavailable_works = document.querySelectorAll('.not_available_work');

unavailable_works.forEach(unavailable_work => {
    const desc = unavailable_work.getAttribute('data-description');

    unavailable_work.addEventListener('mouseenter', () => {
        descriptionArea.innerHTML = desc;
    });

    unavailable_work.addEventListener('mouseleave', () => {
        descriptionArea.innerHTML = '🍅↖(#^.^#)↗🍅<br>Hi human, welcome to <br>TOMATOLAND.';
    });
});

const title =  document.querySelector('.nav-link');
const desc_title = title.getAttribute('title-description');

title.addEventListener('mouseenter', () => {
    // descriptionArea.textContent = desc;
    descriptionArea.innerHTML = desc_title;
});

title.addEventListener('mouseleave', () => {
    descriptionArea.innerHTML = '🍅↖(#^.^#)↗🍅<br>Hi human, welcome to <br>TOMATOLAND.';
});

const scrollAmount = 380; 

document.querySelector('.next').addEventListener('click', () => {
    window.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

document.querySelector('.prev').addEventListener('click', () => {
    window.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});


function keyPressed() {
  if (keyCode === ArrowRight) {
    window.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  if (keyCode === ArrowLeft) {
    window.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}


const rainContainer = document.getElementById('rain-container');
const raindropSrc = 'assets/meta/tomato.png';

const dropSize = 20;
const removeDelay = 8000; 
const initialDelay = 50000;

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
    for (let i = 0; i < drops; i++) {
      createRaindrop();
    }
  }, 800); 

  setTimeout(() => {
    clearInterval(rainInterval);
    setTimeout(startRainCycle, Math.random()* 40000 + 20000); 
  }, rainDuration);
}

setTimeout(startRainCycle, initialDelay);
