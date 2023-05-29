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
yarn electron-builder --config electron-builder.json
mkdir -p electron_dist/linux-unpacked/static
cp -r ${PROJECT_ROOT}/packages/overlay electron_dist/linux-unpacked/static