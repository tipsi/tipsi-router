#!/bin/bash

export NODEJS_ORG_MIRROR=http://nodejs.org/dist
wget https://raw.githubusercontent.com/creationix/nvm/v0.31.0/nvm.sh -O ~/.nvm/nvm.sh
source ~/.nvm/nvm.sh
$HOME/.nvm/nvm.sh
nvm install 8.6.0
npm i npm@5 -g

node --version
npm install
cd example
npm install

case "${TRAVIS_OS_NAME}" in
  linux)
    echo no | android create avd --force -n test -t android-21 --abi armeabi-v7a --skin WVGA800
    emulator -avd test -scale 96dpi -dpi-device 160 -no-audio -no-window &
    android-wait-for-emulator
    sleep 60
    adb shell input keyevent 82 &
  ;;
esac

node_modules/.bin/appium --session-override > appium.out &

case "${TRAVIS_OS_NAME}" in
  osx)
    set -o pipefail && npm run build:ios | xcpretty -c -f `xcpretty-travis-formatter`
    npm run test:ios
  ;;
  linux)
    npm run build:android
    npm run test:android
  ;;
esac
