// pobranie elementu canvas z HTML (plansza gry)
var canvas = document.getElementById("board");
// pobranie kontekstu 2D – dzięki temu możemy rysować linie, prostokąty i tekst
var ctx = canvas.getContext("2d");

// ===============================
// STAŁE – ROZMIARY I LINIE
// ===============================

// całkowity rozmiar planszy w pikselach (300x300)
var rozmiar = 300;

// rozmiar jednej kratki (plansza 9x9)
var kratka = rozmiar / 9;

// grubość cienkich linii siatki
var cienkaLinia = 2;

// grubość grubych linii oddzielających bloki 3x3
var grubaLinia = 3;

// połowa grubej linii – potrzebna, żeby linie były rysowane symetrycznie
var polowaGrubej = grubaLinia / 2;


// ===============================
// LITERY ZAMIAST CYFR
// ===============================

// tablica liter używanych w sudoku zamiast cyfr
// indeks 0–8 odpowiada kolejnym literom
var litery = ["R", "A", "U", "C", "Z", "Y", "N", "S", "K"];


// ===============================
// GOTOWE PLANSZE STARTOWE
// ===============================

// tablica przechowująca wiele gotowych plansz sudoku
// każda plansza to tablica 9x9
// -1 oznacza puste pole
// liczby 1–9 oznaczają pola startowe (nie do zmiany)
var plansze = [
[
  [8,-1,-1,2,6,-1,7,-1,1],
  [-1,4,-1,-1,8,-1,-1,6,-1],
  [-1,-1,1,-1,-1,-1,9,-1,-1],

  [5,-1,-1,6,-1,3,-1,-1,7],
  [-1,8,-1,-1,-1,-1,-1,5,-1],
  [7,-1,-1,9,-1,8,-1,-1,2],

  [-1,-1,9,-1,-1,-1,6,-1,-1],
  [-1,2,-1,-1,1,-1,-1,8,-1],
  [4,-1,6,-1,9,2,-1,-1,5]
],

[
  [-1,2,-1,6,-1,8,-1,-1,-1],
  [5,8,-1,-1,-1,9,7,-1,-1],
  [-1,-1,-1,-1,4,-1,-1,-1,-1],

  [3,7,-1,-1,-1,-1,5,-1,-1],
  [6,-1,-1,-1,-1,-1,-1,-1,4],
  [-1,-1,8,-1,-1,-1,-1,1,3],

  [-1,-1,-1,-1,2,-1,-1,-1,-1],
  [-1,-1,9,8,-1,-1,-1,3,6],
  [-1,-1,-1,3,-1,6,-1,9,-1]
],

// kolejne plansze – identyczna struktura,
// różnią się tylko układem startowych liczb
// (losowana będzie jedna z nich)

];


// ===============================
// BLOKADA POL STARTOWYCH
// ===============================

// tablica 9x9 mówiąca, które pola są startowe
// true  → pole startowe (nie można go zmieniać)
// false → pole edytowalne przez gracza
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


// ===============================
// AKTUALNA PLANSZA GRY
// ===============================

// tablica 9x9 przechowująca stan gry
// -1 → puste pole
// 0–8 → indeks litery z tablicy „litery”
var tablica = [
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1]
];


// ===============================
// INICJALIZACJA PLANSZY
// ===============================

// funkcja przygotowująca nową grę
function inicjalizujPlanszeStartowa() {

  // czyszczenie aktualnej planszy i blokad
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      tablica[r][c] = -1;     // ustawiamy pole jako puste
      startowe[r][c] = false; // zdejmujemy blokadę
    }
  }

  // losujemy jedną planszę z tablicy „plansze”
  var los = Math.floor(Math.random() * plansze.length);
  var p = plansze[los];

  // przepisujemy wylosowaną planszę do aktualnej gry
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (p[r][c] !== -1) {
        tablica[r][c] = p[r][c] - 1; // zamiana 1–9 na 0–8
        startowe[r][c] = true;       // oznaczamy pole jako startowe
      }
    }
  }
}

// ===============================
// RYSOWANIE SIATKI SUDOKU
// ===============================

// funkcja rysuje całą siatkę – wywoływana na początku i po każdym kliknięciu
function narysujSiatke() {

  // czyścimy cały canvas
  ctx.clearRect(0, 0, rozmiar, rozmiar);

  // ustawiamy kolor linii na czarny
  ctx.strokeStyle = "rgb(0,0,0)";

  // ===============================
  // CIENKIE LINIE (wewnątrz bloków 3x3)
  // ===============================

  ctx.lineWidth = cienkaLinia;

  for (var i = 1; i < 9; i++) {
    var pozycja = i * kratka;

    // rysujemy tylko linie, które NIE są granicą bloku 3x3
    if (i % 3 !== 0) {

      // pionowa cienka linia
      ctx.beginPath();
      ctx.moveTo(pozycja, 0);
      ctx.lineTo(pozycja, rozmiar);
      ctx.stroke();

      // pozioma cienka linia
      ctx.beginPath();
      ctx.moveTo(0, pozycja);
      ctx.lineTo(rozmiar, pozycja);
      ctx.stroke();
    }
  }

  // ===============================
  // GRUBE LINIE (granice bloków 3x3)
  // ===============================

  ctx.lineWidth = grubaLinia;

  for (var i = 0; i <= 9; i = i + 3) {
    var pozycja = i * kratka;

    // pionowa gruba linia
    ctx.beginPath();
    ctx.moveTo(pozycja + polowaGrubej, 0);
    ctx.lineTo(pozycja + polowaGrubej, rozmiar);
    ctx.stroke();

    // pozioma gruba linia
    ctx.beginPath();
    ctx.moveTo(0, pozycja + polowaGrubej);
    ctx.lineTo(rozmiar, pozycja + polowaGrubej);
    ctx.stroke();
  }

  // zewnętrzna ramka planszy
  ctx.strokeRect(
    polowaGrubej,
    polowaGrubej,
    rozmiar - grubaLinia,
    rozmiar - grubaLinia
  );
}

// ===============================
// RYSOWANIE POJEDYNCZEJ KRATKI
// ===============================

// funkcja rysuje literę albo tło kratki
function draw_letter(kolumna, wiersz) {

  // lewy górny róg kratki
  var x = kolumna * kratka;
  var y = wiersz * kratka;

  // numer litery zapisany w tablicy
  var numerLitery = tablica[wiersz][kolumna];

  // pozycja kratki w bloku 3x3
  var blokCol = kolumna % 3;
  var blokRow = wiersz % 3;

  // przesunięcia i korekty rozmiaru
  var offsetX = 0;
  var offsetY = 0;
  var adjustWidth = 0;
  var adjustHeight = 0;

  // ===============================
  // SPECJALNE PRZYPADKI – OSTATNI WIERSZ / KOLUMNA
  // ===============================

  if (wiersz === 8 || kolumna === 8) {

    // prawy dolny róg planszy
    if (wiersz === 8 && kolumna === 8) {
      offsetX = 0;
      offsetY = 0;
      adjustWidth = -3;
      adjustHeight = -3;
    }

    // ostatni wiersz
    else if (wiersz === 8) {
      if (kolumna === 0) { offsetX = 3; offsetY = 0; adjustWidth = -3; adjustHeight = -3; }
      if (kolumna === 1) { offsetX = 0.5; offsetY = 0; adjustWidth = -1; adjustHeight = -3; }
      if (kolumna === 2) { offsetX = 0; offsetY = 0; adjustWidth = 0; adjustHeight = -3; }
      if (kolumna === 3) { offsetX = 3; offsetY = 0; adjustWidth = -3; adjustHeight = -3; }
      if (kolumna === 4) { offsetX = 0.5; offsetY = 0; adjustWidth = -1; adjustHeight = -3; }
      if (kolumna === 5) { offsetX = 0; offsetY = 0; adjustWidth = 0; adjustHeight = -3; }
      if (kolumna === 6) { offsetX = 3; offsetY = 0; adjustWidth = -3; adjustHeight = -3; }
      if (kolumna === 7) { offsetX = 0.5; offsetY = 0; adjustWidth = -1; adjustHeight = -3; }
    }

    // ostatnia kolumna
    else if (kolumna === 8) {
      if (wiersz === 0) { offsetX = 0; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
      if (wiersz === 1) { offsetX = 0; offsetY = 0.5; adjustWidth = -3; adjustHeight = -1; }
      if (wiersz === 2) { offsetX = 0; offsetY = 0; adjustWidth = -3; adjustHeight = 0; }
      if (wiersz === 3) { offsetX = 0; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
      if (wiersz === 4) { offsetX = 0; offsetY = 0.5; adjustWidth = -3; adjustHeight = -1; }
      if (wiersz === 5) { offsetX = 0; offsetY = 0; adjustWidth = -3; adjustHeight = 0; }
      if (wiersz === 6) { offsetX = 0; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
      if (wiersz === 7) { offsetX = 0; offsetY = 0.5; adjustWidth = -3; adjustHeight = -1; }
    }
  }

  // ===============================
  // RESZTA PLANSZY
  // ===============================

  else if (wiersz <= 7) {

    // górny rząd bloku 3x3
    if (blokRow === 0) {
      if (blokCol === 0) { offsetX = 3; offsetY = 3; adjustWidth = -3; adjustHeight = -3; }
      else if (blokCol === 1) { offsetX = 0.5; offsetY = 3; adjustWidth = -1; adjustHeight = -3; }
      else if (blokCol === 2) { offsetX = 0; offsetY = 3; adjustWidth = 0; adjustHeight = -3; }
    }

    // środek bloku
    if (blokRow === 1) {
      if (blokCol === 0) { offsetX = 3; offsetY = 0.5; adjustWidth = -3; adjustHeight = -1; }
      else if (blokCol === 1) { offsetX = 0.5; offsetY = 0.5; adjustWidth = -1; adjustHeight = -1; }
      else if (blokCol === 2) { offsetX = 0; offsetY = 0.5; adjustWidth = 0; adjustHeight = -1; }
    }

    // dolny rząd bloku
    if (blokRow === 2) {
      if (blokCol === 0) { offsetX = 3; offsetY = 0; adjustWidth = -3; adjustHeight = 0; }
      else if (blokCol === 1) { offsetX = 0.5; offsetY = 0; adjustWidth = -1; adjustHeight = 0; }
      else if (blokCol === 2) { offsetX = 0; offsetY = 0; adjustWidth = 0; adjustHeight = 0; }
    }
  }

  // ===============================
  // RYSOWANIE TŁA KRATKI
  // ===============================

  // inne tło dla pól startowych
  ctx.fillStyle = startowe[wiersz][kolumna]
    ? "rgb(62,68,70)"
    : "rgb(46,52,54)";

  ctx.fillRect(
    x + offsetX,
    y + offsetY,
    kratka + adjustWidth,
    kratka + adjustHeight
  );

  // ===============================
  // RYSOWANIE LITERY
  // ===============================

  if (numerLitery >= 0) {

    // środek kratki
    var srodekX = x + kratka / 2;
    var srodekY = y + kratka / 1.9;

    // pogrubiona czcionka dla pól startowych
    ctx.font = startowe[wiersz][kolumna]
      ? "bold 22px Arial"
      : "22px Arial";

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // rysujemy literę
    ctx.fillText(litery[numerLitery], srodekX, srodekY);
  }
}

// ===============================
// SPRAWDZANIE WYGRANEJ
// ===============================

var wygrana = false;

// sprawdza wiersze, kolumny i bloki 3x3
function sprawdzWygrana() {

  // wiersze i kolumny
  for (var r = 0; r < 9; r++) {
    var wierszSet = new Set();
    var kolumnaSet = new Set();

    for (var c = 0; c < 9; c++) {
      var valW = tablica[r][c];
      var valK = tablica[c][r];

      // puste pole = brak wygranej
      if (valW < 0 || valK < 0) return false;

      // powtórzenie = błąd
      if (wierszSet.has(valW) || kolumnaSet.has(valK)) return false;

      wierszSet.add(valW);
      kolumnaSet.add(valK);
    }
  }

  // bloki 3x3
  for (var br = 0; br < 3; br++) {
    for (var bc = 0; bc < 3; bc++) {
      var blokSet = new Set();

      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          var val = tablica[br * 3 + r][bc * 3 + c];
          if (blokSet.has(val)) return false;
          blokSet.add(val);
        }
      }
    }
  }

  return true;
}

// ===============================
// EKRAN WYGRANEJ
// ===============================

function wyswietlWygrana() {

  var tekst = "Wygrrrana!";
  ctx.font = "50px sans-serif";

  var srodekX = rozmiar / 2;
  var srodekY = rozmiar / 2;

  // obrys tekstu
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgb(57,105,11)";
  ctx.strokeText(tekst, srodekX, srodekY);

  // wypełnienie tekstu
  ctx.fillStyle = "rgb(87,180,41)";
  ctx.fillText(tekst, srodekX, srodekY);
}

// ===============================
// OBSŁUGA KLIKNIĘCIA
// ===============================

function poKliknieciu(e) {

  // jeśli już wygrana – restart gry
  if (wygrana) {

    inicjalizujPlanszeStartowa();
    narysujSiatke();

    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        if (tablica[r][c] >= 0) draw_letter(c, r);
      }
    }

    wygrana = false;
    return;
  }

  // pozycja myszy względem canvas
  var prostokat = canvas.getBoundingClientRect();
  var myszX = e.clientX - prostokat.left;
  var myszY = e.clientY - prostokat.top;

  // obliczenie klikniętej kratki
  var kolumna = Math.floor(myszX / kratka);
  var wiersz = Math.floor(myszY / kratka);

  // klik poza planszą
  if (kolumna < 0 || kolumna > 8 || wiersz < 0 || wiersz > 8) return;

  // nie można zmieniać pól startowych
  if (startowe[wiersz][kolumna]) return;

  // zmiana litery (cyklicznie)
  var aktualnyNumer = tablica[wiersz][kolumna];
  if (aktualnyNumer == -1) tablica[wiersz][kolumna] = 0;
  else if (aktualnyNumer < litery.length - 1) tablica[wiersz][kolumna] += 1;
  else tablica[wiersz][kolumna] = -1;

  // przerysowanie planszy
  narysujSiatke();
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (tablica[r][c] >= 0) draw_letter(c, r);
    }
  }

  // sprawdzamy, czy wygrana
  if (sprawdzWygrana()) {
    wygrana = true;
    wyswietlWygrana();
  }
}

// ===============================
// START PROGRAMU
// ===============================

inicjalizujPlanszeStartowa();
narysujSiatke();

for (var r = 0; r < 9; r++) {
  for (var c = 0; c < 9; c++) {
    if (tablica[r][c] >= 0) draw_letter(c, r);
  }
}

// obsługa kliknięcia myszą
canvas.addEventListener("click", poKliknieciu);