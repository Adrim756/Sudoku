const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const SIZE = 300;
const komorka = SIZE / 9;     // ≈ 33.333 px

const CIENKA = 1;
const GRUBA  = 3;
const HALF_GRUBA = GRUBA / 2;   // 1.5 px – to klucz do „wewnątrz”

// --------------------------------------------------
function rysujPlansze() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "black";

    // 1. Cienkie linie wewnątrz bloków (1 px)
    ctx.lineWidth = CIENKA;
    for (let i = 1; i < 9; i++) {
        const pos = i * komorka;

        // cienkie tylko wewnątrz bloków (nie na granicach 3×3)
        if (i % 3 !== 0) {
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, SIZE);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(SIZE, pos);
            ctx.stroke();
        }
    }

    // 2. Grube linie – przesunięte do środka o połowę grubości
    ctx.lineWidth = GRUBA;

    // pozycje granic bloków: 0, 3, 6, 9 → ale przesuwamy je lekko do środka
    for (let i = 0; i <= 9; i += 3) {
        const pos = i * komorka;

        // pionowe grube – przesunięcie +HALF_GRUBA (do prawej)
        ctx.beginPath();
        ctx.moveTo(pos + HALF_GRUBA, 0);
        ctx.lineTo(pos + HALF_GRUBA, SIZE);
        ctx.stroke();

        // poziome grube – przesunięcie +HALF_GRUBA (w dół)
        ctx.beginPath();
        ctx.moveTo(0, pos + HALF_GRUBA);
        ctx.lineTo(SIZE, pos + HALF_GRUBA);
        ctx.stroke();
    }

    // 3. Zewnętrzna ramka – osobno, cienka lub gruba, ale bez wystawania
    // Jeśli chcesz grubą ramkę zewnętrzną bez wystawania na zewnątrz:
    ctx.lineWidth = GRUBA;
    ctx.strokeRect(
        HALF_GRUBA,           // lewa
        HALF_GRUBA,           // góra
        SIZE - GRUBA,         // szerokość
        SIZE - GRUBA          // wysokość
    );
}

// --------------------------------------------------
function rysujLitere(kol, wiersz, znak) {
    const x = kol * komorka + komorka / 2;
    const y = wiersz * komorka + komorka / 2;

    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.fillText(znak, x, y);
}

// --------------------------------------------------
rysujPlansze();

const litery = ["R", "A", "U", "C", "Z", "Y", "N", "S", "K"];
for (let i = 0; i < 9; i++) {
    rysujLitere(i, i, litery[i]);
}