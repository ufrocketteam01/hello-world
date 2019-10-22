

function [mP] = rocket_mass(t)

%
% time data from GorillaMotors
%
tdata = [0 .015 .033 .049 .167 .310 .512 .618 .839  ...
    0.899 0.98 1.02 1.05 1.26303 1.3];


%
% mass data from GorillaMotors
%
mdata = [182 181.502 179.937 178.205 163.498 140.504 105.3 86.6684 47.9627 ...
                37.6479 24.5108 18.5712 14.5038 0.111027 0]/1000;

if t < max(tdata)
    mP = interp1(tdata,mdata,t);
else
    mP = 0;
end




