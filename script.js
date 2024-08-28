import Grid from "./Grid.js";
const generateMazeBtn = document.querySelector(".generate");
const solveMazeBtn = document.querySelector(".solve");
const delayInput = document.querySelector(".delay");
const sizeInput = document.querySelector(".size");
const algoInput = document.querySelector(".algo");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const height = 720;
const width = 1200;
const size = sizeInput.value;
const delay = delayInput.value;
ctx.scale(size, size);
const board = new Grid(height, width, size, ctx, delay);

function resetCanvas() {
    solveMazeBtn.style.display = "none";
    generateMazeBtn.style.display = "";
    ctx.fillStyle = board.mazeBgColor;
    ctx.fillRect(0, 0, width, height);
}

function resetGrid() {
    board.grid = board.createGrid();
}

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