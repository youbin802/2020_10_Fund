class Sign 
{
    constructor() {
        this.canvas = document.querySelector("#popup canvas");
        this.ctx = this.canvas.getContext("2d");
        this.isDraw = false; //이거 추가했다. !!!!!!!!
        this.addEvent();
        this.start = {x:0, y:0};
        this.isSigned = false;
    }

    addEvent(){
        const c = this.canvas;
        c.addEventListener("mousedown", this.startDraw);
        c.addEventListener("mousemove", this.drawMove);
        c.addEventListener("mouseup", this.endDraw);
    }

    startDraw = e => {
        this.isDraw = true;
        const {offsetX:x, offsetY: y} = e;
        this.start = {x, y};
    }

    drawMove = e => {
        if(!this.isDraw) return;
        const {offsetX:x, offsetY: y} = e;
        const s = this.start;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x, s.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.start = {x,y};
        this.isSigned = true;
    }

    endDraw = e => {
        this.isDraw = false;
    }

    reset(){
        this.ctx.clearRect(0, 0, 200, 100);
        this.isSigned = false;
    }

    getImage(){
        return this.canvas.toDataURL();
    }
}