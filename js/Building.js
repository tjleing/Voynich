// @ts-check

class Building {
    constructor(name, wps, cost, quantity) {
        this._id = Building.counter;

        this.name = name;
        this.wps = wps;
        this.cost = cost;
        this.quantity = quantity;
        this.affordable = false;

        // create stat div on left panel
        this.statDiv = document.createElement("div");
        this.statDiv.id = this.id + "stats";
        var leftpanel = document.getElementById("leftpanel");
        leftpanel.appendChild(this.statDiv);

        // create buttons on right panel
        const buttonDiv = document.createElement("div");
        this.button = document.createElement("button")
        this.button.id = `button${this.id}`;
        this.button.classList.add('button');
        if(this.id % 2 == 0) {
            this.button.classList.add('grayed');
        }
        else {
            this.button.classList.add('notgrayed');
        }
        this.button.innerHTML = `Buy one <span id="bname${this.id}">${this.name}</span>`;
        buttonDiv.appendChild(this.button);
        buttonDiv.id = `${this.id}`;
        var buildingDiv = document.getElementById("buildings");
        buildingDiv.appendChild(buttonDiv);
    }

    tick() {
        if (this.affordable) {
            this.button.classList.toggle('grayed', false);
            this.button.classList.toggle('notgrayed', true);
        }
        else {
            this.button.classList.toggle('notgrayed', false);
            this.button.classList.toggle('grayed', true);
        }
    }

    buy() {
        this.quantity++;
    }

    static get counter () {
        return Building._counter++;
    }

    get id () {
        return this._id;
    }
}

Building._counter = 0;

export { Building };