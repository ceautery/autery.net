const navLinks = document.querySelectorAll('nav a')
const liveLink = Array.from(navLinks)
  .find(a => a.pathname == document.location.pathname)
if (liveLink) liveLink.classList.add('live')