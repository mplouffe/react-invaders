export default class Ship {
    constructor(args) {
        this.position = args.position;
        this.speed = args.speed;
        this.radius = args.radius;
        this.delete = false;
        this.onDie = args.onDie;
    }
    update(keys) {
        if (keys.right) {
            this.position.x += this.speed;
        } else if(keys.left) {
            this.position.x -= this.speed;
        }
    }
    render(state) {
        const rightEdge = state.screen.width * state.screen.ratio;
        if(this.position.x > rightEdge) {
            this.position.x = 0;
        } else if(this.position.x < 0) {
            this.position.x = rightEdge;
        }

        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#FFFFFF";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -25);
        context.lineTo(15,15);
        context.lineTo(5,7);
        context.lineTo(-5,7);
        context.lineTo(-15,15);
        context.closePath();
        //context.fill(); VECTOR MODE BABY!!!
        context.stroke();
        context.restore();
    }
}