#!/bin/bash
PROJECT_ROOT=`pwd`

cd ${PROJECT_ROOT}/packages/frontend/
if [ -e dist ]; then 
    rm dist -rf 
fi
yarn build
cd ${PROJECT_ROOT}/packages/electron
if [ -e dist ]; then 
    rm dist -rf
fi
yarn tsc
cp -r ${PROJECT_ROOT}/packages/frontend/dist ./dist/UI
yarn electron-builder --config electron-builder.json --win
mkdir -p electron_dist/win-unpacked/static
cp -r ${PROJECT_ROOT}/packages/overlay electron_dist/win-unpacked/static
cp ${PROJECT_ROOT}/static/noface.jpg electron_dist/win-unpacked/static

cp -r electron_dist/win-unpacked $PROJECT_ROOT/dist