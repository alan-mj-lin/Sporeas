document.querySelectorAll('a[href^="#"]').forEach(makeSmoothScroll);

function makeSmoothScroll(anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
}
