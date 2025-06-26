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
let czas = 15;
let licznikStart = false;
let monetaImg;
let pokazMonety = false;
let wybranoMonete = false;
let komunikat = "";
let monety = [];
let ukryteMonety = [];
let ostatniZbiór = 0;
let zebraneMonety = 0;
let liczbaProbMonety = 0;
let specjalnaOferta = false;
let EkranGratulacje = false;
let ekranPowitalny = true;


function preload() {
  tloImg = loadImage('sklep_tlo.jpg');
  postac1Img = loadImage('pixel-ludzik.png');
  postac2Img = loadImage('pixel-girl.png');
  koszykImg = loadImage('koszyk.png');
  monetaImg = loadImage('moneta.png');
  

  // Wczytaj obrazki produktów
  produktImg['cola'] = loadImage('cola.png');
  produktImg['cola2'] = loadImage('cola2.png');
  produktImg['czekolada'] = loadImage('czekolada.png');
  produktImg['donut'] = loadImage('donut.png');
  produktImg['monster'] = loadImage('monster.png');
  
  //muzyka
  pickSound = loadSound('pickup.mp3');
  bgMusic = loadSound('bgsound.mp3');
}
 

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(24);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
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
  
ukryteMonety = [
  { x: 80, y: 250, size: 40, collected: false, visible: false },
  { x: 510, y: 250, size: 40, collected: false, visible: false },
  { x: 0, y: 0, size: 40, collected: false, visible: false, active: false }
];
  
  ukryteMonety[0].visible = true;
  ukryteMonety[1].visible = true;
  
  ukryteMonety[2].cannotBeCaught = true;
  
  produkty = [
    { x: 500, y: 235, size: 40, name: 'cola' },
    { x: 360, y: 220, size: 40, name: 'cola2' },
    { x: 220, y: 240, size: 40, name: 'czekolada' },
    { x: 620, y: 260, size: 40, name: 'donut' },
    { x: 70, y: 240, size: 40, name: 'monster' },
  ];
}


function draw() {
  if (ekranPowitalny) {
    rysujEkranPowitalny();
    return;
  }
  
  if (ekranStartowy) {
    rysujEkranStartowy();
    return;
  }
  
  //ekran gratulacje po losowaniu
  if (EkranGratulacje) {
  background(hueValue, 80, 100);
  hueValue = (hueValue + 1) % 360;

  //gwiazdki
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

  let boxWidth = 500;
  let boxHeight = 280;
  let boxX = width / 2 - boxWidth / 2;
  let boxY = height / 2 - boxHeight / 2;

  fill(255);
  stroke(0);
  strokeWeight(4);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(28);
let tekst = "Gratulacje! Wygrałeś nagrodę specjalną!" +
    " Do Twojego koszyka zostało dodane członkostwo VIP w naszym sklepie internetowym!" + 
 " Jego koszt to jedynie 999zł co miesiąc!";

text(tekst, boxX + 20, boxY + 20, boxWidth - 40, boxHeight - 40);
  return;
}
  
  //tło
  image(tloImg, 0, 0, width, height);
  
  // monety zebrane
for (let i = 0; i < zebraneMonety; i++) {
  image(monetaImg, 100 + i * 35, 520, 30, 30);
}
  
  //licznik
  if (!ekranStartowy && !pokazOkno && !pokazMonety) {
  if (!licznikStart) {
    setInterval(() => {
      if (czas > 0) {
        czas--;
        if (czas === 0) {
          pokazOkno = true;
        }
      }
    }, 1000);
    licznikStart = true;
  }
}
  
textSize(40);
stroke(0);
strokeWeight(4);
fill(czas <= 3 ? color(0, 100, 100) : color(60, 100, 100)); // Czerwony, gdy mało czasu
text(czas + "s", 50, 550);
noStroke();
  
  //ukryte monety
  for (let i = 0; i < 3; i++) {
  let m = ukryteMonety[i];
  if (m.visible && !m.collected) {
    image(monetaImg, m.x, m.y, m.size, m.size);
  }
}

  // uciekająca moneta
if (ukryteMonety[2].active && !ukryteMonety[2].collected) {
  let m = ukryteMonety[2];
  let dx = m.x - gracz.x;
  let dy = m.y - gracz.y;
  let distGracz = dist(m.x, m.y, gracz.x, gracz.y);

  if (distGracz < 200) {
    let angle = atan2(dy, dx);
    let speed = map(distGracz, 0, 200, 10, 2); // szybciej im bliżej
    m.x += cos(angle) * speed;
    m.y += sin(angle) * speed;

    // czasem ucieka skokowo w losowe miejsce
    if (random(1) < 0.02) {
  let nowaX, nowaY;
  let proby = 0;
  do {
    nowaX = m.x + random(-50, 50);
    nowaY = m.y + random(-50, 50);
    proby++;
  } while (
    (nowaX < 0 || nowaX > 700 || nowaY < 100 || nowaY > 470 || !nieKolizjaZGraczem({ x: nowaX, y: nowaY }))
    && proby < 10
  );

  m.x = constrain(nowaX, 0, 700);
  m.y = constrain(nowaY, 100, 470);
}

    m.x = constrain(m.x, 0, 700);
    m.y = constrain(m.y, 100, 470);
  }

  image(monetaImg, m.x, m.y, m.size, m.size);
}
  
  // rysuj produkty
  for (let p of produkty) {
  if (produktImg[p.name]) {
    let img = produktImg[p.name];
    let scale = 0.3; // 
    if (p.name === 'donut') {
      scale = 0.25;  // 
    }
    if (p.name === 'cola2') {
      scale = 1;  // 
    }
    let w = img.width * scale;
    let h = img.height * scale;
    image(img, p.x, p.y, w, h);
  }
  }

  // sterowanie gracza
  if (keyIsDown(LEFT_ARROW)) gracz.x -= gracz.speed;
  if (keyIsDown(RIGHT_ARROW)) gracz.x += gracz.speed;
  if (keyIsDown(UP_ARROW)) gracz.y -= gracz.speed;
  if (keyIsDown(DOWN_ARROW)) gracz.y += gracz.speed;

  gracz.x = constrain(gracz.x, 0, 700,);
  gracz.y = constrain(gracz.y, 100, 470,);

  
  // produkty w koszyku
  for (let p of koszyk) {
  if (produktImg[p.name]) {
    if (p.isAnimating) {
      
      // przesuwaj produkt w stronę celu
      p.x += (p.targetX - p.x) * 0.1;
      p.y += (p.targetY - p.y) * 0.1;

      // zatrzymanie animacji przy koszyku
      if (dist(p.x, p.y, p.targetX, p.targetY) < 1) {
        p.x = p.targetX;
        p.y = p.targetY;
        p.isAnimating = false;
      }
    }

    // produkty po wskoczeniu do koszyka 
    let img = produktImg[p.name];
    let scale = 0.1; // 
    if (p.name === 'donut') {
      scale = 0.1;  // 
    }
    if (p.name === 'cola2') {
      scale = 0.5;  // 
    }
    let w = img.width * scale;
    let h = img.height * scale;
    image(img, p.x, p.y, w, h);
  }
}
  
  // koszyk
  if (koszykImg) {
  image(koszykImg, 590, 410, 150, 120); 
  }
  
  //komunikat po skończeniu się czasu
    if (pokazOkno) {
  fill(255);
  stroke(hueValue, 80, 100);
      hueValue = (hueValue + 1) % 360;
  strokeWeight(4);
  rect(width / 2 - 200, height / 2 - 100, 400, 200, 20);

  noStroke();
  fill(0);
  textSize(24);
      
  let tekst = "Niestety promocja się skończyła! Spróbuj następnym razem albo weź udział w specjalnym losowaniu już teraz!";
  let x = width / 2 - 180;
  let y = height / 2 - 60;
  let boxWidth = 360;
  let boxHeight = 180;

  text(tekst, x, y, boxWidth, boxHeight);
      
      
      
//przycisk "Weź udział"
fill(hueValue, 80, 100);
      hueValue = (hueValue + 1) % 360;
rect(width / 2 - 150, height / 2 + 120, 130, 40, 10);
fill(0);
textSize(18);
text("Weź udział", width / 2 - 85, height / 2 + 130);

//przycisk "Innym razem"
fill(100, 100, 100);
rect(width / 2 + 20, height / 2 + 120, 130, 40, 10);
fill(0);
text("Innym razem", width / 2 + 85, height / 2 + 130);
}

  //okno na monety
  if (pokazMonety) {
  fill(255);
  stroke(hueValue, 80, 100);
      hueValue = (hueValue + 1) % 360;
  strokeWeight(4);
  rect(width / 2 - 250, height / 2 - 120, 500, 240, 20);
  noStroke();
    
    // podgląd liczby prób
if (pokazMonety || wybranoMonete) {
  fill(0);
  textSize(22);
  text("Szanse: " + (3 - liczbaProbMonety) + " / 3", width / 2, height / 2 - 100);
}

  //monety
  for (let m of monety) {
    if (!m.kliknieta) {
      image(monetaImg, m.x - 50, m.y - 50, 100, 100);
    }
  }
}

  if (wybranoMonete) {
  fill(0);
  textSize(24);
  text(komunikat, width / 2, height / 2 + 80);

  // przycisk "Spróbuj ponownie"
  fill(hueValue, 80, 100);
      hueValue = (hueValue + 1) % 360;
  rect(width / 2 - 100, height / 2 + 150, 200, 40, 10);
  fill(0);
  textSize(18);
  text("Spróbuj ponownie", width / 2, height / 2 + 160);
}
  
  //gracz - musi być zawsze na końcu draw!
  image(wybranaPostac, gracz.x, gracz.y, gracz.size, gracz.size);
}

function rysujEkranPowitalny() {
  
background(hueValue, 80, 100);
  hueValue = (hueValue + 1) % 360;
  noStroke();
  for (let g of gwiazdki) {
    fill(60, 0, 100, g.alpha / 100);
    ellipse(g.x, g.y, g.size);
    g.y += g.speed;
    if (g.y > height) {
      g.y = 0;
      g.x = random(width);
    }
  }

  let boxWidth = 500;
  let boxHeight = 280;
  let boxX = width / 2 - boxWidth / 2;
  let boxY = height / 2 - boxHeight / 2;

  fill(255);
  stroke(0);
  strokeWeight(4);
  rect(boxX, boxY, boxWidth, boxHeight, 20);
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textSize(16);
  let instrukcja =
    "Zrób zakupy z super promocją!\n\n" +
    "Twoim zadaniem jest zebranie produktów oraz 3 ukrytych monet – masz na to 15 sekund!\n\n" +
    "- Poruszaj się za pomocą strzałek.\n\n" +
    "- Zbieraj produkty i monety naciskając spację.\n\n" +
    "- Naciśnij spacje, aby wybrać postać i zacząć!";
  text(instrukcja, boxX + 20, boxY + 40, boxWidth - 40, boxHeight - 40);
}

function rysujEkranStartowy() {
  
  //tęczowe tło
  background(hueValue, 80, 100);
  hueValue = (hueValue + 1) % 360;

  //gwiazdki
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
  text("Wybierz swoją postać", width / 2, 190);

  image(postac1Img, width / 2 - 150, 250, 100, 150);
  image(postac2Img, width / 2 + 50, 250, 100, 150);

  textSize(20);
  text("Naciśnij 1", width / 2 - 100, 430);
  text("Naciśnij 2", width / 2 + 100, 430);
}

function PrzykrytaMoneta(moneta) {
  for (let p of produkty) {
    let dx = moneta.x + moneta.size/2 - (p.x + p.size/2);
    let dy = moneta.y + moneta.size/2 - (p.y + p.size/2);
    let dystans = Math.sqrt(dx * dx + dy * dy);
    if (dystans < (moneta.size + p.size)/2) {
      return true; // moneta jest przykryta
    }
  }
  return false;
}

function nieKolizjaZGraczem(moneta) {
  let margin = 50; // dystans minimalny między monetą a graczem
  return dist(moneta.x, moneta.y, gracz.x + gracz.size / 2, gracz.y + gracz.size / 2) > margin;
}

function keyPressed() {
  if (ekranPowitalny) {
    ekranPowitalny = false;
    ekranStartowy = true;
    return;
  }
  
  if (millis() - ostatniZbiór < 300) return; 
  
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
  if (pokazOkno && !pokazMonety) {
    //sprawdź czy ludzik jest na przycisku „Innym razem”
    let buttonX = width / 2 + 20;
    let buttonY = height / 2 + 120;
    let buttonW = 130;
    let buttonH = 40;

    if (
      gracz.x + gracz.size > buttonX &&
      gracz.x < buttonX + buttonW &&
      gracz.y + gracz.size > buttonY &&
      gracz.y < buttonY + buttonH
    ) {
      
      //użytkownik wybrał „Innym razem” — reset do ekranu startowego
      ekranStartowy = true;
      pokazOkno = false;
      pokazMonety = false;
      wybranoMonete = false;
      komunikat = "";
      koszyk = [];
      produkty = [
        { x: 500, y: 235, size: 40, name: 'cola' },
        { x: 360, y: 220, size: 40, name: 'cola2' },
        { x: 220, y: 240, size: 40, name: 'czekolada' },
        { x: 620, y: 260, size: 40, name: 'donut' },
        { x: 70, y: 240, size: 40, name: 'monster' },
      ];
      zebraneMonety = 0;
      liczbaProbMonety = 0;
      monety = [];
      ukryteMonety = [
    { x: 80, y: 250, size: 40, collected: false, visible: true },
    { x: 510, y: 250, size: 40, collected: false, visible: true },
    { x: 0, y: 0, size: 40, collected: false, visible: false, active: false, cannotBeCaught: true }
  ];
      czas = 20;
      licznikStart = false;
      return;
    }

    let buttonX2 = width / 2 - 150;
    let buttonY2 = height / 2 + 120;
    let buttonW2 = 130;
    let buttonH2 = 40;

    if (
      gracz.x + gracz.size > buttonX2 &&
      gracz.x < buttonX2 + buttonW2 &&
      gracz.y + gracz.size > buttonY2 &&
      gracz.y < buttonY2 + buttonH2
    ) {
      pokazOkno = false;
      pokazMonety = true;
      wybranoMonete = false;
      komunikat = "";
      monety = [
        { x: width / 2 - 150, y: height / 2, kliknieta: false },
        { x: width / 2, y: height / 2, kliknieta: false },
        { x: width / 2 + 150, y: height / 2, kliknieta: false }
      ];
      return;
    }
  }

    if (pokazMonety && !wybranoMonete) {
  //znajdź monetę, na którą najechał gracz
  for (let m of monety) {
  let dystans = dist(gracz.x + gracz.size / 2, gracz.y + gracz.size / 2, m.x, m.y);
  if (dystans < 50 && !m.kliknieta) {
    m.kliknieta = true;
    liczbaProbMonety++;

    if (liczbaProbMonety === 3) {
      
      specjalnaOferta = true;
      komunikat = "Gratulacje!";
      EkranGratulacje = true;
    } else {
      komunikat = "Brak nagrody!";
    }

    wybranoMonete = true;
    break;
  }
}
  return;
}

if (pokazMonety && wybranoMonete) {
  //sprawdź czy ludzik jest na przycisku „Spróbuj ponownie”
  let btnX = width / 2 - 100;
  let btnY = height / 2 + 150;
  let btnW = 200;
  let btnH = 40;

  if (
    gracz.x + gracz.size > btnX &&
    gracz.x < btnX + btnW &&
    gracz.y + gracz.size > btnY &&
    gracz.y < btnY + btnH
  ) {
    wybranoMonete = false;
    komunikat = "";
    monety = [
      { x: width / 2 - 150, y: height / 2, kliknieta: false },
      { x: width / 2, y: height / 2, kliknieta: false },
      { x: width / 2 + 150, y: height / 2, kliknieta: false }
    ];
  }
  return;
}
    
    //sprawdzanie dla ukrytych monet
for (let i = 0; i < 3; i++) {
  let m = ukryteMonety[i];
  if (m.visible && !m.collected) {
    let dystans = dist(gracz.x + gracz.size/2, gracz.y + gracz.size/2, m.x + m.size/2, m.y + m.size/2);

    
    if (dystans < (gracz.size + m.size)/2 && !PrzykrytaMoneta(m) && !(m.cannotBeCaught)) {
      m.collected = true;
      zebraneMonety++;
      pickSound.play();

      if (i < 2) {
        let count = 0;
        if (ukryteMonety[0].collected) count++;
        if (ukryteMonety[1].collected) count++;
        if (count === 2) {
          ukryteMonety[2].active = true;
          ukryteMonety[2].visible = true;
          ukryteMonety[2].x = random(100, width - 100);
          ukryteMonety[2].y = random(150, height - 150);
          ukryteMonety[2].cannotBeCaught = true;  // moneta uciekająca nie do złapania spacją
        }
      }
      break; 
    }
  }
}
    
    ostatniZbiór = millis();

    //dodawanie produktu do koszyka
    for (let i = produkty.length - 1; i >= 0; i--) {
      let p = produkty[i];
      let dystans = dist(
        gracz.x + gracz.size / 2,
        gracz.y + gracz.size / 2,
        p.x + p.size / 2,
        p.y + p.size / 2
      );

      if (dystans < (gracz.size + p.size) / 2) {
        let targetX = 590 + random(0, 70);
        let targetY = 410 + random(0, 60);
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
}
