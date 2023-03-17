#!/bin/bash 

source .env 

echo "Listing processes listening on port 6379" 
lsof -i :6379

echo "Listening to Redis on namespace $NAMESPACE"

REDIS_POD_NAME=$(kubectl get pods | grep redis | awk '{print $1}')
redis-cli CONFIG SET notify-keyspace-events KEA 
nohup kubectl port-forward $REDIS_POD_NAME  --namespace $NAMESPACE 6379:6379 &
node watch.js