function getDesignSpan(){
 	var designSpan = document.forms["input_form"][finSpan]value;
 	return designSpan;
 }
 function getDesignChord(){
 	var designChord = document.forms["input_form"][finChord]value;
 	return designChord;
 }
 function getDesignLocation(){
 	var designLocation = document.forms["input_form"][finLocation]value;
 	return designLocation;
 }
 function getWind(){
 	var wind = document.forms["input_form"][wind]value;
 	return wind;
 }
 function getDesignFuselage(){
 	var designFuselage = document.forms["input_form"][rocketLength]value;
 	return designFuselage;
 }

function testing(){
 	design_span = getDesignSpan();
	design_chord = getDesignChord();
	design_location = getDesignLocation();
	wind = getWind();
	design_fuselage = getDesignFuselage();

	Console.log(design_span+" "+design_chord+ " "+design_location+" "+wind+" "+ design_fuselage);
 }

function rocket_ode(t,y,){


	design_span = getDesignSpan();
	design_chord = getDesignChord();
	design_location = getDesignLocation();
	wind = getWind();
	design_fuselage = getDesignFuselage();

	// define constants

	var g = 9.8;                // gravity (assume constant for all altitudes)
	var rho = 1.225;            // density (assume constant for all altitudes)
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
	var CLafus = 0;       // CLalpha for fuselage
	var CLafin = 0.1;     // CLalpha for fin
	var CDofus = 0.7;     // CDo for fuselage
	var CDofin = 0.015;    // CDo for fin
	var CDafus = 0.0;     // CDalpha for fuselage
	var CDafin = 0.0001;  // CDalpha for fin

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
	var xcg = 4.5;


	// end simulation if we've hit ground already
	//  ******** STUCK ON THIS PART WITH Y: what is y(?) **********
	if y(2) > 1{
	    y = y*0;
	}



	// generate state derivatives 
	ydot(1,1) = y(3)*cos(y(5)) + y(4)*sin(y(5));
	ydot(2,1) = -y(3)*sin(y(5)) + y(4)*cos(y(5));
	ydot(3,1) = (-W*sin(y(5)) + T + L*sin(alpha) - D*cos(alpha))/m;
	ydot(4,1) = (W*cos(y(5)) - L*cos(alpha) - D*sin(alpha))/m;
	ydot(5,1) = y(6);
	ydot(6,1) = -(xcp-xcg)*(L*cos(alpha) + D*sin(alpha))/I;

	// *************************************************************
}

function rocket_cost(){

	// set the simulation length 
	var tfinal = 20;

	// simulate launch
	// TODO: what are each of these variables being passed into ode45
	// https://github.com/scijs/ode45-cash-karp
	integrator = ode45( y0, rocket_ode(), t0, dt0 )
	[t,y] = ode45(@rocket_ode,[0 tfinal],[0 0 0 0 pi/2 0]);

	// Convert altitude/velocity from meters to feet
	// we convert them into arrays and go through them with a foor loop 
	y(:,1:4) = y(:,1:4)/.3048;

	// Convert angles/rates from radians to degrees
	// we convert them into arrays and go through them with a foor loop 
	y(:,5:6) = y(:,5:6)*180/pi;

	// Convert Earth z-axis into altitude
	// we convert them into arrays and go through them with a foor loop 
	var h = -y(:,2);

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
	    T  = interp1(tdata,Tdata,t);
	}
	return T;
}







