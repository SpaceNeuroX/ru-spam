hljs.highlightAll();

function toggleCode(id) {
  const codeBlock = document.getElementById(id);
  codeBlock.classList.toggle('open');
}

particlesJS('particles-js-left', {
  particles: {
    number: {
      value: 100
    },
    size: {
      value: 3
    },
    move: {
      speed: 1
    },
    opacity: {
      value: 0.5
    }
  }
});

particlesJS('particles-js-right', {
  particles: {
    number: {
      value: 50
    },
    size: {
      value: 2
    },
    move: {
      speed: 1
    },
    opacity: {
      value: 0.3
    }
  }
});

