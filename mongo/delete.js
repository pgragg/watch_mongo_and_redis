const fs = require('fs');

let myItems
fs.readFile('./watch.json', (err, content) => {
  console.error(err)
  myItems = JSON.parse(content)
})

console.log({ myItems })

let uniqs = {}
myItems.map((i) => { return i['ns'] }).forEach((myItem) => {
  uniqs[myItem.db] = uniqs[myItem.db] || {}
  uniqs[myItem.db][myItem.coll] = 1
})

console.log({ uniqs })

const dbNames = Object.keys(uniqs)
dbNames.map((dbName) => {
  const dbObj = uniqs[dbName]
  const dbConnection = db.getSiblingDB(dbName)
  const collections = Object.keys(dbObj)
  collections.forEach((collectionName) => {
    dbConnection[collectionName].deleteMany({})
  })
})