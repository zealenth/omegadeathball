#!/usr/bin/bash

if [ "$1" = "clean" ]; then
  if [ "$2" = "trees" ]; then
    mongo localhost:27017/urf-dev  --eval "db.trees.remove({})";
  else
    mongo localhost:27017/urf-dev  --eval "db.nodes.remove({})";
    mongo localhost:27017/urf-dev  --eval "db.edges.remove({})";
    mongo localhost:27017/urf-dev  --eval "db.trees.remove({})";
  fi
else
  if [ "$1" = "split" ]; then
    bash chew.sh nodeInsert.js
    bash chew.sh edgeInsert.js
  else
    mongo localhost:27017/urf-dev nodeInsert.js
    mongo localhost:27017/urf-dev edgeInsert.js
  fi
fi
