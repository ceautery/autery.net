import fs from 'fs'
import marked from 'marked'
import katex from 'katex'
import Handlebars from 'handlebars'

const renderer = {
  // Add a CSS class to a <p> block, with special handling for the "tip" class.
  // I use this for image attribution popups on hover, with this style of usage:
  //
  // .tip <- This line will by match[1]
  // ![](/path/to/image.png) <- This line will be fields[1]
  // [Source image desc](https://source.image/location.png)
  // by [Owner](https://owner.profile/)
  // is licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en)
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

  // Add a CSS class to a <pre> block, allow markdown for inline strong/em (__text__, _text_)
  // Coupled with the .codez definitions in style.css, this allows simple color schemes for shell sessions.
  // I use it to differentiate the shell prompt, user input, and output of commands.
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

  // Use codespans (inline <code> without <pre> blocks) to render KaTeX equations
  // https://katex.org/docs/supported.html
  // https://utensil-site.github.io/available-in-katex/
  //
  // `$ (equation) $` renders inline
  // `$$ (equation) $$` renders as larger centered block
  //
  // Example:
  // `$\frac{1}{2}$`
  codespan(text) {
    if (!text.startsWith('$')) return false

    const displayMode = text.startsWith('$$')

    return text.replace(/^\$+(.*?)\$+$/, (m, equation) => katex.renderToString(equation, { displayMode }))
  },

  // Open external links in a new tab
  link(href, title, text) {
    if (!href.startsWith('http')) return false

    return title ? `<a href="${href}" title="${title}" target="_blank">${text}</a>`
                 : `<a href="${href}" target="_blank">${text}</a>`
  }
}

marked.use({ renderer })

function getTag(line) {
  const [_match, property, content] = line.match(/^(og:\w+) (.+)/)
  return { property, content }
}

function getTags(metas) {
  return metas[0].match(/.+/g).map(getTag)
}

function render(template, page, filename) {
  const isAbout = /about\.md/.test(filename)
  const hasMath = /`\$/.test(page)
  const metas = page.match(/^(og:.+\n)+/)
  const tags = metas ? getTags(metas) : []
  const offset = metas ? metas[0].length + 1 : 0
  const article = marked(page.slice(offset))

  const compiled = Handlebars.compile(template)
  return compiled({isAbout, hasMath, tags, article})
}

export { render }
