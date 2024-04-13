#!/bin/bash

#download node and npm
sudo yum install -y gcc-c++ make 
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs

#create our working directory if it doesnt exist.
DIR="/home/ec2-user/AIS_Backend"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi
