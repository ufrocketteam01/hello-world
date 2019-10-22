

function J = rocket_cost()

%
% set the simulation length 
%



tfinal = 20;

%
% simulate launch
%
[t,y] = ode45(@rocket_ode,[0 tfinal],[0 0 0 0 pi/2 0]);

%
% Convert altitude/velocity from meters to feet
%
y(:,1:4) = y(:,1:4)/.3048;

%
% Convert angles/rates from radians to degrees
%
y(:,5:6) = y(:,5:6)*180/pi;

%
% Convert Earth z-axis into altitude
%
h = -y(:,2);

%
% check maximum altitudes
%
hmax = max(h);

%
% choose cost
%
J = hmax;

%
% plot trajectory
%
figure(1)
plot(t,h);
xlabel('Time (s)');
ylabel('Altitude (ft)');



