import './style.css';
import cards from './assets/js/cards';
import Card from './assets/modules/Card';
import CardWord from './assets/modules/CardWord';
import WordStatistics from './assets/modules/WordStatistics';
import { createElem } from './assets/js/helpers';
import { getCoords } from './assets/js/helpers';


// Create & set word collection
const wordCollection = new Map();

for (let i = 0; i < cards.length - 1; i++) {
  wordCollection.set(cards[0][i], cards[i + 1]);
}

// ----- Statistics -----

// Fill statistics map
let wordStatisticsMap = new Map();
if (!sessionStorage.getItem('stat')) {

  // console.log(wordStatisticsMap.size);

  if (wordStatisticsMap.size == 0) {
    // wordStatisticsMap = new Map();
    for (let entry of wordCollection) {
      for(let card of entry[1]) {
        const wordStatistics = new WordStatistics(card.word, entry[0], card.translation);
        wordStatisticsMap.set(card.word + '_' + entry[0], wordStatistics);
      }
    }
  }
} else {
  getStatisticsInfoFromStorage();
}

// Global variable name mode & current category
let isTrainMode = true;
let isRepeatMode = false;
let currentCategory = null;

// ----- Burger-menu -----
const { body } = document;

// Create play button
let playBtn = createElem(body, 'button', 'Start', 'play__btn');

// Create mask & add to page
const mask= createElem(body, 'div', '', 'mask');
mask.hidden = true;

// Add listener for mask to close burger-menu
mask.addEventListener('click', () => {
  openCloseBurgerMenu();
});

// Add listener for logo if push reload page
const logo = document.querySelector('.header__logo');

logo.addEventListener('click', () => {
  location.reload();
});

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

// Add Statistics link
const burgerItemLi = createElem(burgerInner, 'li', '', '');
const statPageLink = createElem(burgerItemLi, 'a', 'Statistics', 'stat__link');
statPageLink.setAttribute('href', '#');
statPageLink.dataset.category = 'Statistics';

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

// Add listener for burger-menu to open selected category
burgerInner.addEventListener('click', function(event) {
  const link = event.target.closest('a');

  if (!link || link.classList.contains('stat__link')) return;

  if (link.classList.contains('burger-menu__main-link')) {
    location.reload();
    return;
  }

  if (playListCards) {
    gameIsOver('lose');
    openCloseBurgerMenu();
  } else {
    if (currentCategory === 'Statistics') {
      cardsInner.style.marginTop = 10 + 'rem';
    }

    if (isRepeatMode) {
      isRepeatMode = false;
      wordCollectionForRepeat = [];
      cardsInner.removeEventListener('click', handlerRepeatWords);
      cardsInner.style.flexDirection = 'row';

      const headerSwitch = document.querySelector('.header__switch');
      headerSwitch.style.opacity = 1;
      headerSwitch.style.zIndex = 1;
    }

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

// Function get statistics info from session storage
function getStatisticsInfoFromStorage() {
  if (sessionStorage.getItem('stat')) {
    const statMapFromStorage = new Map(JSON.parse(sessionStorage.getItem('stat')));
    const wordStatMapFromStorage = new Map();

    for (let entry of statMapFromStorage) {
      const card = entry[1];
      const wordStatistics = new WordStatistics(card._name, card._category, card._translation, card._trainCount, card._playCount, card._errorCount, card._percent);

      wordStatMapFromStorage.set(card._name + '_' + card._category, wordStatistics);
    }
    wordStatisticsMap = wordStatMapFromStorage;
  }
}

// Global variable sorting state
let categorySortDesc = false;
let wordSortDesc = false;
let translationSortDesc = false;
let clickSortDesc = false;
let correctSortDesc = false;
let wrongSortDesc = false;
let percentSortDesc = false;

// Function create statistics table
function createStatisticsTable() {
  const statTable = createElem(cardsInner, 'table', '', 'stat__table');
  const statTableBody = createElem(statTable, 'tbody', '', '');

  createTableHeaderTitles(statTableBody);
  fillStatisticsTable(statTableBody);

  // Add listener for table header titles to sorting
  const statHeaders = document.querySelector('.stat__headers');

  statHeaders.addEventListener('click', function(event) {
    const title = event.target.closest('.stat__th');

    if (!title) return;

    switch (title.dataset.headersTitle) {

      case 'Category':
        categorySortDesc = !categorySortDesc;

        if (categorySortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (a[1].category > b[1].category ? 1 : -1)));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (b[1].category > a[1].category ? 1 : -1)));
        }
      break;

      case 'Word':
        wordSortDesc = !wordSortDesc;

        if (wordSortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (a[1].name > b[1].name ? 1 : -1)));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (b[1].name > a[1].name ? 1 : -1)));
        }
      break;

      case 'Translation':
        translationSortDesc = !translationSortDesc;

        if (translationSortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (a[1].translation > b[1].translation ? 1 : -1)));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (b[1].translation > a[1].translation ? 1 : -1)));
        }
      break;

      case 'Clicks':
        clickSortDesc = !clickSortDesc;

        if (clickSortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].trainCount - b[1].trainCount));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].trainCount - a[1].trainCount));
        }
      break;

      case 'Correct':
        correctSortDesc = !correctSortDesc;

        if (correctSortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].playCount - b[1].playCount));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].playCount - a[1].playCount));
        }
      break;

      case 'Wrong':
        wrongSortDesc = !wrongSortDesc;

        if (wrongSortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].errorCount - b[1].errorCount));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].errorCount - a[1].errorCount));
        }
      break;

      case '% Correct':
        percentSortDesc = !percentSortDesc;

        if (percentSortDesc) {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].percent - b[1].percent));
        } else {
          wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].percent - a[1].percent));
        }
      break;
    }

    for (let i = 1; i < statTable.rows.length;) {
      statTable.deleteRow(i);
    }

    fillStatisticsTable(statTableBody);

  });
}

// Function create headers title table
function createTableHeaderTitles(statTableBody) {
  const statTableTr = createElem(statTableBody, 'tr', '', 'stat__headers');
  const thTitles = ['№', 'Category', 'Word', 'Translation', 'Clicks', 'Correct', 'Wrong', '% Correct'];
  thTitles.forEach((item) => {
    if (item === '№') {
      createElem(statTableTr, 'th', item, '');
    } else if (item === 'Category' || item === 'Word' || item === 'Translation') {
      const statTableTh = createElem(statTableTr, 'th', item, 'stat__th');
      statTableTh.dataset.headersTitle = item;
      const statTableThIco = createElem(statTableTh, 'img', '', 'stat__th-img');
      statTableThIco.src = 'img/sort-icon.svg';
      statTableThIco.alt = 'sort';
    } else {
      const statTableTh = createElem(statTableTr, 'th', item, ['stat__th', 'stat__th_num']);
      statTableTh.dataset.headersTitle = item;
      const statTableThIco = createElem(statTableTh, 'img', '', 'stat__th-img');
      statTableThIco.src = 'img/sort-icon.svg';
      statTableThIco.alt = 'sort';
    }
  });
}

// Function fill statistics table
function fillStatisticsTable(statTableBody) {
  let numberingCount = 0;

  for (let entry of wordStatisticsMap) {
    const statTableTr = createElem(statTableBody, 'tr', '', '');
    const wordObj = entry[1];

    createElem(statTableTr, 'td', ++numberingCount, ['stat__td', 'stat__td_center']);
    createElem(statTableTr, 'td', wordObj.category, 'stat__td');
    createElem(statTableTr, 'td', wordObj.name, 'stat__td');
    createElem(statTableTr, 'td', wordObj.translation, 'stat__td');
    createElem(statTableTr, 'td', wordObj.trainCount, ['stat__td', 'stat__td_center']);
    createElem(statTableTr, 'td', wordObj.playCount, ['stat__td', 'stat__td_center']);
    createElem(statTableTr, 'td', wordObj.errorCount, ['stat__td', 'stat__td_center']);
    createElem(statTableTr, 'td', wordObj.percent, ['stat__td', 'stat__td_center']);
  }
}

// Function create statistics buttons
function createStatisticsBtns() {
  const statBtnsInner = createElem(cardsInner, 'div', '', 'stat__btn-inner');
  createElem(statBtnsInner, 'button', 'Train difficult', ['stat__btn', 'stat__btn_train']);
  createElem(statBtnsInner, 'button', 'Reset statistics', ['stat__btn', 'stat__btn_reset']);
}

// Global variable for the collection of words to repeat
let wordCollectionForRepeat = [];

// Add listener for statistics link to open statistics page
statPageLink.addEventListener('click', () => {
  if (playListCards) {
    gameIsOver('lose');
    openCloseBurgerMenu();
  } else {
    currentCategory = statPageLink.dataset.category;

    sessionStorage.setItem('stat', JSON.stringify(Array.from(wordStatisticsMap.entries())));
    getStatisticsInfoFromStorage();
    cardsInner.replaceChildren();
    cardsInner.style.marginTop = 3 + 'rem';
    createStatisticsBtns();
    createStatisticsTable();

    openCloseBurgerMenu();

    // Add listener for statistics train button to train difficult words
    const statTrainBtn = document.querySelector('.stat__btn_train');

    statTrainBtn.addEventListener('click', () => {
      isRepeatMode = true;

      const sortedPercentMap = new Map([...wordStatisticsMap]
        .sort((a, b) => a[1].percent - b[1].percent)
        .filter( item => (item[1].percent != 0 && item[1].percent != 100)
          || (item[1].percent === 0 && item[1].errorCount > 0)))
      ;

      let countWords = 0;
      for (let obj of sortedPercentMap.values()) {
        if (countWords < 8) {
          let cardForRepeat = findCardByWordName(obj.name);
          wordCollectionForRepeat.push(cardForRepeat);
          countWords++;
        }
      }

      if (wordCollectionForRepeat.length != 0) {
        const headerSwitch = document.querySelector('.header__switch');
        headerSwitch.style.opacity = 0;
        headerSwitch.style.zIndex = -1;
        cardsInner.replaceChildren();


        wordCollectionForRepeat.forEach((item) => {
          const wordCard = new CardWord('cardWord', 'card__word');
          const cardWordSrc = item.image;
          const cardWordAlt = item.word;
          const cardWordFrontTitle = item.word;
          const cardWordBackTitle = item.translation;

          cardsInner.append(wordCard.createCard(cardWordSrc, cardWordAlt, 'card__word-img', 'card__word-title', cardWordFrontTitle, cardWordBackTitle, 'card__front', 'card__back'));
        });

        cardsInner.addEventListener('click', handlerRepeatWords);
      } else {
        cardsInner.replaceChildren();
        cardsInner.style.flexDirection = 'column';
        cardsInner.style.marginTop = 10 + 'rem';

        const headerSwitch = document.querySelector('.header__switch');
        headerSwitch.style.opacity = 0;
        headerSwitch.style.zIndex = -1;

        const statImg = createElem(cardsInner, 'img', '', 'stat__img');
        statImg.src = 'img/win.gif';
        statImg.alt = 'nothing to repeat';
        createElem(cardsInner, 'h3', 'Nothing to repeat!', 'stat__nothing');

        const audio = new Audio;
        audio.src = 'audio/success.mp3';
        audio.play();

        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    });

    // Add listener for statistics reset button to reset statistics
    const statResetBtn = document.querySelector('.stat__btn_reset');

    statResetBtn.addEventListener('click', () => {
      sessionStorage.clear();

      wordStatisticsMap = new Map();
      for (let entry of wordCollection) {
        for(let card of entry[1]) {
          const wordStatistics = new WordStatistics(card.word, entry[0], card.translation);
          wordStatisticsMap.set(card.word + '_' + entry[0], wordStatistics);
        }
      }

      const statTable = document.querySelector('table');
      const statTableBody = document.querySelector('tbody');

      for (let i = 1; i < statTable.rows.length;) {
        statTable.deleteRow(i);
      }

      fillStatisticsTable(statTableBody);
    });
  }
});

function handlerRepeatWords(event) {
  const cardFront = event.target.closest('.card__front');
  const cardWord = event.target.closest('.card__word');
  const rotateBtn = event.target.closest('.card__rotate-btn');

  if (!cardFront || rotateBtn || !isTrainMode || !isRepeatMode) return;

  if (cardWord) {
    wordCollectionForRepeat.forEach((item) => {
      if(item.word === cardWord.dataset.name) {
        const audio = new Audio(item.audioSrc);
        audio.play();

        // console.log(wordStatisticsMap);
        // console.log(wordCollectionForRepeat);
        // wordStatisticsMap.get(item.word + '_' + currentCategory).addTrainCount();
      }
    });
  }
}

// Function find card by word name
function findCardByWordName(name) {
  return Array.from(wordCollection.values()).flat().find(item => item.word === name);
}

// ----- Categories -----

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

  if (!cardFront || rotateBtn || !isTrainMode || isRepeatMode) return;

  wordCollection.get(currentCategory).forEach((item) => {
    if(item.word === cardWord.dataset.name) {
      const audio = new Audio(item.audioSrc);
      audio.play();

      wordStatisticsMap.get(item.word + '_' + currentCategory).addTrainCount();
    }
  });
});



// cardsInner.addEventListener('click', function(event) {
//   const cardFront = event.target.closest('.card__front');
//   const cardWord = event.target.closest('.card__word');

//   if (!isRepeatMode || document.querySelector('table')) return;

//   // console.log(wordCollectionForRepeat);

//   wordCollectionForRepeat.forEach((item) => {
//     if(item.word === cardWord.dataset.name) {
//       const audio = new Audio(item.audioSrc);
//       audio.play();

//       // console.log(11111111111111111111111111);s

//       wordStatisticsMap.get(item.word + '_' + currentCategory).addTrainCount();
//     }
//   });


//   //Array.from(wordCollection.values()).flat().find(item => item.word === name);
// });

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
    // console.log(1);
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

  if (cardsInner.children[0].classList.contains('card') || currentCategory === 'Statistics') return;

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
  const gameText = createElem(cardsInner, 'h3', '', 'play__losing-count');

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

    let currentWordStatistics = wordStatisticsMap.get(currentPlayCard.word + '_' + currentCategory);

    if (cardWord.dataset.name === currentPlayCard.word) {
      createStars('correct', starBox, audio);

      currentWordStatistics.addPlayCount();

      // console.log(currentWordStatistics);

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
        currentPlayCard = playListCards[currentPlayCardIndex];
        setTimeout(() => {
          audio = new Audio(currentPlayCard.audioSrc);
          audio.play();
        }, 1000);
      }

    } else {
      createStars('incorrect', starBox, audio);

      currentWordStatistics.addErrorCount();

      // console.log(currentWordStatistics);

      errorsCount++;
    }
  });
}, {once: true});

// Add listener for window to set word's statistics in session storage
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('stat', JSON.stringify(Array.from(wordStatisticsMap.entries())));
});
