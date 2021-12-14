class mainFund {
    constructor(data, el) {
        this.fundData = data;
        this.el = el; 
        const mainDom= this.mainMakeDom();
        this.el.appendChild(mainDom);
    }

    mainMakeDom() {
        const div = document.createElement("div");
        div.classList.add("fundTwo");
        const f = this.fundData;
        const fCurrent =f.current.toLocaleString();
        div.innerHTML = `
        <div class="info">
        <div class="text">
        <h3 title="${f.number}">${f.number}</h3>
        <h3 title="${f.name}">${f.name}</h3>
        <h3 title="${fCurrent}">${fCurrent}</h3> 
        <h3 title="${f.total}">of ${f.total}</h3>
        <h3 title="${f.endDate}">${f.endDate}</h3>
        </div>
        </div>
           `;
        return div;
    }
}