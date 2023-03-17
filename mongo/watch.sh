#!/bin/bash 

source .env 

echo "Listing processes listening on port 27017" 
lsof -i :27017

echo "Listening to Mongo on namespace $NAMESPACE"

MONGO_POD_NAME=mongo-0
nohup kubectl port-forward $MONGO_POD_NAME  --namespace $NAMESPACE 27017:27017 &

sleep 5

cat watch.js | mongosh "mongodb://localhost:27017/?readPreference=primary&appname=$NAMESPACE&directConnection=true&ssl=false&serverSelectionTimeoutMS=10000"

