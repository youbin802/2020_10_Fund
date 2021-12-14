class App {
    constructor(){
        this.pageList = document.querySelectorAll(".menu-page");
        this.page = 0; //현재 페이지
        this.isPageMove = false;
        this.fundList = []; //불러온 펀드를 저장할 배열
        this.investerList = []; //투자자 리스트 저장
        this.invPage=0;
        this.loadDataFromJson();
        this.addEvent();
        this.sign = new Sign();
        this.back = document.querySelector(".back"); 
        this.checkInput();
        this.fundImage = new Image();
        this.fundImage.src = "./images/funding.png";
        App.app = this;
        this.list=[];
    }

    menuClick = e =>{
        const menuIdx = e.target.dataset.idx;
        if(menuIdx == this.page || this.isPageMove || menuIdx === undefined) return;
        
        this.isPageMove = true;
        this.outPage(this.pageList[this.page]);
        this.pageList[menuIdx].classList.add("active");
        this.page = menuIdx;
        this.drawPage();
    }

    outPage(page){
        page.classList.remove("active");
        page.classList.add("out");
        setTimeout(()=> {
            page.style.transition = 'none';
            page.classList.remove("out");
            setTimeout(()=> {
                page.style.transition = 'transform 0.5s';
                this.isPageMove = false;
            }, 100);
        }, 500);
    }

      //json가져오기
    loadDataFromJson(){
        fetch('./js/fund.json')
        .then(res => res.json())
        .then( json => {
            this.fundList = json;
            this.calculateFund();
            this.drawFund();
        });
    }

     //확률 만들기
    calculateFund(){
        this.fundList = this.fundList.map(f => {
            f.percent = f.current / f.total * 100;
            return f;
        }).sort( (a,b) => b.percent - a.percent );
    }

       //메인그리기
       drawFund(){
        const fundEl = document.querySelector("#fundMain");
        fundEl.innerHTML = "";
        const now = new Date();
        let count = 0;
        let drawList = this.fundList.filter( f => {
            if(count >= 4) {
                return false;
            }
            const day = new Date(f.endDate);
            if(day > now) {
                count++;
                return true;
            }
        });

        drawList.forEach(f => {
            new mainFund(f, fundEl);
        });
    }

       //펀드등록
       registerFund = e => {

        let number = document.querySelector("#num").value;
        let name = document.querySelector("#name").value;
        let date = document.querySelector("#endDate").value;
        let time = document.querySelector("#endTime").value;
        let total = document.querySelector("#total").value * 1;
        
        let endDate =date + " " + time;


        if(name=='' || date=='' || time=='' || total=='') {
            alert("누락된 항목이 있습니다.");
        }
        else {
            this.fundList.push({number, name, endDate, total, current:0});
            this.calculateFund();
            document.querySelector(`#navMenu > li[data-idx="2"]`).click();
     
        }
    }

    checkInput() {
        document.querySelector("#total").addEventListener("input",e=> {
            let get = e.target.value * 1; 
            if(get < 1 ) {
               e.target.value=1;
            }
        })
    }


          //자동비번
          drawFundRegister(){
            let numList = this.fundList.map(x => x.number.substring(1) * 1);
            let max = Math.max(...numList) + 1;
            max = "0000" + max;
            max = max.substring(max.length - 4);
            max = "A" + max;
            document.querySelector("#num").value = max;
    
            
        }
    

    //펀드등록 값 리셋
    registerReset=e=> {
        document.querySelector("#name").value =null;
        document.querySelector("#endDate").value =null;
        document.querySelector("#endTime").value =null;
        document.querySelector("#total").value =null;
    }

        //펀드보기
        drawFundListPage(){
            const list = document.querySelector(".fund-list .con");
            list.innerHTML = "";
            
            this.fundList.forEach(f => {
                new Fund(f,list);
            });

        }

  //투자하기let버튼클릭
    submitFund = e => {
        const fundNumber = document.querySelector("#fnumber").value;
        const fName = document.querySelector("#fname").value;
        const iName = document.querySelector("#iname").value;
        const money = document.querySelector("#money").value * 1;
        const src = this.sign.getImage();
        const day = new Date();
        
        if(fundNumber=='' || fName=='' || iName=='' || money=='' || !this.sign.isSigned ) {
            alert("누락항목이 있습니다.");
        }
        else {
            this.investerList.push({fundNumber, fName, iName, money, src, day});
            let fund = this.fundList.find(x => x.number === fundNumber);
            fund.current += money;
            this.endDate= day;
          
            this.calculateFund();
            this.closePopup();
            this.drawPage();
            this.submitreset();
        }
    }

    closePopup = e => {
        document.querySelector("#popup").classList.remove("active");
        const iName = document.querySelector("#iname").value= "";
        const money = document.querySelector("#money").value = "";
    }

    //값 리셋
    submitreset= e=>{
        const iName = document.querySelector("#iname").value= "";
        const money = document.querySelector("#money").value = "";
    }

    //투자자목록 페이지 구현
    drawInv() {
        this.list=[];
        this.investerList.forEach(i => {
            let inv = this.list.find(x => x.fundNumber === i.fundNumber && x.iName === i.iName);
            console.log(inv);
            if(inv !== undefined){
                inv.money += i.money;
                inv.src = i.src;
            }else{
                const {fundNumber, fName, iName, money, src} = i;
                this.list.push({fundNumber, fName, iName, money, src });
                console.log(this.list);
            }
        });
        this.list.reverse();

        let pa = Math.ceil(this.list.length/5);
        if(pa ==0) {
            document.querySelector(".now").innerHTML=`0`;
        }else {
            document.querySelector(".now").innerHTML=`1`;
            this.invPage=1;
        }
        document.querySelector(".maxPa").innerHTML=`${pa}`;
        this.drawInvList();
    }
  //이전
    clickbefore = e=> {
        let  p= this.invPage;
        if(0 >=p-1) return;
        this.invPage =p-1;
        this.drawInvList();

    };

    //다음
    clickafter = e=> {
        let  p= this.invPage;
        let pa =Math.ceil(this.list.length/5);
        if(p+1 >pa) return;
        this.invPage =p+1;
        this.drawInvList();
    };


    //투자자목록 그리기
    drawInvList(){
       const dom = document.querySelector(".inv-list");
        dom.innerHTML = "";
        if(this.invPage==0) return;
        let pa = Math.ceil(this.list.length/5);
        let ing = this.list.length-(this.invPage-1)*5;


        if(ing >5) {
            ing =5;
        }

     for(let a = (this.invPage-1)*5; a<(this.invPage-1)*5+ing; a++) {

            let i = this.list[a];
            console.log(i);
            const div = document.createElement("div");
            div.classList.add("inv");
            const f = this.fundList.find(x => x.number === i.fundNumber);
            console.log(this.fundList);
            console.log(f);
            console.log(i.fundNumber);
            this.pervalue =Math.ceil(i.money / f.total * 10000) / 100;
            div.innerHTML = `
            <span>${i.fundNumber}</span>
            <span title="${i.fName}">${i.fName}</span>
            <span title="${i.iName}">${i.iName}</span>
            <span title="${i.money}">${i.money}원</span>
            <canvas width="100" height="7px"></canvas><span>${this.pervalue}%</span>
            <button>투자펀드계약서</button>
            `;
            
            this.ctx = div.querySelector("canvas").getContext("2d");
            this.render();
        
            div.querySelector("button").addEventListener("click", e => {     
                const c = document.createElement("canvas");
                c.width = 600;
                c.height = 400;
                const ctx = c.getContext("2d");
                
                ctx.drawImage(this.fundImage, 0, 0, 600, 400);
                ctx.fillText(i.fundNumber.subStr(0,10), 240, 150);
                ctx.fillText(i.fName,240, 180);
                ctx.fillText(i.iName, 240, 210);
                ctx.fillText(i.money, 240, 240);
                
                const sign = new Image();
                sign.src = i.src;
                sign.onload = ()=> {
                    ctx.drawImage(sign, 350, 300);
                    const href = c.toDataURL();

                    const a = document.createElement("a");
                    a.href = href;
                    a.download = "download";
                    a.click();
                }
            })
        dom.appendChild(div);
    }
}

    render() {
        const value =(Math.ceil(this.pervalue));
        const c = this.ctx;
        c.clearRect(0, 0, 100, 100);
        c.fillStyle="#ddd";
        c.height=7;
        c.fillRect(0,0,100,100);
        c.fill();

        c.beginPath();
        c.moveTo(0,100);
        c.fillStyle="#e88925";
        c.fillRect(0,0,100* value /100,7);
        c.closePath();
        c.fill();

        c.fillStyle = "#000";
        c.font = "15px Arial";
        c.textBaseline = "middle";
        c.textAlign = "center";
         this.pervalue = Math.round( value  * 100) / 100;

    }

    addEvent(){
        document.querySelector("#navMenu").addEventListener("click", this.menuClick);
        document.querySelector("#close").addEventListener("click", this.closePopup);
        document.querySelector("#submit").addEventListener("click", this.submitFund);
        document.querySelector("#createBtn").addEventListener("click", this.registerFund);
        document.querySelector(".prev").addEventListener("click", this.clickbefore);
        document.querySelector(".next").addEventListener("click", this.clickafter);
    }


    clientHeight() {
        this.content.style.height 
        = this.pageList[this.page].clientHeight +"px";
    }


    drawPage(){
        if(this.page == 0){
            this.drawFund();
 
        }
        if(this.page == 1){
            this.drawFundRegister();
            this.registerReset();
            
        }
        if(this.page == 2){
            this.drawFundListPage();
        }
        if(this.page == 3) {
            this.drawInv();
        }
    }
}


window.onload = function(){
    window.app = new App();
}    
