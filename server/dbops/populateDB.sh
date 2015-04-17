#!/usr/bin/bash

if [ "$1" = "clean" ]; then
  mongo localhost:27017/urf-dev  --eval "db.nodes.remove({})";
  mongo localhost:27017/urf-dev  --eval "db.edges.remove({})";
else
  mongo localhost:27017/urf-dev nodeInsert.js
  mongo localhost:27017/urf-dev edgeInsert.js
fi
