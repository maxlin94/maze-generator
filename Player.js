export default class Player {
    constructor(drawColor, ctx, lineWidth) {
        this.drawColor = drawColor;
        this.lineWidth = lineWidth;
        this.ctx = ctx;
        this.grid = null;
        this.goal = null;
        this.x = 0;
        this.y = 0;
    }

    checkCanMove(dir) {
        return !this.grid[this.x][this.y].walls[dir];
    }

    updatePos(dir) {
        dir === "left" ? (this.x -= 1) : null;
        dir === "right" ? (this.x += 1) : null;
        dir === "up" ? (this.y = Math.max(this.y - 1, 0)) : null;
        dir === "down" ? (this.y += 1) : null;
    }

    drawLine(dir) {
        if (!this.checkCanMove(dir)) return;
        const grad = this.ctx.createLinearGradient(50, 50, 150, 150);
        grad.addColorStop(0.00, 'red'); 
        grad.addColorStop(1/6, 'orange'); 
        grad.addColorStop(2/6, 'yellow'); 
        grad.addColorStop(3/6, 'green') 
        grad.addColorStop(4/6, 'aqua'); 
        grad.addColorStop(5/6, 'blue'); 
        grad.addColorStop(1.00, 'purple');
        this.ctx.strokeStyle = grad;
        this.ctx.beginPath();
        switch (dir) {
            case "right":
                this.ctx.moveTo(this.x + 0.5 - this.lineWidth / 2, this.y + 0.5);
                this.ctx.lineTo(this.x + 1.5 + this.lineWidth / 2, this.y + 0.5);
                this.ctx.stroke();
                break;
            case "left":
                this.ctx.moveTo(this.x + 0.5 + this.lineWidth / 2, this.y + 0.5);
                this.ctx.lineTo(this.x - 0.5 - this.lineWidth / 2, this.y + 0.5);
                this.ctx.stroke();
                break;
            case "up":
                this.ctx.moveTo(this.x + 0.5, this.y + 1 - this.lineWidth / 2);
                this.ctx.lineTo(this.x + 0.5, this.y - this.lineWidth / 2);
                this.ctx.stroke();
                break;
            case "down":
                this.ctx.moveTo(this.x + 0.5, this.y + 0.5 - this.lineWidth / 2);
                this.ctx.lineTo(this.x + 0.5, this.y + 1.5 + this.lineWidth / 2);
                this.ctx.stroke();
                break;
            default:
                break;
        }
        this.updatePos(dir);
        this.drawHead();
    }

    drawHead() {
        this.ctx.fillStyle = this.drawColor;
        this.ctx.fillRect(this.x + 0.25, this.y + 0.25, 0.5, 0.5);
    }
}
