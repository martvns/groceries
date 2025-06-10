let produkty = [];
let koszyk = [];
let tloImg;
let postac1Img, postac2Img;
let produktImg = {};
let wybranaPostac;
let ekranStartowy = true;
let hueValue = 0;
let gwiazdki = [];
let koszykImg;
let pickSound;
let bgMusic;
let pokazOkno = false;


function preload() {
  tloImg = loadImage('tlo2.png');
  postac1Img = loadImage('pixel-ludzik.png');
  postac2Img = loadImage('pixel-girl.png');
  koszykImg = loadImage('koszyk.png');
  

  // Wczytaj obrazki produktów
  produktImg['cola'] = loadImage('cola.png');
  produktImg['cola2'] = loadImage('cola2.png');
  produktImg['czekolada'] = loadImage('czekolada.png');
  produktImg['donut'] = loadImage('donut.png');
  produktImg['monster'] = loadImage('monster.png');
  
  pickSound = loadSound('pickup.mp3');
  bgMusic = loadSound('bgsound.mp3');
}
 

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(24);
  colorMode(HSB, 360, 100, 100);
  bgMusic.play();
  bgMusic.loop();
  bgMusic.setVolume(0.3);
  
  
for (let i = 0; i < 50; i++) {
  gwiazdki.push({
    x: random(width),
    y: random(height),
    size: random(2, 5),
    speed: random(0.5, 2),
    alpha: random(50, 100)
  });
}
  
gracz = {
    x: 380,
    y: 100,
    size: 80,
    speed: 4
  };
  
  produkty = [
    { x: 200, y: 200, size: 40, name: 'cola' },
    { x: 150, y: 500, size: 40, name: 'cola2' },
    { x: 500, y: 300, size: 40, name: 'czekolada' },
    { x: 260, y: 350, size: 40, name: 'donut' },
    { x: 620, y: 220, size: 40, name: 'monster' },
  ];
}

function draw() {
  if (ekranStartowy) {
    rysujEkranStartowy();
    return;
  }

  
  image(tloImg, 0, 0, width, height);
  

  // Rysuj produkty
  for (let p of produkty) {
    if (produktImg[p.name]) {
      image(produktImg[p.name], p.x, p.y, p.size, p.size);
    } else {
      fill(150);
      rect(p.x, p.y, p.size, p.size);
    }
  }

  // Sterowanie gracza
  if (keyIsDown(LEFT_ARROW)) gracz.x -= gracz.speed;
  if (keyIsDown(RIGHT_ARROW)) gracz.x += gracz.speed;
  if (keyIsDown(UP_ARROW)) gracz.y -= gracz.speed;
  if (keyIsDown(DOWN_ARROW)) gracz.y += gracz.speed;

  gracz.x = constrain(gracz.x, 100, 650,);
  gracz.y = constrain(gracz.y, 125, 470,);

  image(wybranaPostac, gracz.x, gracz.y, gracz.size, gracz.size);
  
  // Produkty w koszyku
  for (let p of koszyk) {
  if (produktImg[p.name]) {
    if (p.isAnimating) {
      
      // Przesuwaj produkt w stronę celu
      p.x += (p.targetX - p.x) * 0.1;
      p.y += (p.targetY - p.y) * 0.1;

      // Jeśli produkt już bardzo blisko celu — zatrzymaj animację
      if (dist(p.x, p.y, p.targetX, p.targetY) < 1) {
        p.x = p.targetX;
        p.y = p.targetY;
        p.isAnimating = false;
      }
    }

    image(produktImg[p.name], p.x, p.y, 30, 30);
  }
}
  
  // Koszyk
  if (koszykImg) {
  image(koszykImg, 470, 450, 100, 80); 
  }
  
    if (pokazOkno) {
  fill(255);
  stroke(hueValue, 80, 100);
      hueValue = (hueValue + 1) % 360;
  strokeWeight(4);
  rect(width / 2 - 200, height / 2 - 100, 400, 200, 20);

  noStroke();
  fill(hueValue, 80, 100);
      hueValue = (hueValue + 1) % 360;
  textSize(26);
  text("Zakupy zrobione!", width / 2, height / 2 );
}
}
function rysujEkranStartowy() {
  
  // Tęczowe tło
  background(hueValue, 80, 100);
  hueValue = (hueValue + 1) % 360;

  // Gwiazdki
  noStroke();
  for (let g of gwiazdki) {
    fill(60, 0, 100, g.alpha / 100); // białe, błyszczące
    ellipse(g.x, g.y, g.size);
    g.y += g.speed;
    if (g.y > height) {
      g.y = 0;
      g.x = random(width);
    }
  }

  fill(0);
  textSize(32);
  text("Wybierz swoją postać", width / 2, 250);

  image(postac1Img, width / 2 - 150, height/2, 100, 100);
  image(postac2Img, width / 2 + 50, height/2, 100, 100);

  textSize(20);
  text("Naciśnij 1", width / 2 - 100, 450);
  text("Naciśnij 2", width / 2 + 100, 450);
}

function keyPressed() {
  if (ekranStartowy) {
    if (key === '1') {
      wybranaPostac = postac1Img;
      ekranStartowy = false;
    } else if (key === '2') {
      wybranaPostac = postac2Img;
      ekranStartowy = false;
    }
    return;
  }

  if (key === ' ') {
    for (let i = produkty.length - 1; i >= 0; i--) {
      let p = produkty[i];
      let dystans = dist(
        gracz.x + gracz.size / 2,
        gracz.y + gracz.size / 2,
        p.x + p.size / 2,
        p.y + p.size / 2
      );

if (dystans < (gracz.size + p.size) / 2) {
let targetX = 470 + random(0, 70);
let targetY = 450 + random(0, 60);
koszyk.push({
  name: p.name,
  size: p.size,
  x: p.x, 
  y: p.y,
  targetX: targetX,
  targetY: targetY,
  isAnimating: true
});
  produkty.splice(i, 1);
  pickSound.play();
      }
    }
  }
  if (produkty.length === 0) {
  pokazOkno = true;
}
}

