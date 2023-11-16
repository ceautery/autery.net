import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import marked from 'marked'

const client = new S3Client({ region: 'us-east-2' })

function mathLetter(n) {
  // Mathematical italic h appears in the "letterlike symbols" unicode block (2100) as "Planck Constant"
  // alongside "h with stroke", the reduced Planck Constant (h/2𝜋 = ħ)
  if (n == 'h') return "\u210E"

  // The remaining mathematical italic letters appear in the "Mathematical Alphanumeric Symbols"
  // 1D434/119860 is MATHEMATICAL ITALIC CAPITAL A
  // 1D44E/119886 is MATHEMATICAL ITALIC SMALL A
  if (n < 'a') return String.fromCodePoint(119795 + n.charCodeAt()) // A = chr(65), 119860 - 65 = 119795
  return String.fromCodePoint(119789 + n.charCodeAt())              // a = chr(97), 119886 - 97 = 119789
}

const renderer = {
  paragraph(text) {
    const match = text.match(/^\.(\w+)\n(.+)/s)
    if (match == null) return false

    if (match[1] === 'tip') {
      const fields = match[2].match(/^([^\n]+)\n(.+)/s)
      if (fields != null) {
        return `<p class="hover">${fields[1]}\n  <span class="tooltip">${fields[2]}</span>\n</p>`
      }
    }

    return `<p class="${match[1]}">${match[2]}</p>\n`
  },

  code(text) {
    const match = text.match(/^\.(\w+)\n(.+)/s)
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

    return `<pre class="${match[1]}"><code>${escaped}</code></pre>\n`
  },

  codespan(text) {
    if (!text.startsWith('$$')) return false

    const converted = text.slice(2)
      .replace(/(?<!\\[a-z]*)[a-zA-Z]/g, mathLetter)
      .replace(/\*/g, '×')
      .replace(/\\(?=[a-z])/g, '')
      .replace(/{(.+?)}\/{(.+?)}/g, `<span class="fraction"><span class="numerator">$1</span>$2</span>`)
      .replace(/√\[(.+?)\]/g, `√<span class="radicand">$1</span>`)
      .replace(/\^(.+?)(\b|(?=\s))/g, "<sup>$1</sup>")

    return `<span class="math">${converted}</span>`
  }
}

marked.use({ renderer })

function render(template, page) {
  const metas = page.match(/^(og:.+\n)+/)

  if (metas) {
    const tags = metas[0]
      .match(/.+/g)
      .map(m => m.replace(/^(og:\w+) (.+)/, `<meta name="$1" content="$2">\n`))
      .join('')
    const offset = metas[0].length + 1
    return tags + template.replace('%%', marked(page.slice(offset)))
  }

  return template.replace('%%', marked(page))
}

async function handler(event, context, callback) {
  const request = event.Records[0].cf.request

  async function getFile(key) {
    const command = new GetObjectCommand({ Bucket: "autery-blog", Key: key })
    const response = await client.send(command)

    return await response.Body.transformToString('utf-8')
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

export { handler, render }
