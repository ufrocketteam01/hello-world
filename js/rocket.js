var ode45 = require('ode45-cash-karp')

function getDesignSpan(){
 	var designSpan = Number(document.getElementById('finSpan').value);
 	return designSpan;
 }
 function getDesignChord(){
 	var designChord = Number(document.getElementById('finChord').value);
 	return designChord;
 }
 function getDesignLocation(){
 	var designLocation = Number(document.getElementById('finLocation').value);
 	return designLocation;
 }
 function getWind(){
 	var wind = Number(document.getElementById('wind').value);
 	return wind;
 }
 function getDesignFuselage(){
 	var designFuselage = Number(document.getElementById('rocketLength').value);
 	return designFuselage;
 }
 
 function test(){
 	console.log("HI");

 }
function testing_gianne(){
 	var design_span = getDesignSpan();
	var design_chord = getDesignChord();
	var design_location = getDesignLocation();
	var wind = getWind();
	var design_fuselage = getDesignFuselage();
	// var sum = design_chord + design_span;

	var ode = rocket_cost();
	var outputText = document.getElementById('output_text').innerHTML = "IT WORKS " + ode;
 	
 }


// function rocket_ode(t,y){
	var rocketODE = function (t,y){


	design_span = getDesignSpan();
	design_chord = getDesignChord();
	design_location = getDesignLocation();
	wind = getWind();
	design_fuselage = getDesignFuselage();

	// define constants

	var g = 9.8;                // gravity (assume constant for all altitudes)
	var rho = 1.225;            // density (assume constant for all altitudes)

	// change later
	var I = 2000;               // moment of inertia 

	var mm = 1.0;               // mass of motor
	var me = 0.5;               // mass of electronics bay
	var mc = 0.1;               // mass of parachute
	var mn = 0.25;              // mass of nosecone
	var mb = 0.0;               // mass of ballast
	var rhofus = 0.241;         // density (kg/m) of fuselage 
	var rhofin = 1800;          // density (kg/m^3) of fin

	// define coefficients of lift and drag 
	
	// define coefficients of lift and drag
	var CLofus = 0;       // CLo for fuselage
	var CLofin = 0;       // CLo for fin

	var CLafus =  0.125;       // CLalpha for fuselage
	var CLafin = 0.125;     // CLalpha for fin

	var CDofus = 0.015;     // CDo for fuselage
	var CDofin = 0.015;    // CDo for fin

	var CDafus = 0.0175;     // CDalpha for fuselage
	var CDafin = 0.0175;  // CDalpha for fin

	// approximate thickness of airfoil
	var design_thickness = design_chord/6;


	// compute mass of fins and fuselage
	var mfus = rhofus*design_fuselage;
	var mfin = rhofin*(design_span*design_chord*design_thickness);

	// compute reference area for fuselage
	var A = Math.PI*Math.pow(.038/2,2);

	// compute reference area for fin
	var S = design_span * design_chord;

	// compute body-axis velocities
	var u = y(3)+wind*Math.cos(y(5));
	var w = y(4)+wind*Math.sin(y(5));

	// compute total velocity
	var V = Math.sqrt(Math.pow(u,2) + Math.pow(w,2));

	// compute angle of attack 
	//   (set alpha=0 when forward velocity=0 to avoid divide-by-zero error);
	var alpha = 0;
	if (u != 0){
	    alpha = Math.atan(w/u);
	}

	// compute lift and drag at this velocity and angle-of-attack
	var L = .5*rho*Math.pow(V,2)*(A*(CLofus + CLafus*alpha) + S*(CLofin + CLafin*alpha));
	var D = .5*rho*Math.pow(V,2)*(A*(CDofus + CDafus*alpha) + S*(CDofin + CDafin*Math.pow(alpha,2)));

	// generate the thrust and mass of propellant
	var T  = rocket_thrust(t);
	var mp = rocket_mass(t);

	// generate weight
	var m = mp + mm + me + mc + mn + mfus + mfin;
	var W = m*g;

	// compute center of pressure of fins as distance from nose to quarter-chord
	var xcp = design_location + 0.25*design_chord;

	// compute center of gravity as distance from nose to cg
	var xcg = 4.5; // TODO: this will change


	// end simulation if we've hit ground already
	//  ******** STUCK ON THIS PART WITH Y: what is y(?) **********
	if (y[1] > 1){
		var qq;
		for(qq = 0; qq<6; qq++){
			y[qq] = y[qq] * 0;
		}
	}



	// generate state derivatives 
	// var ydot = [][];

	rocketODE[0,0] = y[2]*Math.cos(y[4]) + y[3]*Math.sin(y[4]);
	rocketODE[1,0] = -y[2]*Math.sin(y[4]) + y[3]*Math.cos(y[4]);
	rocketODE[2,0] = (-W*Math.sin(y[4]) + T + L*Math.sin(alpha) - D*Math.cos(alpha))/m;
	rocketODE[3,0] = (W*Math.cos(y[4]) - L*Math.cos(alpha) - D*Math.sin(alpha))/m;
	rocketODE[4,0] = y[5];
	rocketODE[5,0] = -(xcp-xcg)*(L*Math.cos(alpha) + D*Math.sin(alpha))/I;
}

function rocket_cost(){

	// set the simulation length 
	var tfinal = 20;



	// simulate launch
	// TODO: what are each of these variables being passed into ode45
	// https://github.com/scijs/ode45-cash-karp

	// var ode45 = require('ode45-cash-karp')

	// var i;
	// for( i =0; i<tfinal; i++){
	// 	ode45([0 0 0 0 pi/2 0], rocketODE, i, 0.1 )
	// }

	var dt0 = 0.1, y0 = [0, 0, 0, 0, Math.PI/2, 0];
	var integrator = ode45( y0, rocketODE, 0, dt0);

	// Integrate up to tmax:
	var t = [], y = []
	while( integrator.step(tfinal)) {
	  // Store the solution at this timestep:
	  t.push( integrator.t )
	  y.push( integrator.y )
	}
	// [t,y] = ode45(@rocket_ode,[0 tfinal],[0 0 0 0 pi/2 0]);

	// Convert altitude/velocity from meters to feet
	// we convert them into arrays and go through them with a for loop 
	// y(:,1:4) = y(:,1:4)/.3048;

	var i, j;
	for(i = 0; i<6; i++){
		for(j = 0; j<4; j++){
			y[i][j] = (y[i][j]/0.3048);
		}
	}

	// Convert angles/rates from radians to degrees
	// we convert them into arrays and go through them with a for loop 
	// y(:,5:6) = y(:,5:6)*180/pi;
	var ii, jj;
	for(ii = 0; ii<6; ii++){
		for(jj = 4; jj<=5; jj++){
			y[ii][jj] = (y[ii][jj]*180/pi);
		}
	}

	// Convert Earth z-axis into altitude
	// we convert them into arrays and go through them with a for loop 
	// var h = -y(:,2);

	var xx, yy,h = [];

	for(xx = 0; xx<6; xx++){
			h[xx] = y[xx][1];
	}


	// check maximum altitudes
	var hmax = Math.max(h);

	// TODO: WHAT IS COST?
	// choose cost 
	return hmax;

}


function rocket_thrust(t){

	// time data from GorillaMotor
	var tdata = [0, .015, .033, .049, .167, .310, .512, .618, .839, 0.899, 0.98, 1.02, 1.05, 1.26303, 1.3];

	// thrust data from GorillaMotors
	//
	var Tdata = [0, 113.792, 193.101, 172.412, 256.893, 296.548, 303.445, 305.169, 298.272, 291.376, 266.893, 244.652, 222.411, 10.345, 0];

	var T = 0;
	if (t < Math.max(tdata)){
		// TODO: ask Spencer which interpolate awe can use from what Hailin found
	    T  = interp1(tdata,Tdata,t); // INCLUDE JS FILES IN HTML
	    var linear = require('everpolate').linear
		//interpolation
		T = linear(t, tdata, Tdata)
	}
	return T;
}




function rocket_mass(t){

// time data from GorillaMotor
	var tdata = [0, .015, .033, .049, .167, .310, .512, .618, .839, 0.899, 0.98, 1.02, 1.05, 1.26303, 1.3];

	// mass data from GorillaMotors
	//
mdata = [182, 181.502, 179.937, 178.205, 163.498, 140.504, 105.3, 86.6684, 47.9627, 37.6479, 24.5108, 18.5712, 14.5038, 0.111027, 0]/1000;

var mP = 0;
if (t < Math.max(tdata)){
    mP = interp1(tdata,mdata,t);
    var linear = require('everpolate').linear
	//interpolation
	mP = linear(t, tdata, mdata)
}

return mP;
}









