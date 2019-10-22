
%-----------------------------------------------
% iterate over a design space for span/chord
%-----------------------------------------------

%
% define the four possible parameters as global variables
%
global design_span;
global design_chord;
global design_fuselage;
global design_location;

%
% Set default values for all parameters
%
design_span = 0.02;
design_chord = 0.2;
design_fuselage = 6.18;
design_location = 4.92;

%
% YOU CHOOSE THE MIN/MAX VALUES FOR YOUR PARAMETER
%
MIN1 = 2;      % minimum of 1st parameter
MAX1 = 5;      % maximum of 1st parameter
MIN2 = 2;      % minimum of 2nd parameter
MAX2 = 6.18;      % maximum of 2nd parameter

%
% Make vector of parameter values
%
PARAMETER1 = [MIN1: (MAX1-MIN1)/10: MAX1];
PARAMETER2 = [MIN2: (MAX2-MIN2)/10: MAX2];

%
% search over design space
%
for i = 1:length(PARAMETER1)
    for j=1:length(PARAMETER2)
        design_location = PARAMETER1(i);
        design_fuselage = PARAMETER2(j);
        J(i,j) = rocket_cost;
    end
end

%
% plot cost function across design space
%
figure(2)
surf(PARAMETER2,PARAMETER1,J)
ylabel('FIN LOCATION (m)');
xlabel('FUSELAGE LENGTH(m)');
zlabel('Maximum Altitude (ft)');
title('Spencer Smith');



