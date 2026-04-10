(function () {
  const { Engine, Runner, World, Bodies, Body, Mouse, MouseConstraint, Events } = Matter;

  const imgPaths = [
    'assets/about_stuff/pompom1.png',
    'assets/about_stuff/pompom2.png',
    'assets/about_stuff/pompom3.png',
    'assets/about_stuff/pompom4.png',
    'assets/about_stuff/pompom5.png',
    'assets/about_stuff/pompom6.png',
    'assets/about_stuff/pompom7.png',
    'assets/about_stuff/dog1.png',
    'assets/about_stuff/dog2.png',
    'assets/about_stuff/dog3.png',
    'assets/about_stuff/tomato1.png',
    'assets/about_stuff/tomato2.png',
    'assets/about_stuff/potato.png',
    'assets/about_stuff/koala.png',
    'assets/about_stuff/yuanbao.png',
    'assets/about_stuff/fan.png',
    'assets/about_stuff/treee.png',
    'assets/about_stuff/girl.png'
  ];

  // Fisher-Yates shuffle
  for (let i = imgPaths.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imgPaths[i], imgPaths[j]] = [imgPaths[j], imgPaths[i]];
  }

  const container = document.getElementById('falling-images-container');
  const IMG_SIZE  = 50;
  const W = window.innerWidth;
  const H = window.innerHeight;

  // Physics engine
  const engine = Engine.create();
  engine.world.gravity.y = 2;

  // Static boundaries (invisible)
  const wallOpts = { isStatic: true, render: { visible: false } };
  World.add(engine.world, [
    Bodies.rectangle(W / 2,    H + 25,   W,  50, wallOpts), // floor
    Bodies.rectangle(-25,      H / 2,   50,   H, wallOpts), // left wall
    Bodies.rectangle(W + 25,   H / 2,   50,   H, wallOpts), // right wall
  ]);

  // Create one physics body + one <img> element per image
  const items = imgPaths.map((src, i) => {
    const x = Math.random() * (W - IMG_SIZE) + IMG_SIZE / 2;
    const y = -(IMG_SIZE / 2 + i * (IMG_SIZE + 10)); // stagger above viewport

    const body = Bodies.rectangle(x, y, IMG_SIZE, IMG_SIZE, {
      restitution:   0.35,  // slight bounce
      friction:      0.8,   // grips when resting
      frictionAir:   0.012, // gentle air drag
      frictionStatic: 0.5,
    });

    // Give each body a random initial horizontal nudge and spin
    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 5,
      y: Math.random() * 2,
    });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

    const img = document.createElement('img');
    img.src = src;
    img.className = 'falling-img';
    container.appendChild(img);

    return { body, img };
  });

  World.add(engine.world, items.map(it => it.body));

  // Transparent mouse-capture layer — sits below the images (z-index 99)
  // so clicks pass through the pointer-events:none container to this layer
  const mouseLayer = document.createElement('div');
  mouseLayer.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: ${W}px; height: ${H}px;
    z-index: 99; pointer-events: auto;
    background: transparent;
  `;
  document.body.appendChild(mouseLayer);

  const mouse = Mouse.create(mouseLayer);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  World.add(engine.world, mouseConstraint);

  // Runner drives the engine; sync DOM after every physics step
  const runner = Runner.create();
  Runner.run(runner, engine);

  Events.on(engine, 'afterUpdate', function () {
    items.forEach(({ body, img }) => {
      img.style.left      = `${body.position.x - IMG_SIZE / 2}px`;
      img.style.top       = `${body.position.y - IMG_SIZE / 2}px`;
      img.style.transform = `rotate(${body.angle}rad)`;
    });
  });
})();
