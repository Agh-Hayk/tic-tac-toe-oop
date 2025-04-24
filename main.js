/* ===== Constants & helpers ===== */
const PLAYERS = ["X", "O"];
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

/* ===== Game logic (model) ===== */
class TicTacToe {
  #board = Array(9).fill(null);
  #current = 0; // index in PLAYERS
  #winner = null;
  #onChange;
  constructor(onChange) {
    this.#onChange = onChange;
  }
  move(idx) {
    if (this.#board[idx] || this.#winner) return;
    this.#board[idx] = PLAYERS[this.#current];
    const winLine = this.#findWin();
    if (winLine) {
      this.#winner = PLAYERS[this.#current];
    } else if (!this.#board.includes(null)) {
      this.#winner = "Draw";
    } else {
      this.#current ^= 1;
    }
    this.#onChange({
      board: [...this.#board],
      player: PLAYERS[this.#current],
      winner: this.#winner,
      winLine,
    });
  }
  reset() {
    this.#board.fill(null);
    this.#current = 0;
    this.#winner = null;
    this.#onChange({
      board: [...this.#board],
      player: PLAYERS[0],
      winner: null,
      winLine: null,
    });
  }
  #findWin() {
    return (
      WIN_LINES.find(([a, b, c]) => {
        const v = this.#board[a];
        return v && v === this.#board[b] && v === this.#board[c];
      }) || null
    );
  }
}

/* ===== UI layer (view-controller) ===== */
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

// Build cells once for better performance
const cells = Array.from({ length: 9 }, (_, i) => {
  const div = document.createElement("div");
  div.className = "cell";
  div.dataset.index = i;
  div.setAttribute("role", "gridcell");
  boardEl.appendChild(div);
  return div;
});

const game = new TicTacToe(render);

boardEl.addEventListener("click", (e) => {
  const el = e.target.closest(".cell");
  if (!el) return;
  game.move(+el.dataset.index);
});

restartBtn.addEventListener("click", () => game.reset());

function render({ board, player, winner, winLine }) {
  // update cells
  board.forEach((mark, i) => {
    cells[i].textContent = mark || "";
    cells[i].classList.toggle("x", mark === "X");
    cells[i].classList.toggle("o", mark === "O");
    cells[i].classList.remove("win");
  });
  if (winLine) winLine.forEach((i) => cells[i].classList.add("win"));

  // update status
  statusEl.textContent = winner
    ? winner === "Draw"
      ? "🤝 Draw!"
      : `🎉 ${winner} wins!`
    : `Turn: ${player}`;
}

// initialise view
game.reset();
