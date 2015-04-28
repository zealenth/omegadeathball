#!/bin/bash

mkdir "tmp";
`split -d -l 100000 $1`
mv x* tmp;

for file in ./tmp/*
do
  rm tmp.js
  `head -n 1 $1 >> tmp.js`
  cat $file >> tmp.js
  `tail -n 1 $1 >> tmp.js`
  mongo localhost:27017/urf-dev tmp.js
   echo $file
done

rm tmp/*
rmdir tmp
