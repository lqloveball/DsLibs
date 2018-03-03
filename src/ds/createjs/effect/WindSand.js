/**
 * 风沙粒子效果
 */
class WindSand {

    constructor(img) {

        this.particles = [];
        this.nParticles = 0;

        this.mouseX = 0;
        this.mouseY = 0;

        this.distRepulsion = 4000;
        this.cycleDist = 0;

        this.img = img;

        this._view = new createjs.Container();
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', img.width);
        this.canvas.setAttribute('height', img.height);

        this.bitmap = new createjs.Bitmap(this.canvas);
        this._view.addChild(this.bitmap);


        this.context.drawImage(img, 0, 0);
        this.myData = this.context.getImageData(0, 0, img.width, img.height);
        this.parseImage();
        this.rectCanvas = this.canvas.getBoundingClientRect();


        requestAnimationFrame(() => {
            this.loop();
        });
    }

    setMouse(x,y){
        this.mouseX=x;
        this.mouseY=y;
    }

    loop() {

        let myData = this.myData;
        let canvas = this.canvas;
        let context = this.context;

        this.cycleDist += .1;
        this.distRepulsion = 2500 + Math.sin(this.cycleDist) * 1000;
        let newData = context.createImageData(canvas.width, canvas.height);
        let needRender = false;

        // if (isDemo){
        //     mouseX += dirMouse*2;
        //     mouseY += 2;
        //     if (mouseX > canvas.width){
        //         dirMouse = -1;
        //         mouseX = canvas.width;
        //     }
        //     if (mouseY > canvas.height){
        //         isDemo = false;
        //     }
        // }

        let mouseX = this.mouseX;
        let mouseY = this.mouseY;
        let nParticles=this.nParticles;
        let particles=this.particles;

        for (let i = 0; i < nParticles; i++) {
            let p = particles[i];
            p.repulse(mouseX, mouseY);
            if (!p.inplace) {
                let pos = ((p.currentY * canvas.width) + p.currentX) * 4;
                // newData.data[pos] += 196;
                // newData.data[pos + 1] += 154;
                // newData.data[pos + 2] += 108;
                // newData.data[pos + 3] += 255;

                newData.data[pos] += 253;
                newData.data[pos + 1] += 237;
                newData.data[pos + 2] += 156;
                newData.data[pos + 3] += 150;
                needRender = true;
            }
        }
        if (needRender) {
            context.putImageData(newData, 0, 0);
        }
        requestAnimationFrame(() => {
            this.loop();
        });
    }

    /**
     * 解析图片
     */
    parseImage() {
        let myData = this.myData;
        let canvas = this.canvas;
        let pix = myData.data;
        let particles = this.particles;
        let pCount = 0;
        let skip = 2;
        let nParticles = 0;
        let n = pix.length;
        for (var i = 0; i < n; i += (4 * skip)) {
            if (pix[i + 3] > 100) {
                let particle = new Particle(pCount % canvas.width, Math.floor(pCount / canvas.width), this.distRepulsion);
                particles.push(particle);
            }
            pCount += skip;
        }
        nParticles = particles.length;
        this.nParticles = nParticles;
    }

    get view() {
        return this._view;
    }

}


class Particle {

    constructor(x, y, absPosition) {
        this.initX = this.currentX = this.targetX = x;
        this.initY = this.currentY = this.targetY = y;
        this.vx = 0;
        this.vy = 0;
        this.inplace = true;
        this.distRepulsion = absPosition;
    }

    repulse(cx, cy) {
        let distRepulsion = this.distRepulsion;
        let dx = (cx - this.currentX);
        let dy = (cy - this.currentY);
        let dist = Math.pow(dx, 2) + Math.pow(dy, 2);
        if (dist < distRepulsion) {
            this.vx += -dx * .02;
            this.vy += -dy * .02;
        } else {
            this.vx += (this.initX - this.currentX) * .1;
            this.vy += (this.initY - this.currentY) * .1;
        }
        this.vx *= .85;
        this.vy *= .85;

        if (Math.abs(this.vx) < .1 && Math.abs(this.yv) < .1) {
            this.vx = this.vy = 0;
            this.currentX = this.initX;
            this.currentY = this.initY;
            this.inplace = true;
        } else {
            this.currentX = Math.round(this.currentX + this.vx);
            this.currentY = Math.round(this.currentY + this.vy);
            this.inplace = false;
        }
    }
}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.effect = ds.createjs.effect ? ds.createjs.effect : {};
ds.createjs.effect.WindSand = WindSand;

export default WindSand;