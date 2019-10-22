

function ydot = rocket_ode(t,y)


%
% use global variables
%
global motortype;
global Ttype;
global mtype;
global design_span;
global design_chord;
global design_fuselage;
global design_location;


%
% define constants 
%
g = 9.8;                % gravity (assume constant for all altitudes)
rho = 1.225;            % density (assume constant for all altitudes)
I = 2000;               % moment of inertia

mm = 1.0;               % mass of motor
me = 0.5;               % mass of electronics bay
mc = 0.1;               % mass of parachute
mn = 0.25;              % mass of nosecone
mb = 0.0;               % mass of ballast
rhofus = 0.241;         % density (kg/m) of fuselage 
rhofin = 1800;          % density (kg/m^3) of fin

%
% define coefficients of lift and drag
%
CLofus = 0;       % CLo for fuselage
CLofin = 0;       % CLo for fin
CLafus = 0;       % CLalpha for fuselage
CLafin = 0.1;     % CLalpha for fin
CDofus = 0.7;     % CDo for fuselage
CDofin = 0.015;    % CDo for fin
CDafus = 0.0;     % CDalpha for fuselage
CDafin = 0.0001;  % CDalpha for fin

%
% approximate thickness of airfoil
%
design_thickness = design_chord/6;

%
% compute mass of fins and fuselage
%
mfus = rhofus*design_fuselage;
mfin = rhofin*(design_span*design_chord*design_thickness);

%
% compute reference area for fuselage
%
A = pi*(.038/2)^2;

%
% compute reference area for fin
%
S = design_span * design_chord;

%
% compute wind as random number between 0 and 10
%
wind = 10;

%
% compute body-axis velocities
%
u = y(3)+wind*cos(y(5));
w = y(4)+wind*sin(y(5));

%
% compute total velocity
%
V = sqrt(u^2 + w^2);

%
% compute angle of attack 
%   (set alpha=0 when forward velocity=0 to avoid divide-by-zero error);
%
if u ~= 0
    alpha = atan(w/u);
else
    alpha = 0;
end

%
% compute lift and drag at this velocity and angle-of-attack
%
L = .5*rho*V^2*(A*(CLofus + CLafus*alpha) + S*(CLofin + CLafin*alpha));
D = .5*rho*V^2*(A*(CDofus + CDafus*alpha) + S*(CDofin + CDafin*alpha^2));

%
% generate the thrust and mass of propellant
%
T  = rocket_thrust(t);
mp = rocket_mass(t);


%
% generate weight
%
m = mp + mm + me + mc + mn + mfus + mfin;
W = m*g;

%
% compute center of pressure of fins as distance from nose to quarter-chord
%
xcp = design_location + 0.25*design_chord;

%
% compute center of gravity as distance from nose to cg
%
xcg = 4.5;

%
% end simulation if we've hit ground already
%
if y(2) > 1
    y = y*0;
end

%
% generate state derivatives
%
ydot(1,1) = y(3)*cos(y(5)) + y(4)*sin(y(5));
ydot(2,1) = -y(3)*sin(y(5)) + y(4)*cos(y(5));
ydot(3,1) = (-W*sin(y(5)) + T + L*sin(alpha) - D*cos(alpha))/m;
ydot(4,1) = (W*cos(y(5)) - L*cos(alpha) - D*sin(alpha))/m;
ydot(5,1) = y(6);
ydot(6,1) = -(xcp-xcg)*(L*cos(alpha) + D*sin(alpha))/I;






