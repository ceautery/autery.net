<!doctype html>
<html>
<head>
  {{#if hasMath}}
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP" crossorigin="anonymous">
  {{/if}}
  <link rel="stylesheet" href="/style.css">
  <link rel="me" href="https://mastodon.social/@CurtisAutery">
  <meta name="viewport" content="width=500">
  <meta charset="UTF-8">
  {{#each tags}}
  <meta property="{{property}}" content="{{content}}">
  {{/each}}
</head>
<body>
  <header>
    Curtis Autery, pretty ok software writer.

    <nav>
    {{#if isAbout}}
      <a href="/">blog</a>
      <a href="/about" class="live">about</a>
    {{else}}
      <a href="/" class="live">blog</a>
      <a href="/about">about</a>
    {{/if}}
    </nav>
  </header>

  <article>
{{{article}}}
  </article>
</body>
</html>
