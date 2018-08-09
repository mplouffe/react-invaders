import Bullet from './Bullet';

export const Direction = {
    Left: 0,
    Right: 1
};

export default class Invader {
    constructor(args) {
        this.direction = Direction.Right;
        this.position = args.position;
        this.speed = args.speed;
        this.radius = args.radius;
        this.delete = false;
        this.onDie = args.onDie;
        this.bullets = [];
        this.lastShot = 0;
    }

    reverse() {
        if (this.direction === Direction.Right) {
            this.position.x -= 10;
            this.direction = Direction.Left;
        } else {
            this.direction = Direction.Right;
            this.position.x += 10;
        }
    }

    update() {
        if (this.direction === Direction.Right) {
            this.position.x += this.speed;
        } else {
            this.position.x -= this.speed;
        }
        let nextShot = Math.random() * 5000;
        if (Date.now() - this.lastShot > 250 * nextShot) {
            const bullet = new Bullet({
                position: { x: this.position.x, y: this.position.y - 5 },
                speed: 2.5,
                radius: 15,
                direction: "down"
            });
            this.bullets.push(bullet);
            this.lastShot = Date.now();
        }
    }

    render(state) {
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.strokeStyle = '#F00';
        context.fillStyle = '#FF3300';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(-5, 25);
        context.arc(0, 25, 5, 0, Math.PI);
        context.lineTo(5, 25);
        context.lineTo(5, 0);
        context.lineTo(15, 0);
        context.lineTo(15, -15);
        context.lineTo(-15, -15);
        context.lineTo(-15, 0);
        context.lineTo(-5,0);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();

        this.renderBullets(state);
    }
    renderBullets(state) {
        let index = 0;
        for (let bullet of this.bullets) {
            if (bullet.delete) {
                this.bullets.splice(index, 1);
            } else {
                this.bullets[index].update();
                this.bullets[index].render(state);
            }
            index++;
        }
    }

    die() {
        this.delete = true;
        this.onDie();
    }
}