import fs from 'fs'
import { globSync } from 'glob'
import { render } from './render.js'

const globPattern = process.argv[2] || 'src/**/*.md'
const destFolder = process.argv[3] || 'dist'
const template = fs.readFileSync('src/static/template.hb').toString('utf-8')

function renderSingle(filename) {
  if(!/\.md$/.test(filename)) {
    console.log(`Skipping ${filename} - Markdown files only`)
    return
  }

  if(!/^src\/static/.test(filename)) {
    console.log(`Skipping ${filename} - Wrong start directory`)
    return
  }

  const markdown = fs.readFileSync(filename).toString('utf-8')
  const outputFilename = filename.replace(/^src\/static/, destFolder).replace(/md$/, 'html')

  console.log(`Writing ${outputFilename}`)
  const html = render(template, markdown, filename)
  fs.writeFileSync(outputFilename, html)
}

globSync(globPattern).forEach(renderSingle)
