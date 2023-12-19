import Node from "./Node.js";

export default class Grid {
    constructor(height, width, size, ctx, borderColor, delay) {
        this.height = height;
        this.width = width;
        this.size = size;
        this.ctx = ctx;
        this.borderColor = borderColor;
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
                    this.borderColor,
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
                if (!this.grid[node.x + i][node.y].visited) {
                    arr.push(this.grid[node.x + i][node.y]);
                }
            }
            if (node.y + i >= 0 && node.y + i <= this.grid[0].length - 1) {
                if (!this.grid[node.x][node.y + i].visited) {
                    arr.push(this.grid[node.x][node.y + i]);
                }
            }
        }
        return arr;
    }

    async generateMaze() {
        const stack = [this.start];
        while (stack.length > 0) {
            const current = stack.at(-1);
            current.visited = true;
            current.paint()
            const neighbors = this.getNeighbors(current);
            if (neighbors.length > 0) {
                const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                const dir = this.getDirection(current, randomNeighbor);
                this.removeWall(dir, current);
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
                this.grid[node.x][node.y + 1].walls["up"] = false
                break;
        }
    }

    getSearchableNeighbors(node) {
        const neighbors = [];
        const keys = Object.keys(node.walls);
        keys.forEach((key) => {
            if (!node.walls[key]) {
                const neighbor = this.getNeighborByDir(key, node);
                if (neighbor) {
                    neighbors.push(neighbor);
                }
            }
        });
        return neighbors.filter((a) => !a.searched);
    }

    getNeighborByDir(dir, node) {
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
        this.start.f = this.getDistance(this.start, this.goal);
        this.start.drawLine("up", "orange");
        while (open.length > 0) {
            this.start.parent = null;
            if (this.delay > 0) await this.sleep(this.delay);
            const q = this.findBestNode(open);
            open.splice(open.indexOf(q), 1);
            const neighbors = this.getSearchableNeighbors(q);
            q.searched = true;
            if (this.delay > 0) this.drawPath(closed, q);
            for (const neighbor of neighbors) {
                neighbor.parent = q;
                if (neighbor.x === this.goal.x && neighbor.y === this.goal.y) {
                    const direction = this.getDirection(neighbor, neighbor.parent);
                    neighbor.drawLine(direction, "orange");
                    neighbor.drawLine("down", "orange");
                    const directions = this.getDirection(neighbor.parent, neighbor);
                    neighbor.parent.drawLine(directions, "orange");
                    this.drawPath(closed, neighbor);
                    return;
                }
                neighbor.g = neighbor.g;
                neighbor.h = this.getDistance(neighbor, this.goal);
                neighbor.f = neighbor.g + neighbor.h;
                const bestNode = this.findBestNode(neighbors);
                const bestClosed = this.findBestNode(closed);
                if (!open.includes(neighbor)) {
                    open.push(neighbor);
                }
                if (bestNode) {
                    if (bestNode.f < neighbor.f) {
                        continue;
                    }
                }
                if (bestClosed) {
                    if (bestClosed.f < neighbor.f) {
                        continue;
                    }
                }
            }
            if (!closed.includes(q)) {
                closed.push(q);
            }
        }
    }

    drawPath(closed, q) {
        for (const node of closed) {
            if (node.parent) {
                const direction = this.getDirection(node, node.parent);
                node.drawLine(direction, this.borderColor);
            }
        }
        let current = q;
        while (current.parent) {
            if (current.parent) {
                const direction = this.getDirection(current, current.parent);
                if (current.searched) {
                    current.drawLine(direction, "orange");
                }
                current = current.parent;
            }
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
        const h = Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
        return h;
    }

    async sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
