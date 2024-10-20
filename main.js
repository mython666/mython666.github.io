/*const aliceTumbling = [
    { transform: 'rotate(0) scale(1)' },
    { transform: 'rotate(360deg) scale(0)' }
  ];
  
  const aliceTiming = {
    duration: 2000,
    iterations: 1,
    fill: 'forwards'
  }
  
  const alice1 = document.querySelector("#alice1");
  const alice2 = document.querySelector("#alice2");
  const alice3 = document.querySelector("#alice3");
  
  alice1.animate(aliceTumbling, aliceTiming).finished
    .then(() => alice2.animate(aliceTumbling, aliceTiming).finished)
    .then(() => alice3.animate(aliceTumbling, aliceTiming).finished)
    .catch(error => console.error(`Error animating Alices: ${error}`));*/



    const aliceTumbling = [
      { transform: 'rotate(0) scale(1)', backgroundColor: '' },
      { transform: 'rotate(360deg) scale(0)', backgroundColor: '' }
  ];
  
  const aliceTiming = {
      duration: 2000,
      iterations: 1,
      fill: 'forwards'
  };
  
  const aliceElements = ['alice1', 'alice2', 'alice3'];
  
  function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
  
  function animateSequence(elements) {
      let currentElementIndex = 0;
  
      function nextElement() {
          if (currentElementIndex >= elements.length) {
              return;
          }
  
          const elementId = elements[currentElementIndex];
          const element = document.getElementById(elementId);
  
          const randomColor = getRandomColor();
  
          const animationFrames = [
              { transform: 'rotate(0) scale(1)', backgroundColor: element.style.backgroundColor },
              { transform: 'rotate(360deg) scale(0)', backgroundColor: randomColor }
          ];
  
          element.animate(animationFrames, aliceTiming).finished
              .then(() => {
                  currentElementIndex++;
                  nextElement();
              })
              .catch(error => console.error(`Error animating ${elementId}: ${error}`));
      }
  
      nextElement();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
      animateSequence(aliceElements);
  });