class Model {

	constructor() {
    	this.geni = [];
    	this.indeks = 0;
		this.fitnes = FITNES;
    	this.kraj = false;
		this.vremeNastanka = millis();

		var sviGeni = TRAJANJE / PAUZA;

		for(let i = 0; i < sviGeni; i++) {
      		this.geni[i] = this.randomGenom();
    	}
  	}
 
	upari(partner, mutacija) {
    	var child = new Model();

		var maxFit = max(this.fitnes, partner.fitnes);
    	var split = floor(maxFit * (this.geni.length - 1));

    	for(let i = 0; i < this.geni.length; i++) {
      		if((i <= split && maxFit == this.fitnes)
				|| (i > split && maxFit != this.fitnes)) {
				child.geni[i] = this.geni[i];
			}else {
				child.geni[i] = partner.geni[i];
			}

      		if(random() < mutacija) {
        		this.geni[i] = this.randomGenom();
      		}
    	}

    	return child;
  	}

	fitnesVrednost() {
		if(this.kraj) {
			return;
		}

		this.fitnes = (millis() - this.vremeNastanka) / TRAJANJE;
		
		if(this.fitnes > 1) {
			this.fitnes = 1;
		}
	}

	randomGenom() {
		var moguci = [];

		for(var gen in GENI) {
			moguci.push(gen);
		}

		return moguci[floor(random(moguci.length))];
	}

	sledeci() {
		return this.geni[this.indeks++];
	}
}
