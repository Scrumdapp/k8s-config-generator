#!/usr/bin/env sh

npm i
npm run test

mkdir pub
cd pub || exit
cp ../package.json .
cp ../package-lock.json .
cp ../tsconfig.json .
cp ../LICENSE .
cp -r ../src .
cp -r ../node_modules .

npm run build
rm -r src
rm -r node_modules

npm publish --access public

cd ..
rm -r pub