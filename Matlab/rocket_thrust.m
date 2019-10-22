

function [T] = rocket_thrust(t)

%
% time data from GorillaMotors
%
tdata = [0 .015 .033 .049 .167 .310 .512 .618 .839  ...
    0.899 0.98 1.02 1.05 1.26303 1.3];

%
% thrust data from GorillaMotors
%
Tdata = [0 113.792 193.101 172.412 256.893 296.548 303.445 305.169  ...
    298.272 291.376 266.893 244.652 222.411 10.345 0];


if t < max(tdata)
    T  = interp1(tdata,Tdata,t);
else
    T  = 0;
end




