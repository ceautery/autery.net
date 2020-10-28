const marked = require('marked')
const AWS = require('aws-sdk/clients/s3')
const s3 = new AWS()

exports.handler = async (event, context, callback) => {
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
    const body = template.replace('%%', marked(page))

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
