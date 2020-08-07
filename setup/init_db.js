const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(path.join(__dirname, '..', 'database.db'))
const initDB = fs.readFileSync(path.join(__dirname, 'init_db.sql'), 'utf8')

db.exec(initDB, err => {
    if (err) console.log(err)
    else console.log("Database initialized")
})
