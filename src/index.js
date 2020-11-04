const marked = require('marked')
const AWS = require('aws-sdk/clients/s3')
const s3 = new AWS()

const renderer = {
  paragraph(text) {
    const match = text.match(/^\.(.+?)\n(.+)/s)
    if (match == null) return false

    return `<p class="${match[1]}">${match[2]}</p>`
  },

  code(text) {
    const match = text.match(/^\.(.+?)\n(.+)/s)
    if (match == null) return false

    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    const escaped = match[2].replace(/[&<>"']/g, ch => escapeReplacements[ch])
      .replace(/\b__(.+?)__\b/g, "<strong>$1</strong>")
      .replace(/\b_(.+?)_\b/g, "<em>$1</em>")

    return `<pre class="${match[1]}"><code>${escaped}</code></pre>`
  }
}

marked.use({ renderer })

function render(template, page) {
   return template.replace('%%', marked(page))
}

async function handler(event, context, callback) {
  const request = event.Records[0].cf.request

  async function getFile(key) {
    const obj = await s3.getObject({
      Bucket: 'autery-blog',
      Key: key
    }).promise()

    return obj.Body.toString('utf-8')
  }

  const uri = request.uri.replace(/\?.+/, '')

  const isTemplate = uri == "/" || /template\.html/.test(uri)
  const isMarkdown =  /\/(blog|about|projects)/.test(uri)

  if (isTemplate || isMarkdown) {
    const template = await getFile('template.html')
    const key = isTemplate ? 'blog.md' : uri.replace(/^\//, '') + '.md'
    const page = await getFile(key)
    const body = render(template, page)

    const response = {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [{
          key: 'Content-Type',
          value: 'text/html'
        }]
      },
      body
    }

    callback(null, response)
  } else {
    callback(null, request)
  }
}

module.exports = { handler, render }
