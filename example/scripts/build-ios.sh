#!/bin/bash

set -e

# Go to ios path
cd ios

# Run release build
xcodebuild build \
  -scheme example \
  -configuration Release \
  -sdk iphonesimulator \
  -derivedDataPath build \
  ONLY_ACTIVE_ARCH=NO \
  OTHER_LDFLAGS='$(inherited) -ObjC -lc++'