#!/bin/bash 

# docker run -dp 6379:6379 redis || true
REDIS_POD_NAME=$(kubectl get pods | grep redis | awk '{print $1}')
kubectl port-forward $REDIS_POD_NAME  --namespace pipergragg 6379:6379 &
redis-cli CONFIG SET notify-keyspace-events KEA 