export default class Player {
    constructor(drawColor, ctx, lineWidth) {
        this.drawColor = drawColor
        this.lineWidth = lineWidth
        this.ctx = ctx
        this.grid = null
        this.goal = null
        this.x = 0;
        this.y = 0;
    }

    checkCanMove(dir) {
        switch (dir) {
            case 'right':
                if(this.x + 1 <= this.grid.length - 1) {
                    return !this.grid[this.x + 1][this.y].walls.left
                } else {
                    return false
                }
            case 'left':
                if(this.x - 1 >= 0) {
                    return !this.grid[this.x - 1][this.y].walls.right
                } else {
                    return false
                }
            case 'up':
                if(this.y - 1 >= 0) {
                    return !this.grid[this.x][this.y - 1].walls.down
                } else {
                    return false
                }
            case 'down':
                if(this.y + 1 <= this.grid[0].length - 1) {
                    return !this.grid[this.x][this.y + 1].walls.up
                } else {
                    return false
                }
            default:
                break;
        }
    }

    updatePos(dir) { 
        dir === 'left' ? this.x -= 1 : null
        dir === 'right' ? this.x += 1 : null
        dir === 'up' ? this.y -= 1 : null
        dir === 'down' ? this.y += 1 : null
    }

    drawLine(dir) {
        if (!this.checkCanMove(dir)) return
        this.ctx.strokeStyle = this.drawColor
        this.ctx.lineWidth = this.lineWidth
        this.ctx.beginPath()
        switch (dir) {
            case 'right':
                this.ctx.moveTo(this.x + 0.5 - this.lineWidth / 2, this.y + 0.5)
                this.ctx.lineTo(this.x + 1.5 + this.lineWidth / 2, this.y + 0.5)
                this.ctx.stroke()
                break;
            case 'left':
                this.ctx.moveTo(this.x + 0.5 + this.lineWidth / 2, this.y + 0.5)
                this.ctx.lineTo(this.x - 0.5 - this.lineWidth / 2, this.y + 0.5)
                this.ctx.stroke()
                break;
            case 'up':
                this.ctx.moveTo(this.x + 0.5, this.y + 0.5 - this.lineWidth / 2)
                this.ctx.lineTo(this.x + 0.5, this.y - 0.5 - this.lineWidth / 2)
                this.ctx.stroke()
                break;
            case 'down':
                this.ctx.moveTo(this.x + 0.5, this.y + 0.5 - this.lineWidth / 2)
                this.ctx.lineTo(this.x + 0.5, this.y + 1.5 + this.lineWidth / 2)
                this.ctx.stroke()
                break;
            default:
                break;
        }
        this.updatePos(dir)
    }
}