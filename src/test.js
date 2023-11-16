// Run this in the src folder with
// node test.js <markdown file> > static/<output html file>
// View output by running http-server from static folder

import fs from 'fs'
import { render } from './index.js'

const mdFile = process.argv[2]
const template = fs.readFileSync('static/template.html').toString('utf-8').replace(/"\/s/g, '"s')
const page = mdFile ? fs.readFileSync(mdFile).toString('utf-8') : '# Page here'

console.log(render(template, page))
