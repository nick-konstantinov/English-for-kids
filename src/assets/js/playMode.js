import { createElem } from "./helpers";

// Function change styles word cards depending on mode
export function changeStylesWordCardsDependingOnMode(isTrainMode, switchBtn) {
    const cardTitles = document.querySelectorAll('.card__word-title');
    const cardRotateBtns = document.querySelectorAll('.card__rotate-btn');
    const cardImages = document.querySelectorAll('.card__word-img');

    if (switchBtn.checked) {
      isTrainMode = false;

      changeDisplay(cardTitles, 'none');
      changeDisplay(cardRotateBtns, 'none');
      changeHeight(cardImages, 100, '%');
    } else {
      isTrainMode = true;

      changeDisplay(cardTitles, 'block');
      changeDisplay(cardRotateBtns, 'block');
      changeHeight(cardImages, 130, 'px');
    }

    return isTrainMode;
}

function changeDisplay(nodeCollection, display) {
    nodeCollection.forEach((item) => {
        item.style.display = display;
    });
}

function changeHeight(nodeCollection, value, unit) {
    nodeCollection.forEach((item) => {
        item.style.height = value + unit;
    });
}

// Function change styles play button depending on mode
export function changeStylesPlayBtnDependingOnMode(switchBtn, playBtn) {
    if (switchBtn.checked) {
      playBtn.style.display = 'inline-block';
      correctPositionPlayBtn(switchBtn, playBtn);
    } else {
      playBtn.style.display = 'none';
    }
}

  // Function correct position play button
export function correctPositionPlayBtn(switchBtn, playBtn) {
    if (switchBtn.checked) {
      const widthScreen = document.documentElement.scrollWidth;
      const playBtnWidth = playBtn.offsetWidth;

      if (widthScreen < 464) {
        playBtn.style.top = 13 + 'rem';
      } else {
        playBtn.style.top = 10.5 + 'rem';
      }

      playBtn.style.left = widthScreen / 2 - playBtnWidth /2 + 'px';
    }
}

// Function change styles play button to repeat button when click
export function changeStylesPlayBtnToRepeatBtn(playBtn) {
    if (!playBtn.classList.contains('play__btn_repeat')) {
      const repeatImg = createElem(playBtn, 'img', '', 'play__btn-img_repeat');
      repeatImg.src = 'img/repeat.svg';
      repeatImg.alt = 'repeat word';

      playBtn.classList.add('hover');
      playBtn.classList.add('play__btn_repeat');
    }
}

  // Function set play button to default styles
export function setPlayBtnDefaultStyles(switchBtn, playBtn) {
    if (switchBtn.checked) {
      const repeatImg = document.querySelector('.play__btn-img_repeat');
      if (repeatImg) {
        playBtn.removeChild(repeatImg);
      }

      playBtn.classList.remove('play__btn_repeat');
      playBtn.classList.remove('hover');
    }
}