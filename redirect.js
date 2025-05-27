exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;

  if (request.uri == '/kinga') {
    request.uri = '/pages/kinga.html'
  } else if (/^\/blog\/[\w-]+$/.test(request.uri)) {
    request.uri = request.uri + '.html'
  } else if (request.uri == '/' || request.uri == '/blog') {
    request.uri = '/index.html'
  } else if (request.uri == '/about') {
    request.uri = '/about.html'
  }

  callback(null, request);
};
