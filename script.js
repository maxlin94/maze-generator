import Player from "./Player.js";
import Grid from "./Grid.js";
const generateMazeBtn = document.querySelector(".generate");
const solveMazeBtn = document.querySelector(".solve");
const delayInput = document.querySelector(".delay");
const playAgainBtn = document.querySelector(".play-again");
const winDialog = document.querySelector(".win");
const sizeInput = document.querySelector(".size");
const algoInput = document.querySelector(".algo");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const height = 720;
const width = 1200;
const playerColor = "orange";
const size = sizeInput.value;
const delay = delayInput.value;
ctx.scale(size, size);
const board = new Grid(height, width, size, ctx, delay);
const player = new Player(playerColor, ctx, 0.5);
player.grid = board.grid;
player.goal = board.goal;

function resetCanvas() {
    solveMazeBtn.style.display = "none";
    generateMazeBtn.style.display = "";
    ctx.fillStyle = board.backgroundColor;
    ctx.fillRect(0, 0, width, height);
}

function resetGrid() {
    board.grid = board.createGrid();
    player.grid = board.grid;
    player.goal = board.goal;
    player.x = 0;
    player.y = 0;
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.x) / board.size);
    const y = Math.floor((e.clientY - rect.y) / board.size);
    return { x, y };
}

canvas.addEventListener("click", (e) => {
    const { x, y } = getMousePos(e);
    console.log(board.grid[x][y]);
    const test = board.grid.flat()
    let count = 0
    while(count < 10000) {
        const rand = Math.floor(Math.random() * test.length)
        const node = test[rand]
        node.paint()
        count++
    }
});

generateMazeBtn.addEventListener("click", async () => {
    const algo = algoInput.value;
    resetCanvas();
    generateMazeBtn.style.display = "none";
    sizeInput.parentElement.style.display = "none";
    algoInput.parentElement.style.display = "none";
    if (board.grid[0][0].visited) {
        resetGrid();
    }
    if (algo === "iterative") {
        await board.generateMaze();
    } else {
        await board.randomWalk();
    }
    solveMazeBtn.style.display = "block";
    sizeInput.parentElement.style.display = "block";
});

solveMazeBtn.addEventListener("click", async () => {
    solveMazeBtn.style.display = "none";
    sizeInput.parentElement.style.display = "none";
    await board.solveMaze();
    generateMazeBtn.style.display = "";
    sizeInput.parentElement.style.display = "";
    algoInput.parentElement.style.display = "";
});

playAgainBtn.addEventListener("click", () => {
    resetCanvas();
    resetGrid();
    winDialog.close();
});

sizeInput.addEventListener("change", (e) => {
    resetCanvas();
    board.size = e.target.value;
    resetGrid();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(e.target.value, e.target.value);
});

delayInput.addEventListener("change", (e) => {
    board.delay = e.target.value;
});

document.addEventListener("keydown", (e) => {
    const key = e.key;
    let interval;
    switch (key) {
        case "ArrowLeft":
            player.drawLine("left");
            break;
        case "ArrowUp":
            player.drawLine("up");
            break;
        case "ArrowRight":
            player.drawLine("right");
            break;
        case "ArrowDown":
            player.drawLine("down");
            break;
        default:
            break;
    }
    if (player.x === board.goal.x && player.y === board.goal.y) {
        winDialog.showModal();
    }
});
