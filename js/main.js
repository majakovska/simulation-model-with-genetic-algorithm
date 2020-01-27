var width;
var height;

var brGeneracije = 0;
var maxFitIkada = 0;
var populacija;
var simulator;
var brojac;
var trenutni = POCETAK_MUTACIJE;

function setup() {
	frameRate(1000 / PAUZA);

	inicijalizacija();
	simulacija();
}

function draw() {
	if(pokreni()) {
		return;
	}

	revizija();
	selekcija();
	uparivanje();
	simulacija();
}

function inicijalizacija() {
	initKonstante();
	
	populacija = [];
	simulator = [];

	for(let i = 0; i < POPULACIJA; i++) {
    	populacija[i] = new Model();
    	simulator[i] = new Sim();
	}

	brojac = 0;
}

function initKonstante() {
	var redovi = floor(sqrt(POPULACIJA));
	var odnosPrikaza = 1 / redovi;

	width = (window.innerWidth ||
    	document.documentElement.clientWidth ||
        document.body.clientWidth ||
        document.body.offsetWidth) * odnosPrikaza;

	height = (window.innerHeight ||
    	document.documentElement.clientHeight ||
        document.body.clientHeight ||
        document.body.offsetHeight) * odnosPrikaza;
}

function pokreni() {
	if(brGeneracije == 100 || maxFitIkada == 1) return true;
	for(let i = 0; i < simulator.length; i++) {
		if(!simulator[i].finished) {
			return true;
		}
	}

	return false;
}

function revizija() {
	var sum = 0;
	var brojac = 0;
	var max = FITNES;

	for(let i = 0; i < populacija.length; i++) {
		let trenutna = populacija[i].fitnes;

		if(trenutna == 1) {
			console.log("Evolucija!");
		}

		if(trenutna > maxFitIkada){
			maxFitIkada = trenutna;
		}

		if(trenutna > max) {
			max = trenutna;
		}

		sum += trenutna;
		brojac++;
	}
	
	console.log("Generacija " + (++brGeneracije) + " " + (sum / brojac) + "{" + max + "}");
}

function selekcija() {
  	for(let i = 0; i < populacija.length; i++) {
    	populacija[i].fitnesVrednost();
	}
}

function uparivanje() {
	azurirajMutaciju();

	var deca = [];

	for(let i = 0; i < populacija.length; i++) {
		let partnerA = izaberiPartnera(null);
		let partnerB = izaberiPartnera(partnerA);
		
		deca[i] = partnerA.upari(partnerB, trenutni);
 	}

	populacija = deca;
}

function simulacija() {
	for(let i = 0; i < simulator.length; i++) {
		simulator[i].sim(populacija[i]);
	}
}

function azurirajMutaciju() {
	if(brojac > PAUZA_MUTACIJE
		&& brojac % PAUZA_MUTACIJE == 0) {
		trenutni -= DELTA;

		if(trenutni < KRAJ_MUTACIJE) {
			trenutni = KRAJ_MUTACIJE;
		}
	}
}

function izaberiPartnera(previous) {
	var partner = previous;
	
	while(partner === previous || partner.fitnes == FITNES) {
		partner = prihvati();
	}
	
	return partner;
}

function prihvati() {
	var kraj = 0;

	while(kraj < 1000) {
		let partner = populacija[floor(random(populacija.length))];
		
		if(random() < partner.fitnes) {
			return partner;
		}	
	}
}
