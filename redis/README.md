# DB Deltas

https://www.mongodb.com/docs/manual/changeStreams/


https://redis.io/docs/manual/keyspace-notifications/

# How to 
redis-cli config set notify-keyspace-events KEA 
bash redis.sh

npx nodemon --exec "node redisSubscribe.js"

bash test-redis.sh