// uri should be one of /projects, /about, or /
const uri = document.location.pathname.replace(/(\/(projects|about)?).*/, "$1")

// Identify which navigation "tab" we're on
const navLinks = document.querySelectorAll('nav a')
Array.from(navLinks).find(a => a.pathname == uri)?.classList?.add('live')

// Make all external anchors open in new tabs
document.querySelectorAll('article a')
  .filter(a => a.attributes?.href?.value?.startsWith('http')
  .forEach(a => a.target = '_blank')
