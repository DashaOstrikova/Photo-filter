const inputs = document.querySelectorAll('.filters input');

function handleUpdate(event) {
  const { currentTarget } = event;

  const suffix = this.dataset.sizing;
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);

  const outputs = document.getElementsByTagName('output');
  for (let index = 0; index < outputs.length; index++) {
    const output = outputs.item(index);
    if(output.matches(`input[name=${currentTarget.name}] + output`)) {
      output.value = this.value;
      break;
    }
  }

  drawImage();
}
  

  const base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
  const partDay = ['morning/', 'day/', 'evening/', 'night/'];
  const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
  let i = 0;
  let part = '';
  const img = document.querySelector('img');
  const btnNext = document.querySelector('.btn-next');

  function viewImage(src) {  
    const hideImg = new Image();
    hideImg.src = src;
    hideImg.onload = () => {      
      img.src = src;
      fileInput.value = null;
      drawImage();
    }; 
  }

  function getImage() {
    let now = new Date();
    let hour = now.getHours();
    if( hour >= 0 && hour < 6) {
      part = partDay[3];
    } else if( hour >= 6 && hour < 12) {
      part = partDay[0];
    } else if( hour >= 12 && hour < 18) {
      part = partDay[1];
    } else {
      part= partDay[2];
    }
    const index = i % images.length;
    const imageSrc = base + part + images[index];
    viewImage(imageSrc);
    i++;
    btnNext.disabled = true;
    setTimeout(function() { 
      btnNext.disabled = false;
      
     }, 1000);
  }


  const fileInput = document.getElementById('btnInput');
  const image = document.querySelector('img');

  function loadImage(event) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result;
      setTimeout(drawImage, 0);
    }
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', loadImage);


  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;

  function getFilter(sizeDifference) {
    let filter = '';
    const propLength = document.documentElement.style.length;
    for (let i = 0; i < propLength; i++) {
      const prop = document.documentElement.style[i];
      let value = document.documentElement.style.getPropertyValue(prop);
      
      const propName = prop.replace('--','');
      if (propName === 'blur') {
        value = Number(value.replace('px', '')) * sizeDifference + 'px';
      }
      filter = !filter.length ? `${propName}(${value})` : `${filter} ${propName}(${value})`;
    }
    return filter;
  }

  function drawImage() { 
    const {width, height, naturalWidth, naturalHeight} = img;

    const sizeDifference = naturalHeight / height;
    const hideImg = new Image();
    hideImg.setAttribute('crossOrigin', 'anonymous');
    hideImg.src = img.src;

    const filter = getFilter(sizeDifference);
    
    hideImg.onload = () => {
      canvas.width = naturalWidth;
      canvas.height = naturalHeight;
      ctx.filter = filter;
      ctx.drawImage(hideImg, 0, 0,);
    }
  }


  function addButtonActive(event) {
    const btn = document.querySelector('.btn-active');
    btn.classList.remove('btn-active');
    event.target.classList.add('btn-active');
    performButton(event);
  }

  function performButton(event) {
    if (event.target.classList.contains('btn-reset')) {
      const labels = document.querySelectorAll('.filters label');
      for (let index = 0; index < labels.length; index++) {
        const label = labels.item(index);
        const input = label.querySelector('input');
        const output = label.querySelector('output');
        input.value = input.dataset.default;
        output.value = input.dataset.default;
        document.documentElement.style.setProperty(`--${input.name}`, input.dataset.default + input.dataset.sizing);
      }
      drawImage();
    }
    if (event.target.classList.contains('btn-next')) {
      getImage();
    }
    if (event.target.classList.contains('btn-save')) {
      const link = document.createElement('a');
      link.download = 'download.png';
      link.href = canvas.toDataURL();
      link.click();
      link.delete;
    }
  }


  inputs.forEach(input => input.addEventListener('input',handleUpdate));

  const btnContainer = document.querySelector('.btn-container');
  btnContainer.addEventListener('click', addButtonActive);


  document.querySelector('.fullscreen').addEventListener('click', toggleFullScreen);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
    }
  }

  window.addEventListener('resize', drawImage);

  drawImage();