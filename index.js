const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const marked = require('marked')
const favicon = require('serve-favicon')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database(path.join(__dirname, 'database.db'))
console.log(db)
const template = fs.readFileSync('template.html').toString()

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/*', (req, res) => {
  const article = marked('# Header!\n\n*and* other stuff')
  const page = template.replace('%%', article)
  res.send(page)
})


app.listen(3000, _ => console.log('running'))
/*
 * WIP
 * Use github.com/ceautery/sixDegreesOfSpidey/blob/master/spidey.js
 * and github.com/ceautery/pixel/blob/master/index_old.js
 * as templates to continue
 */
