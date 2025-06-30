# autery.net

This project is no longer maintained. It was the engine that ran my [autery.net](https://autery.net) blog until June 2025.

Initially the engine consisted of an AWS Lambda function to parse Markdown files on S3, with custom CSS to render math equations and some other rendering hacks.

Later I switched to rendering locally, and hosting the HTML files on S3, and then I fell down a rabbit hole of wanting to do things "better", like using KaTeX for better looking math equations, and Handlebars for better templating to throw `og:` meta tags in the right place.

And then I discovered [Astro](https://astro.build). It supported everything I wanted to do with the blog, plus syntax highlighting and better image handling. So I converted everything. The new repo is at [/ceautery/ceautery.github.io](https://github.com/ceautery/ceautery.github.io).
