import {hexToRGB} from "./utility.js";

export default class Cursor {
    trail = [];
    TRAIL_LENGTH = 25;
    canvas = null;
    CURSOR_SIZE = 15;

    cursor = {
        x: 0,
        y: 0,
        size: 15,
        color: "",
        trailRootColor: hexToRGB('#FF4E50'),
        trailEndColor: hexToRGB('#F9D423')
    };

    static create(...args) {
        return new Cursor(...args);
    }

    constructor(canvas) {
        console.log(this.cursor)
        this.img = new Image();
        this.img.src = "data/image/cursor/cursor.png";

        this.cursorTrail = new Image();
        this.cursorTrail.src = "data/image/cursor/cursortrail.png";

        this.mousePos = {
            x: 0,
            y: 0,
        };

        this.context = canvas.context;
        const canvasMap = canvas.canvas;

        this.img.onload = () => {
            canvasMap.addEventListener("mousemove", (event) => {
                function getMousePosInCanvas() {
                    let rect = canvasMap.getBoundingClientRect();

                    return {
                        x:
                            ((event.clientX - rect.left) / (rect.right - rect.left)) *
                            canvasMap.width,
                        y:
                            ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
                            canvasMap.height,
                    };
                }
                this.mousePos = getMousePosInCanvas();
            });
        };
    }

    draw() {
        if (this.trail.length >= this.TRAIL_LENGTH) this.trail.shift();

        this.trail.push({
            x: this.mousePos.x,
            y: this.mousePos.y,
        });

        for (let i = 0; i < this.trail.length; i++) {
            let color = "";
            for (let j = 0; j < 3; j++) {
                color += (Math.floor(this.cursor.trailRootColor[j] - ((this.cursor.trailRootColor[j] - this.cursor.trailEndColor[j]) / this.trail.length * i))).toString() + ','
            }

            this.context.beginPath();
            this.context.fillStyle = `rgb(${color.slice(0, color.length - 1)})`;

            this.context.arc(
                this.trail[i].x - this.CURSOR_SIZE / 2,
                this.trail[i].y - this.CURSOR_SIZE / 2,
                this.cursor.size * ((i + 1) / this.trail.length),
                0,
                2 * Math.PI
            );
            this.context.closePath();
            this.context.fill();
        }
    }
}
