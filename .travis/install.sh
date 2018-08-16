#!/bin/bash

export NODEJS_ORG_MIRROR=http://nodejs.org/dist
wget https://raw.githubusercontent.com/creationix/nvm/v0.31.0/nvm.sh -O ~/.nvm/nvm.sh
source ~/.nvm/nvm.sh
$HOME/.nvm/nvm.sh
nvm install 8.6.0
npm i npm@5 -g

node --version

cd example
rm -rf node_modules && npm install
