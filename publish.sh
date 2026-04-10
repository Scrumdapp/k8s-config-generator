#!/usr/bin/env sh

npm i

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