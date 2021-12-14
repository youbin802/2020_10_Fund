class Fund{
    constructor(data, el){
        this.fundData = data; //펀드 데이터
        this.el = el; //부모 엘리먼트
        this.popup = document.querySelector("#popup");
        const dom = this.makeDom();
        this.ctx = dom.querySelector("canvas").getContext("2d");
        this.res = dom.querySelector(".res");
        this.el.appendChild(dom);
        this.startDraw();
        this.total = 0;
    }

    makeDom(){
        const div = document.createElement("div");
        div.classList.add("fund");
        const f = this.fundData;
        const fCurrent =f.current.toLocaleString();
        const fTotal = f.total.toLocaleString();
        div.innerHTML = `
        <div class="info">
        <div class="da">${f.endDate}</div>
        <div class="text">
        <div class="text1">${f.number}</div>
        <div class="text2" title="${f.name}">${f.name}</div>
        <div class="text3" title="${fCurrent}">${fCurrent}</div>
        <div class="text4" title="${fTotal}">of ${fTotal}</div>
        </div>
        <canvas width="230" height="7"></canvas>
        <div class="res"></div>
        <div class="menu-bar">
        </div>
        </div>`;

        const menuBar = div.querySelector(".menu-bar");
        const now = new Date();
        const d = new Date(f.endDate);
        if(now > d) {
            menuBar.innerHTML = "<h4>모집완료</h4>";
        }else {
            menuBar.innerHTML = 
                `<button class="btn">투자하기</button>`;
            menuBar.querySelector(".btn").addEventListener("click", e => {
                App.app.sign.reset();
                this.popup.classList.add("active");
                this.popup.querySelector("#fnumber").value = f.number;
                this.popup.querySelector("#fname").value = f.name;
                let fund = App.app.fundList.find(x => x.number === f.number);
                this.total = f.total;
                document.querySelector('#close').addEventListener("click", e=> {
                    this.popup.querySelector("#money").removeEventListener("input", this.valueChanged);
                })

                document.querySelector('#submit').addEventListener("click", e=> {
                    this.popup.querySelector("#money").removeEventListener("input", this.valueChanged);
                })
                this.popup.querySelector("#money").addEventListener("input", this.valueChanged);
            });
        }
        return div;
    }

    valueChanged = e => {
        if (e.target.value * 1 < 1) {
            e.target.value = 1;
        }

        if(e.target.value * 1 >= this.total) {
            e.target.value = this.total;
           
        }   
    
    }

    startDraw(){
        let step = this.fundData.percent / 30;
        let now = 0;
        const timer = setInterval(() => {
            this.render(now);
            now += step;
            if(now >= this.fundData.percent){
                now = this.fundData.percent;
                this.render(now);
                clearInterval(timer);
            }
        }, 1000/30);
    }
    
    render(value) {
        console.log(value);
        const c = this.ctx;
        c.clearRect(0, 0, 255, 100);
        c.fillStyle="#ddd";
        c.fillRect(0,0,255,7);
        c.fill();

        c.beginPath();
        c.moveTo(10,100);
        c.fillStyle="#e88925";
        c.fillRect(0,0,230*value/100,7);
        c.closePath();
        c.fill();

        c.fillStyle = "#000";
        c.font = "15px Arial";
        c.textBaseline = "middle";
        c.textAlign = "center";
        value = Math.round(value * 100) / 100;
        this.res.innerHTML=value+"%";
    }
}