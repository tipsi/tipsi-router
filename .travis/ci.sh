#!/bin/bash

npm install
npm run lint
npm test

cd example
npm install

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
