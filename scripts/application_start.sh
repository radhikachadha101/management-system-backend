#!/bin/bash

#give permission for everything in the AIS_Backend directory
sudo chmod -R 777 /home/ec2-user/AIS_Backend

#navigate into our working directory where we have all our github files
cd /home/ec2-user/AIS_Backend

#install node modules
sudo npm i

#Just in case if the existing node servers didn't stop
sudo kill -9 $(lsof -t -i:3000)

#To keep the server live an running
sudo npm install pm2 -g
sudo pm2 start app.js -f

#start our node app in the background

