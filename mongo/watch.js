const fs = require('fs')

const shouldWriteFile = process.env.WRITE_TO_DISK === 'false' ? false : true
console.log(`Write to file set to ${shouldWriteFile}`)

const out = []
const cursors = []

const writeFile = (content) => {
  fs.writeFile('./watch.json', JSON.stringify(content), err => {
    if (err) {
      console.error(err);
    }
  });
}

function writeOut(next) {
  if (shouldWriteFile) {
    out.push(next);
    writeFile(out);
  }
}



function logOut(doc) {
  const { _id, operationType, clusterTime, ns, fullDocument, updateDescription, documentKey } = doc

  RED = '\033[1;31m'
  GREEN = '\033[1;32m'
  YELLOW = '\033[1;33m'
  CYAN = '\033[0;36m'
  NC = '\033[0m' // No Color
  let color
  // # ANSI escape codes
  // # Black        0; 30     Dark Gray     1; 30
  // # Red          0; 31     Light Red     1; 31
  // # Green        0; 32     Light Green   1; 32
  // # Brown / Orange 0; 33     Yellow        1; 33
  // # Blue         0; 34     Light Blue    1; 34
  // # Purple       0; 35     Light Purple  1; 35
  // # Cyan         0; 36     Light Cyan    1; 36
  // # Light Gray   0; 37     White         1; 37
  console.log(documentKey)
  if (operationType === 'delete') {

    color = RED
    console.log(`${NC}(${CYAN}${ns.db}.${ns.coll}${NC}) - ${color}${operationType}${NC}`)
  }
  if (operationType === 'update') {
    color = YELLOW
    console.log(`${NC}(${CYAN}${ns.db}.${ns.coll}${NC}) - ${color}${operationType}${NC}`)
    console.log(updateDescription)
  }
  if (operationType === 'insert') {
    color = GREEN
    console.log(`${NC}(${CYAN}${ns.db}.${ns.coll}${NC}) - ${color}${operationType}${NC}`)
    console.log(fullDocument)
  }
  console.log('-------------------')
}

console.log('Watching collections one by one. I have not found a way to parallelize this startup process.')
db.getMongo().getDBNames().forEach(function (dbname) {
  try {
    console.log(`watching ${dbname}`)
    cursors.push(db.getSiblingDB(dbname).watch())
  } catch (error) {
    // errors happen on connection to admin db
    if (!(error.message.includes('$changeStream may not be opened'))) {
      console.log({ error })
    }
  }
});

console.log(`Watching ${cursors.length} cursors`)

while (true) {
  cursors.forEach((watchCursor) => {
    let next = watchCursor.tryNext()
    while (next !== null) {
      out.push(next)
      writeOut(next)
      logOut(next);
      next = watchCursor.tryNext()
    }
  })
}

console.log('Now watching all collections. It may take a second or two for data changes to propagate.')