const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const CANVAS_SIZE = 300;
const BOARD_SIZE = 9;
const BLOCK = 3;

const THIN_LINE = 1;
const THICK_LINE = 3;

const CELL = (CANVAS_SIZE - THICK_LINE*4) / 9;

function drawBoard() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Funkcja do rysowania pojedynczej linii
    function drawLine(pos, isVertical, isThick) {
        ctx.beginPath();
        ctx.lineWidth = isThick ? THICK_LINE : THIN_LINE;
        ctx.strokeStyle = "black";
        if (isVertical) {
            ctx.moveTo(pos + ctx.lineWidth/2, 0);
            ctx.lineTo(pos + ctx.lineWidth/2, CANVAS_SIZE);
        } else {
            ctx.moveTo(0, pos + ctx.lineWidth/2);
            ctx.lineTo(CANVAS_SIZE, pos + ctx.lineWidth/2);
        }
        ctx.stroke();
    }

    // Rysowanie poziomych linii
    let y = 0;
    for (let r = 0; r <= BOARD_SIZE; r++) {
        const isThick = (r % BLOCK === 0);
        drawLine(y, false, isThick);
        y += CELL;
        if (isThick) y += THICK_LINE;
    }

    // Rysowanie pionowych linii
    let x = 0;
    for (let c = 0; c <= BOARD_SIZE; c++) {
        const isThick = (c % BLOCK === 0);
        drawLine(x, true, isThick);
        x += CELL;
        if (isThick) x += THICK_LINE;
    }
}

// Funkcja do rysowania litery w kwadracie
function draw_letter(col, row, letter) {
    let x = 0;
    for (let c = 0; c < col; c++) {
        x += CELL;
        if (c % BLOCK === 2) x += THICK_LINE;
        else x += THIN_LINE;
    }

    let y = 0;
    for (let r = 0; r < row; r++) {
        y += CELL;
        if (r % BLOCK === 2) y += THICK_LINE;
        else y += THIN_LINE;
    }

    // Środek kwadratu
    let centerX = x + CELL/2;
    let centerY = y + CELL/2;

    // Ustawienia tekstu
    ctx.font = "12px sans-serif";
    ctx.textBaseline = "middle"; // pionowe wyśrodkowanie
    ctx.textAlign = "center";    // poziome wyśrodkowanie
    ctx.fillStyle = "black";

    // Rysujemy literę
    ctx.fillText(letter, centerX, centerY);
}

// Rysujemy planszę
drawBoard();

// Wpisujemy litery RAUCZYNSKI na przekątnej
const letters = ["R","A","U","C","Z","Y","N","S","K"];
for (let i = 0; i < letters.length; i++) {
    draw_letter(i, i, letters[i]);
}
