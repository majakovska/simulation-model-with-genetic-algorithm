var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Constraint = Matter.Constraint;
var Events = Matter.Events;

class Sim {

	sim(dnk) {
		this.free();
  		this.init(dnk);
		this.pokreni(dnk);
	}

	free() {
		this.ocisti();
		this.izbrisi();
	}

	init(dna) {
		this.engine = Engine.create();
    	this.render = Render.create({
        	element: document.body,
       		engine: this.engine,
        	options: {
            	width: width,
            	height: height,
        		wireframes: false
			}
    	});
		
		this.daska = Bodies.rectangle(
			width * 0.6,
			height * 0.6,
			width * 0.6,
			height * 0.05, {
			render: {
         		fillStyle: 'black'
			}	
		});
		
		this.pod = Bodies.rectangle(
			width * 0.6,
			height,
			width,
			1, {
			isStatic: true,
			visible: false
		});
		
		this.lopta = Bodies.circle(
			width * 0.6 + 1,
			0,
			width * 0.025, {
			friction: TRENJE,
			render: {
				fillStyle: 'black'
			}
		});

		World.add(this.engine.world, [
			this.daska,
			this.pod,
			Constraint.create({ 
            	bodyA: this.daska,
            	pointB: {
					x: width * 0.6,
					y: height * 0.6
				},
            	stiffness: 1,
            	length: 0
        	}),
			this.lopta
    	]);

		var stanje = this;

		Events.on(this.engine, 'collisionStart', function(event) {
			let a = event.pairs[0].bodyA;
			let b = event.pairs[0].bodyB;
    		
			stanje.sudar(a, b, dna);
		});

		this.render.options.background = 'white';
	}

	pokreni(dna) {
		Engine.run(this.engine);	
		Render.run(this.render);

		var context = this;

		this.duration = 0;
		this.actionInterval = setInterval(function() {
			if(context.duration > TRAJANJE) {
				clearInterval(this.actionInterval);
				return;
			}

			context.nazad(dna);
			context.duration += PAUZA;
		}, PAUZA);
	}
	
	ocisti() {
		this.finished = false;
	}

	izbrisi() {
		if(typeof this.engine !== 'undefined') {
			Render.stop(this.render);
			World.clear(this.engine.world);
        	Engine.clear(this.engine);
		
			this.render.canvas.remove();
			this.render.textures = {};	
		}
	}

	sudar(a, b, dnk) {
		if((a === this.lopta && b === this.pod)
			|| (a === this.pod && b === this.lopta)) {
			clearInterval(this.actionInterval);
			
			dnk.fitnesVrednost();

			this.finished = dnk.dead = true;

			this.render.options.background = lerpColor(
				color(255, 0, 0),
				color(0, 255, 0),
				dnk.fitnes);
		}	
	}  

	nazad(dna) {
		var gene = dna.sledeci();

		if(typeof gene === 'undefined') {
			clearInterval(this.actionInterval);
			
			dna.fitnesVrednost();
	
			this.finished = true;
		}

		this.daska.torque = GENI[gene];
	}
}
