// pobieramy canvas i kontekst
var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");

// stałe – rozmiary i grubości linii
var rozmiar = 300;          // caly obrazek 300x300
var kratka = rozmiar / 9;   // jedna kratka ≈33.33 px
var cienkaLinia = 1;
var grubaLinia = 3;
var polowaGrubej = grubaLinia / 2; // 1.5 px żeby linie były symetryczne

// litery z nazwiska (bez litery "I" bo sie powtarza)
var litery = ["R", "A", "U", "C", "Z", "Y", "N", "S", "K"];

// tablica co jest w każdej kratce – Twoja klasyczna mapa
var tablica = [
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1],
  [-1,-1,-1, -1,-1,-1, -1,-1,-1]
];

// tablica blokująca startowe litery (true = nie można zmieniać)
var startowe = [
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false],
  [false,false,false,false,false,false,false,false,false]
];

// --- 6. Początkowa plansza (przykładowa z Sudoku) ---
function inicjalizujPlanszeStartowa() {
  var przyklad = [
    [5,3,-1, -1,7,-1, -1,-1,-1],
    [6,-1,-1, 1,9,5, -1,-1,-1],
    [-1,9,8, -1,-1,-1, -1,6,-1],

    [8,-1,-1, -1,6,-1, -1,-1,3],
    [4,-1,-1, 8,-1,3, -1,-1,1],
    [7,-1,-1, -1,2,-1, -1,-1,6],

    [-1,6,-1, -1,-1,-1, 2,8,-1],
    [-1,-1,-1, 4,1,9, -1,-1,5],
    [-1,-1,-1, -1,8,-1, -1,7,9]
  ];

  for (var r=0; r<9; r++) {
    for (var c=0; c<9; c++) {
      if (przyklad[r][c] !== -1) {
        tablica[r][c] = przyklad[r][c] - 1; // zamiana na indeks 0-8
        startowe[r][c] = true;               // blokada startowych liter
      }
    }
  }
}


// funkcja rysuje całą siatkę – robimy to tylko raz na początku
function narysujSiatke() {
  ctx.clearRect(0, 0, rozmiar, rozmiar); // czyścimy wszystko
  ctx.strokeStyle = "black";             // kolor linii = czarny

  // rysujemy cienkie linie (1 px) – tylko wewnątrz bloków 3x3
  ctx.lineWidth = cienkaLinia;
  for (var i = 1; i < 9; i++) {
    var pozycja = i * kratka;
    if (i % 3 !== 0) { // jeśli nie jest to gruba linia
      // pionowa cienka
      ctx.beginPath();
      ctx.moveTo(pozycja, 0);
      ctx.lineTo(pozycja, rozmiar);
      ctx.stroke();

      // pozioma cienka
      ctx.beginPath();
      ctx.moveTo(0, pozycja);
      ctx.lineTo(rozmiar, pozycja);
      ctx.stroke();
    }
  }

  // rysujemy grube linie (3 px) – granice bloków 3x3
  ctx.lineWidth = grubaLinia;
  for (var i = 0; i <= 9; i = i + 3) {
    var pozycja = i * kratka;

    // pionowa gruba
    ctx.beginPath();
    ctx.moveTo(pozycja + polowaGrubej, 0);
    ctx.lineTo(pozycja + polowaGrubej, rozmiar);
    ctx.stroke();

    // pozioma gruba
    ctx.beginPath();
    ctx.moveTo(0, pozycja + polowaGrubej);
    ctx.lineTo(rozmiar, pozycja + polowaGrubej);
    ctx.stroke();
  }

  // zewnętrzna gruba ramka dookoła całego obrazka
  ctx.strokeRect(polowaGrubej, polowaGrubej, rozmiar - grubaLinia, rozmiar - grubaLinia);
}

// funkcja wpisuje literę albo czyści kratkę
function draw_letter(kolumna, wiersz) {
  var x = kolumna * kratka;
  var y = wiersz * kratka;
  var numerLitery = tablica[wiersz][kolumna];

  // oblicz pozycję w bloku 3x3
  var blokCol = kolumna % 3; // 0 = lewy, 1 = środek, 2 = prawy
  var blokRow = wiersz % 3;  // 0 = górny, 1 = środek, 2 = dolny

  var offsetX = 0;
  var offsetY = 0;
  var adjustWidth = 0;
  var adjustHeight = 0;

  // === PIERWSZE 8 WIERSZY (0-7) – ustawienia po blokach 3x3 ===
// === SPECJALNA OBSŁUGA OSTATNIEJ KOLUMNY (kolumna 8) ===
// === SPECJALNA OBSŁUGA OSTATNIEGO WIERSZA I KOLUMNY ===
if (wiersz === 8 || kolumna === 8) {
  if (wiersz === 8 && kolumna === 8) { 
    offsetX = 0; offsetY = 0; adjustWidth = -3; adjustHeight = -3; 
  } else if (wiersz === 8) {
    // ostatni wiersz, kolumny 0-7
    if (kolumna === 0) { offsetX = 3;  offsetY = 0;  adjustWidth = -3; adjustHeight = -3; }
    if (kolumna === 1) { offsetX = 0.5;offsetY = 0;  adjustWidth = -1; adjustHeight = -3; }
    if (kolumna === 2) { offsetX = 0;  offsetY = 0;  adjustWidth = 0;  adjustHeight = -3; }
    if (kolumna === 3) { offsetX = 3;  offsetY = 0;  adjustWidth = -3; adjustHeight = -3; }
    if (kolumna === 4) { offsetX = 0.5;offsetY = 0;  adjustWidth = -1; adjustHeight = -3; }
    if (kolumna === 5) { offsetX = 0;  offsetY = 0;  adjustWidth = 0;  adjustHeight = -3; }
    if (kolumna === 6) { offsetX = 3;  offsetY = 0;  adjustWidth = -3; adjustHeight = -3; }
    if (kolumna === 7) { offsetX = 0.5;offsetY = 0;  adjustWidth = -1; adjustHeight = -3; }
  } else if (kolumna === 8) {
    // ostatnia kolumna, wiersze 0-7
    if (wiersz === 0) { offsetX = 0; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
    if (wiersz === 1) { offsetX = 0; offsetY = 0.5;  adjustWidth = -3;  adjustHeight = -1 }
    if (wiersz === 2) { offsetX = 0; offsetY = 0;  adjustWidth = -3; adjustHeight = 0; }
    if (wiersz === 3) { offsetX = 0; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
    if (wiersz === 4) { offsetX = 0; offsetY = 0.5;  adjustWidth = -3;  adjustHeight = -1  }
    if (wiersz === 5) { offsetX = 0; offsetY = 0;  adjustWidth = -3; adjustHeight = 0; }
    if (wiersz === 6) { offsetX = 0; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
    if (wiersz === 7) { offsetX = 0; offsetY = 0.5;  adjustWidth = -3;  adjustHeight = -1  }
  }
}
// === RESZTA PLANSZY (kolumny 0–7) ===
else if (wiersz <= 7) {
  // górny rząd bloku
  if (blokRow === 0) {
    if (blokCol === 0) {
      offsetX = 3; offsetY = 3; adjustWidth = -3; adjustHeight = -3;
    } else if (blokCol === 1) {
      offsetX = 0.5; offsetY = 3; adjustWidth = -1; adjustHeight = -3;
    } else if (blokCol === 2) {
      offsetX = 0; offsetY = 3; adjustWidth = 0; adjustHeight = -3;
    }
  }

  // środkowy rząd
  if (blokRow === 1) {
    if (blokCol === 0) {
      offsetX = 3; offsetY = 0.5; adjustWidth = -3; adjustHeight = -1;
    } else if (blokCol === 1) {
      offsetX = 0.5; offsetY = 0.5; adjustWidth = -1; adjustHeight = -1;
    } else if (blokCol === 2) {
      offsetX = 0; offsetY = 0.5; adjustWidth = 0; adjustHeight = -1;
    }
  }

  // dolny rząd
  if (blokRow === 2) {
    if (blokCol === 0) {
      offsetX = 3; offsetY = 0; adjustWidth = -3; adjustHeight = 0;
    } else if (blokCol === 1) {
      offsetX = 0.5; offsetY = 0; adjustWidth = -1; adjustHeight = 0;
    } else if (blokCol === 2) {
      offsetX = 0; offsetY = 0; adjustWidth = 0; adjustHeight = 0;
    }
  }
}
  // rysuj tło z przesunięciem i dopasowanym rozmiarem
  ctx.fillStyle = "rgb(46,52,54)";
  ctx.fillRect(
    x + offsetX,
    y + offsetY,
    kratka + adjustWidth,
    kratka + adjustHeight
  );

  // jeśli jest litera – rysujemy ją na biało
  if (numerLitery >= 0) {
    var srodekX = x + kratka / 2;
    var srodekY = y + kratka / 1.9;

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(litery[numerLitery], srodekX, srodekY);
  }
}

// co się dzieje jak ktoś kliknie
function poKliknieciu(e) {
  var prostokat = canvas.getBoundingClientRect();
  var myszX = e.clientX - prostokat.left;
  var myszY = e.clientY - prostokat.top;

  var kolumna = Math.floor(myszX / kratka);
  var wiersz = Math.floor(myszY / kratka);

  if (kolumna < 0 || kolumna > 8 || wiersz < 0 || wiersz > 8) return;

  // blokada startowych liter
  if (startowe[wiersz][kolumna]) return;

  var aktualnyNumer = tablica[wiersz][kolumna];
  if (aktualnyNumer == -1) tablica[wiersz][kolumna] = 0;
  else if (aktualnyNumer < litery.length-1) tablica[wiersz][kolumna] += 1;
  else tablica[wiersz][kolumna] = -1;

  narysujSiatke();
  for (var r=0; r<9; r++) {
    for (var c=0; c<9; c++) {
      if (tablica[r][c] >= 0) draw_letter(c,r);
    }
  }
}

// start programu
inicjalizujPlanszeStartowa();
narysujSiatke();
for (var r=0; r<9; r++) {
  for (var c=0; c<9; c++) {
    if (tablica[r][c]>=0) draw_letter(c,r);
  }
}
canvas.addEventListener("click", poKliknieciu);