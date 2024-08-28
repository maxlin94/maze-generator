export default class Node {
    constructor(x, y, size, ctx, borderColor, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.f = 1;
        this.g = 1;
        this.h = 1;
        this.visited = false;
        this.partOfMaze = false;
        this.size = size;
        this.ctx = ctx;
        this.parent = null;
        this.borderColor = borderColor;
        this.wallThickness = 0.5;
        this.walls = {
            left: true,
            right: true,
            up: true,
            down: true,
        };
    }

    paint() {
        const keys = Object.keys(this.walls);
        keys.forEach((dir) => {
            if(this.walls[dir]) {
                this.paintWall(dir);
            } else {
                this.drawLine(dir, this.borderColor);
            }
        });
    }

    paintWall(dir, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.wallThickness;
        const offset = this.wallThickness / 2 * -1; // Fixes jagged corners
        this.ctx.beginPath();
        switch (dir) {
            case "right":
                this.ctx.moveTo(this.x + 1, this.y + offset);
                this.ctx.lineTo(this.x + 1, this.y + 1 - offset);
                this.ctx.stroke();
                break;
            case "left":
                this.ctx.moveTo(this.x, this.y + offset);
                this.ctx.lineTo(this.x, this.y + 1 - offset);
                this.ctx.stroke();
                break;
            case "up":
                this.ctx.moveTo(this.x + offset, this.y);
                this.ctx.lineTo(this.x + 1 - offset, this.y);
                this.ctx.stroke();
                break;
            case "down":
                this.ctx.moveTo(this.x + offset, this.y + 1);
                this.ctx.lineTo(this.x + 1 - offset, this.y + 1);
                this.ctx.stroke();
                break;
            default:
                break;
        }
    }

    drawLine(dir, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1 - this.wallThickness
        const offset = this.ctx.lineWidth / 2
        this.ctx.beginPath();
        
        switch (dir) {
            case "right":
                this.ctx.moveTo(this.x + 0.5 - offset, this.y + 0.5);
                this.ctx.lineTo(this.x + 1.5 + offset, this.y + 0.5);
                this.ctx.stroke();
                break;
            case "left":
                this.ctx.moveTo(this.x + 0.5 + offset, this.y + 0.5);
                this.ctx.lineTo(this.x - 0.5 - offset, this.y + 0.5);
                this.ctx.stroke();
                break;
            case "up":
                this.ctx.moveTo(this.x + 0.5, this.y + 0.5 + offset);
                this.ctx.lineTo(this.x + 0.5, this.y - 0.5 - offset);
                this.ctx.stroke();
                break;
            case "down":
                this.ctx.moveTo(this.x + 0.5, this.y + 0.5 - offset);
                this.ctx.lineTo(this.x + 0.5, this.y + 1.5 + offset);
                this.ctx.stroke();
                break;
            default:
                break;
        }
    }
}
