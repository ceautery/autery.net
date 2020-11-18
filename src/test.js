const fs = require('fs')

const blog = require('./index.js')
const mdFile = process.argv[2]
const template = fs.readFileSync('static/template.html').toString('utf-8').replace(/"\/s/g, '"s')
const page = mdFile ? fs.readFileSync(mdFile).toString('utf-8') : '# Page here'

console.log(blog.render(template, page))
