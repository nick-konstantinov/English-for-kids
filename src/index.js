import './style.css';
import cards from './assets/js/cards';
import Card from './assets/module/Card';
import CardWord from './assets/module/CardWord';
import { createElem } from './assets/js/helpers';
import { getCoords } from './assets/js/helpers';

// Global variable name mode
let isTrainMode = true;

// ----- Burger-menu -----
const { body } = document;

// Create mask & add to page
const mask= createElem(body, 'div', '', 'mask');
mask.hidden = true;

// Create burger-menu & add to page
const burgerMenu = createElem(body, 'nav', '', 'burger-menu');
const burgerInner = createElem(burgerMenu, 'ul', '', '');

const burgerItem = createElem(burgerInner, 'li', '', '');
const mainPageImg = createElem(burgerItem, 'object', '', 'burger-menu__main-img');
mainPageImg.type = 'image/svg+xml';
mainPageImg.data = 'img/home.svg';

const mainPageLink = createElem(burgerItem, 'a', 'Main page', 'burger-menu__main-link');
mainPageLink.setAttribute('href', '#');
mainPageLink.classList.add('burger__link_active')
mainPageLink.dataset.category = 'Main page';

burgerItem.append(mainPageLink);
burgerInner.append(burgerItem);

// Get categories name
const categoriesName = cards[0];

categoriesName.forEach((category) => {
  const burgerItem = createElem(burgerInner, 'li', '', '');
  const burgerLink = createElem(burgerItem, 'a', category, '');
  burgerLink.setAttribute('href', '#');
  burgerLink.dataset.category = category;

  burgerInner.append(burgerItem);
});

// Burger-menu positioning
const burgerBtn = document.querySelector('#burger-btn');
let coordsBurgerBtn = getCoords(burgerBtn);
burgerMenu.style.left = `${coordsBurgerBtn.left - 20}px`;

// Add listener for window to correct position burger-menu & play button
window.addEventListener('resize', () => {
  coordsBurgerBtn = getCoords(burgerBtn);
  burgerMenu.style.left = `${coordsBurgerBtn.left - 20}px`;

  correctPositionPlayBtn();
});

// Function open&close burger-menu
function openCloseBurgerMenu() {
  burgerBtn.classList.toggle('burger-btn_active');
  burgerMenu.classList.toggle('burger-menu_open');
  body.classList.toggle('noscroll');
  mask.hidden = !mask.hidden;
}

// Add listener for burger button to open&close burger-menu
burgerBtn.addEventListener('click', () => {
  openCloseBurgerMenu();
  correctPositionPlayBtn();
});

// Global variable current active link
let previousActiveLink = document.querySelector('.burger__link_active');

// Function remove active style svg
function removeActiveStyleSvg() {
  const svg = document.querySelector('.burger-menu__main-img').contentDocument.documentElement;
  const homeImg = svg.querySelector('#homeImg');

  previousActiveLink.classList.remove('burger__link_active');
  homeImg.style.strokeWidth = 1 + 'px';
}

// Create play button
const playBtn = createElem(body, 'button', 'Start', 'play__btn');

// Add listener for burger-menu to open selected category
burgerInner.addEventListener('click', function(event) {
  const link = event.target.closest('a');

  if (!link) return;

  if (link.classList.contains('burger-menu__main-link')) {
    location.reload();
    return;
  }

  if (playListCards) {
    gameIsOver('lose');
    openCloseBurgerMenu();
  } else {
    removeActiveStyleSvg();

  const linkDataCategory = link.dataset.category;

  cardsInner.replaceChildren();
  addWordCards(linkDataCategory);
  currentCategory = linkDataCategory;

  link.classList.add('burger__link_active');
  previousActiveLink = link;
  openCloseBurgerMenu();

  managePlayMode();

  setPlayBtnDefaultStyles();
  correctPositionPlayBtn();
  }
});

// Add listener for mask to close burger-menu
mask.addEventListener('click', () => {
  openCloseBurgerMenu();
});

// Add listener for logo if push reload page
const logo = document.querySelector('.header__logo');

logo.addEventListener('click', () => {
  location.reload();
});

// ----- Categories -----

let currentCategory = null;

// Set categories name & image source
const categoriesInfo = [];

for (let i = 0; i < cards.length - 1; i++) {
  const categoriesObj = {};
  categoriesObj.title = categoriesName[i];
  categoriesObj.srcImg = cards[i + 1][0].image;
  categoriesObj.altText = categoriesName[i].toLowerCase();

  categoriesInfo.push(categoriesObj);
}

// Add categories cards to page
const cardsInner = document.querySelector('.cards');

categoriesInfo.forEach((item) => {
  const cardCategories = new Card('cardCategories', 'card');
  const cardCategoriesSrc = item.srcImg;
  const cardCategoriesAlt = item.altText;
  const cardCategoriesTitle = item.title;

  cardsInner.append(cardCategories.createCard(cardCategoriesSrc, cardCategoriesAlt, 'card__img', cardCategoriesTitle, 'card__title'));
});

// ----- Words -----

// Function add word cards
function addWordCards(key) {
  const cardsInner = document.querySelector('.cards');

  wordCollection.get(key).forEach((item) => {
    const wordCard = new CardWord('cardWord', 'card__word');
    const cardWordSrc = item.image;
    const cardWordAlt = item.word;
    const cardWordFrontTitle = item.word;
    const cardWordBackTitle = item.translation;

    cardsInner.append(wordCard.createCard(cardWordSrc, cardWordAlt, 'card__word-img', 'card__word-title', cardWordFrontTitle, cardWordBackTitle, 'card__front', 'card__back'));
  });
}

// Create & set word collection
const wordCollection = new Map();

for (let i = 0; i < cards.length - 1; i++) {
  wordCollection.set(cards[0][i], cards[i + 1]);
}

// Add listener for cards when happened 'click' on categories card
// Do:
// Remove categories cards
// Add word cards to page
// Remove active style home svg
// Change active link into burher-menu
// Add play button
// Change style depending on mode
cardsInner.addEventListener('click', function(event) {
  const card = event.target.closest('.card');

  if (!card) return;

  cardsInner.replaceChildren();
  addWordCards(card.dataset.name);
  currentCategory = card.dataset.name;

  removeActiveStyleSvg();
  const currentLink = document.querySelector('[data-category="'+currentCategory+'"]');
  currentLink.classList.add('burger__link_active');
  previousActiveLink = currentLink;

  managePlayMode();
});

// Add listener for rotate button to rotate word card
cardsInner.addEventListener('click', function(event) {
  const rotateBtn = event.target.closest('.card__rotate-btn');
  const cardWord = event.target.closest('.card__word');

  if(!rotateBtn) return;

  const cardFront = event.target.closest('.card__front');
  const cardBack = cardWord.querySelector('.card__back');

  cardFront.style.transform = 'rotateY(180deg)';
  cardBack.style.transform = 'rotateY(360deg)';

  cardWord.style.cursor = 'default';

  cardWord.addEventListener('mouseleave', () => {
    cardFront.style.transform = 'rotateY(0deg)';
    cardBack.style.transform = 'rotateY(180deg)';

    cardWord.style.cursor = 'pointer';
  });
});

// Add listener for word card to play audio
cardsInner.addEventListener('click', function(event) {
  const cardFront = event.target.closest('.card__front');
  const cardWord = event.target.closest('.card__word');
  const rotateBtn = event.target.closest('.card__rotate-btn');

  if (!cardFront || rotateBtn || !isTrainMode) return;

  wordCollection.get(currentCategory).forEach((item) => {
    if(item.word === cardWord.dataset.name) {
      const audio = new Audio(item.audioSrc);
      audio.play();
    }
  });
});

// ----- Play mode -----

// Global variable switch button
const switchBtn = document.querySelector('.switch-btn input');

// Function change styles word cards depending on mode
function changeStylesWordCardsDependingOnMode() {
  const cardTitles = document.querySelectorAll('.card__word-title');
  const cardRotateBtns = document.querySelectorAll('.card__rotate-btn');
  const cardImages = document.querySelectorAll('.card__word-img');

  if (switchBtn.checked) {
    isTrainMode = false;

    cardTitles.forEach((item) => {
      item.style.display = 'none';
    });

    cardRotateBtns.forEach((item) => {
      item.style.display = 'none';
    });

    cardImages.forEach((item) => {
      item.style.height = 100 + '%';
    });

  } else {
    isTrainMode = true;

    cardTitles.forEach((item) => {
      item.style.display = 'block';
    });

    cardRotateBtns.forEach((item) => {
      item.style.display = 'block';
    });

    cardImages.forEach((item) => {
      item.style.height = 130 + 'px';
    });

  }
}

// Function change styles play button depending on mode
function changeStylesPlayBtnDependingOnMode() {
  if (switchBtn.checked) {
    playBtn.style.display = 'inline-block';
    correctPositionPlayBtn();
  } else {
    playBtn.style.display = 'none';
  }
}

// Function correct position play button
function correctPositionPlayBtn() {
  if (switchBtn.checked) {
    const widthScreen = document.documentElement.scrollWidth;
    const playBtnWidth = playBtn.offsetWidth;

    playBtn.style.top = 10 + 'rem';
    playBtn.style.left = widthScreen / 2 - playBtnWidth /2 + 'px';
  }

}

// Function change styles play button to repeat button when click
function changeStylesPlayBtnToRepeatBtn() {
  if (!playBtn.classList.contains('play__btn_repeat')) {
    const repeatImg = createElem(playBtn, 'img', '', 'play__btn-img_repeat');
    repeatImg.src = 'img/repeat.svg';
    repeatImg.alt = 'repeat word';

    playBtn.classList.add('hover');
    playBtn.classList.add('play__btn_repeat');
  }
}

// Function set play button to default styles
function setPlayBtnDefaultStyles() {
  if (switchBtn.checked) {
    const repeatImg = document.querySelector('.play__btn-img_repeat');
    if (repeatImg) {
      playBtn.removeChild(repeatImg);
    }

    playBtn.classList.remove('play__btn_repeat');
    playBtn.classList.remove('hover');
  }
}


// Function manage play mode
function managePlayMode() {
  changeStylesWordCardsDependingOnMode();
  changeStylesPlayBtnDependingOnMode();

  playBtn.addEventListener('click', () => {
    changeStylesPlayBtnToRepeatBtn();
    correctPositionPlayBtn();

    playCurrentWordAudio();
  });
}

// Add listener for switch mode to change mode
switchBtn.addEventListener('change', () => {

  if (cardsInner.children[0].classList.contains('card')) return;

  managePlayMode();
  setPlayBtnDefaultStyles();
  correctPositionPlayBtn();

  if (playListCards) {
    gameIsOver('lose');
  }
});

let playListCards = null;
let currentPlayCardIndex = 0;
let errorsCount = 0;

// Function for reset global variable's property in play mode
function resetGlobalPropertyForPlayMode() {
  playListCards = null;
  currentPlayCardIndex = 0;
  errorsCount = 0;
}

// Function rotate play repeat button in click at play button
function rotateRepeatBtn() {
  const playBtnImg = document.querySelector('.play__btn-img_repeat');
  let current = getComputedStyle(playBtnImg).transform;
  if (current == 'none') current = '';
  playBtnImg.style.transform = current + 'rotate(270deg)';
}

// Function play current word audio
function playCurrentWordAudio() {
  const currentPlayCard = playListCards[currentPlayCardIndex];
  const audio = new Audio(currentPlayCard.audioSrc);
  audio.play();
}

// Function add to page stars & play audio
function createStars(result, starBox, audio) {
  const star = createElem(starBox, 'img', '', 'play__star-img');

  if (result === 'correct') {
    star.src = 'img/star-win.svg';
    star.alt = 'star win';

    audio.src = 'audio/correct.mp3';
  } else {
    star.src = 'img/star.svg';
    star.alt = 'star lose';

    audio.src = 'audio/error.mp3';
  }

  audio.play();

  if (starBox.scrollHeight > starBox.offsetHeight) {
    starBox.removeChild(starBox.childNodes[0]);
  }
}

// Function game is over
function gameIsOver(result) {
  cardsInner.replaceChildren();
  cardsInner.style.flexDirection = 'column';
  playBtn.remove();

  const audio = new Audio;
  const gameImg = createElem(cardsInner, 'img', '', 'play__img');
  const gameText = createElem(cardsInner, 'h3', `Number of mistakes: ${errorsCount}`, 'play__losing-count');

  if (result === 'lose') {
    audio.src = 'audio/failure.mp3';
    audio.play();

    gameText.innerHTML = `Number of mistakes: ${errorsCount}`;

    gameImg.src = 'img/sad.gif';
    gameImg.alt = 'you lose';
  } else {
    audio.src = 'audio/success.mp3';
    audio.play();

    gameText.innerHTML = `Great job!`;

    gameImg.src = 'img/win.gif';
    gameImg.alt = 'you win';
  }

  resetGlobalPropertyForPlayMode();

  setTimeout(() => {
    location.reload();
  }, 4000);
}

// Add listener for play button to start game
playBtn.addEventListener('click', () => {
  if (!playListCards) {
    playListCards = wordCollection.get(currentCategory).sort(() => Math.random() - 0.5);
  }
  let currentPlayCard = playListCards[currentPlayCardIndex];
  let audio = new Audio(currentPlayCard.audioSrc);

  const starBox = createElem(cardsInner, 'div', '', 'play__star-box');

  cardsInner.addEventListener('click', function(event) {
    const cardWord = event.target.closest('.card__word');

    if (!cardWord) return;

    if (cardWord.dataset.name === currentPlayCard.word) {
      createStars('correct', starBox, audio);

      cardWord.style.opacity = 0.5;
      cardWord.style.pointerEvents = 'none';

      currentPlayCardIndex++;

      if (currentPlayCardIndex === playListCards.length) {
        // If there are errors
        if (errorsCount) {
          gameIsOver('lose');
        } else {
          gameIsOver('win');
        }
      } else {
        setTimeout(() => {
          currentPlayCard = playListCards[currentPlayCardIndex];
          audio = new Audio(currentPlayCard.audioSrc);
          audio.play();
        }, 1000);
      }

    } else {
      createStars('incorrect', starBox, audio);

      errorsCount++;
    }
  });
}, {once: true});
