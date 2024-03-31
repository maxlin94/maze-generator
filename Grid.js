import Node from "./Node.js";

export default class Grid {
    constructor(height, width, size, ctx, delay) {
        this.height = height;
        this.width = width;
        this.size = size;
        this.ctx = ctx;
        this.pathColor = getComputedStyle(document.documentElement).getPropertyValue(
            "--background-primary"
        );
        this.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(
            "--background-secondary"
        );
        this.grid = this.createGrid();
        this.delay = delay;
    }

    createGrid() {
        const arr = [];
        for (let i = 0; i < this.width / this.size; i++) {
            arr[i] = [];
            for (let j = 0; j < this.height / this.size; j++) {
                arr[i][j] = new Node(
                    i,
                    j,
                    this.size,
                    this.ctx,
                    this.pathColor,
                    this.width,
                    this.height
                );
            }
        }
        this.start = arr[0][0];
        this.goal = {
            x: this.width / this.size - 1,
            y: this.height / this.size - 1,
        };
        return arr;
    }

    getNeighbors(node) {
        const arr = [];
        for (let i = -1; i < 2; i += 2) {
            if (node.x + i >= 0 && node.x + i <= this.grid.length - 1) {
                if (
                    !this.grid[node.x + i][node.y].visited ||
                    this.grid[node.x + i][node.y].partOfMaze
                ) {
                    arr.push(this.grid[node.x + i][node.y]);
                }
            }
            if (node.y + i >= 0 && node.y + i <= this.grid[0].length - 1) {
                if (
                    !this.grid[node.x][node.y + i].visited ||
                    this.grid[node.x][node.y + i].partOfMaze
                ) {
                    arr.push(this.grid[node.x][node.y + i]);
                }
            }
        }
        return arr;
    }

    async randomWalk() {
        let nodeList = this.grid.flat();
        let current = nodeList[this.getRandomIndex(nodeList)];
        const randomStart = nodeList[this.getRandomIndex(nodeList)];
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(randomStart.x + 0.25, randomStart.y + 0.25, 0.5, 0.5);
        if (current.x === randomStart.x && current.y === randomStart.y) {
            current = nodeList[this.getRandomIndex(nodeList)];
        }
        const goal = [randomStart];
        const path = [current];
        let previousSlice = 1;
        while (nodeList.length > 0) {
            if (this.delay > 0) await this.sleep(this.delay);
            const neighbors = this.getNeighbors(current);
            current.visited = true;
            if (neighbors.length > 0) {
                const randomNeighbor = neighbors[this.getRandomIndex(neighbors)];
                if(path.includes(randomNeighbor)) continue
                const direction = this.getDirection(current, randomNeighbor);
                this.removeWall(direction, current);
                current.drawLine(direction, this.pathColor);
                randomNeighbor.parent = current;
                current = randomNeighbor;
            }
            if (goal.includes(current)) {
                path.push(current)
                previousSlice = 1;
                current.partOfMaze = true;
                goal.push(...path)
                path.forEach(node => node.partOfMaze = true)
                path.splice(0, path.length);
                nodeList = this.grid.flat().filter((node) => !node.visited);
                const randomNode = nodeList[this.getRandomIndex(nodeList)];
                current = randomNode;
            }
            if (neighbors.length === 0) {
                previousSlice = this.backtrack(path, previousSlice);
                current = path.at(-1);
            }
            if (!path.includes(current)) {
                path.push(current);
            }
        }
    }

    backtrack(path, previousSlice) {
        previousSlice = previousSlice > Math.min(path.length / 1.5, 75) ? 1 : previousSlice + 1;
        const slice = path.splice(path.length - previousSlice, path.length);
        slice.forEach(node => {
            node.visited = false;
            const direction = this.getDirection(node, node.parent);
            node.drawLine(direction, this.backgroundColor);
            this.addWall(direction, node);
        })
        return previousSlice;
    }

    addWall(dir, node) {
        switch (dir) {
            case "left":
                node.walls[dir] = true;
                this.grid[node.x - 1][node.y].walls["right"] = true;
                break;
            case "right":
                node.walls[dir] = true;
                this.grid[node.x + 1][node.y].walls["left"] = true;
                break;
            case "up":
                node.walls[dir] = true;
                this.grid[node.x][node.y - 1].walls["down"] = true;
                break;
            case "down":
                node.walls[dir] = true;
                this.grid[node.x][node.y + 1].walls["up"] = true;
                break;
        }
    }

    getRandomIndex(arr) {
        return Math.floor(Math.random() * arr.length);
    }

    getRandomNode() {
        let randomX = this.getRandomIndex(this.grid);
        let randomY = this.getRandomIndex(this.grid[0]);
        while (this.grid[randomX][randomY].visited) {
            randomX = this.getRandomIndex(this.grid);
            randomY = this.getRandomIndex(this.grid[0]);
        }
        return this.grid[randomX][randomY];
    }

    async generateMaze() {
        const stack = [this.start];
        while (stack.length > 0) {
            const current = stack.at(-1);
            const neighbors = this.getNeighbors(current);
            current.visited = true;
            if (neighbors.length > 0) {
                const randomNeighbor = neighbors[this.getRandomIndex(neighbors)];
                const dir = this.getDirection(randomNeighbor, current);
                this.removeWall(dir, randomNeighbor);
                randomNeighbor.drawLine(dir, this.pathColor);
                if (this.delay > 0) await this.sleep(this.delay);
                stack.push(randomNeighbor);
            } else {
                stack.pop();
            }
        }
    }

    removeWall(dir, node) {
        switch (dir) {
            case "left":
                node.walls[dir] = false;
                this.grid[node.x - 1][node.y].walls["right"] = false;
                break;
            case "right":
                node.walls[dir] = false;
                this.grid[node.x + 1][node.y].walls["left"] = false;
                break;
            case "up":
                node.walls[dir] = false;
                this.grid[node.x][node.y - 1].walls["down"] = false;
                break;
            case "down":
                node.walls[dir] = false;
                this.grid[node.x][node.y + 1].walls["up"] = false;
                break;
        }
    }

    getSearchableNeighbors(node, closed) {
        const neighbors = [];
        const keys = Object.keys(node.walls);
        keys.forEach((key) => {
            if (!node.walls[key]) {
                const neighbor = this.getNeighborByDir(key, node);
                const bool = closed.some((el) => el.x === neighbor.x && el.y === neighbor.y);
                if (neighbor && !closed.includes(neighbor)) {
                    neighbors.push(neighbor);
                }
            }
        });
        return neighbors;
    }

    getNeighborByDir(dir, node) {
        if (!node) return;
        switch (dir) {
            case "down":
                return node.y + 1 <= node.height / node.size - 1
                    ? this.grid[node.x][node.y + 1]
                    : null;
            case "up":
                return node.y - 1 >= 0 ? this.grid[node.x][node.y - 1] : null;
            case "right":
                return node.x + 1 <= node.width / node.size - 1
                    ? this.grid[node.x + 1][node.y]
                    : null;
            case "left":
                return node.x - 1 >= 0 ? this.grid[node.x - 1][node.y] : null;
            default:
                break;
        }
    }

    getDirection(start, neighbor) {
        if (start.x - neighbor.x === 1) {
            return "left";
        }
        if (start.x - neighbor.x === -1) {
            return "right";
        }
        if (start.y - neighbor.y === 1) {
            return "up";
        }
        if (start.y - neighbor.y === -1) {
            return "down";
        }
    }

    async solveMaze() {
        const open = [this.start];
        const closed = [];
        this.start.h = this.getDistance(this.start, this.goal);
        this.start.f = this.start.g + this.start.h;
        while (open.length > 0) {
            if (this.delay > 0) await this.sleep(this.delay);
            const q = this.findBestNode(open);
            open.splice(open.indexOf(q), 1);
            const neighbors = this.getSearchableNeighbors(q, closed);
            if (this.delay > 0) this.drawPath(closed, q, "red");
            if (this.checkWin(q)) {
                this.drawPath(closed, q);
                return;
            }
            for (const neighbor of neighbors) {
                neighbor.parent = q;
                neighbor.g = q.g + 1;
                neighbor.h = this.getDistance(neighbor, this.goal);
                neighbor.f = neighbor.g + neighbor.h;
                if (this.checkSkipNode(neighbor, open)) continue;
                if (!open.includes(neighbor)) {
                    open.push(neighbor);
                }
            }
            if (!closed.includes(q)) {
                closed.push(q);
            }
        }
    }

    checkSkipNode(node, open) {
        const skipNode = open.find((el) => el.x === node.x && el.y === node.y);
        if (skipNode && skipNode.f <= node.f) {
            return true;
        }
        return false;
    }

    checkWin(node) {
        if (node.x === this.goal.x && node.y === this.goal.y) {
            return true;
        }
        return false;
    }

    drawPath(closed, q, color) {
        for (const node of closed) {
            if (node.parent) {
                const direction = this.getDirection(node, node.parent);
                node.drawLine(direction, color);
            }
        }
        let current = q;
        let count = 0;
        while (current.parent && current !== this.start) {
            count++;
            const direction = this.getDirection(current, current.parent);
            if (current) {
                current.drawLine(direction, color || "green");
            }
            current = current.parent;
        }
    }

    findBestNode(arr) {
        let best = Infinity;
        let currentBestNode;
        arr.forEach((el) => {
            if (el.f < best) {
                best = el.f;
                currentBestNode = el;
            }
        });
        return currentBestNode;
    }

    getDistance(node, goal) {
        return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
    }

    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
