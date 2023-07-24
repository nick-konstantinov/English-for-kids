import './style.css';
import cards from './assets/js/cards';
import Card from './assets/modules/Card';
import CardWord from './assets/modules/CardWord';
import WordStatistics from './assets/modules/WordStatistics';
import { createElem } from './assets/js/helpers';
import { getStatisticsInfoFromStorage, setStatisticsInfoToStorage } from './assets/js/sessionStorageHelper';
import { createMainLink, createCategoriesLinks, createStatLink, correctPositionBurgerMenu } from './assets/js/burgerMenu';
import { sortByCategory, sortByWordName, sortByErrorCount, sortByPercent, sortByPlayCount, sortByTrainCount, sortByTranslation, filterZeroAndHundredAndPercentSort } from './assets/js/statisticSort';
import { createTableHeaderTitles, fillStatisticsTable, createStatisticsBtns } from './assets/js/statTable';
import { changeStylesWordCardsDependingOnMode, changeStylesPlayBtnDependingOnMode, correctPositionPlayBtn, changeStylesPlayBtnToRepeatBtn, setPlayBtnDefaultStyles } from './assets/js/playMode';

// Create & set word collection
const wordCollection = new Map();

for (let i = 0; i < cards.length - 1; i++) {
  wordCollection.set(cards[0][i], cards[i + 1]);
}

// ----- Statistics -----

// Fill statistics map
let wordStatisticsMap = new Map();
if (!sessionStorage.getItem('stat')) {

  if (wordStatisticsMap.size == 0) {
    for (let entry of wordCollection) {
      for(let card of entry[1]) {
        const wordStatistics = new WordStatistics(card.word, entry[0], card.translation);
        wordStatisticsMap.set(card.word + '_' + entry[0], wordStatistics);
      }
    }
  }
} else {
  wordStatisticsMap = getStatisticsInfoFromStorage();
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

// Get categories name
const categoriesName = cards[0];
createMainLink(burgerItem);
createCategoriesLinks(categoriesName, burgerInner);
const statPageLink = createStatLink(burgerInner);


// Burger-menu positioning
const burgerBtn = document.querySelector('#burger-btn');
correctPositionBurgerMenu(burgerMenu, burgerBtn);

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
  correctPositionBurgerMenu(burgerMenu, burgerBtn);
  correctPositionPlayBtn(switchBtn, playBtn);
});

// Add listener for window to correct position burger-menu & play button
window.addEventListener('resize', () => {
  correctPositionBurgerMenu(burgerMenu, burgerBtn);
  correctPositionPlayBtn(switchBtn, playBtn);
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
    cardsInner.replaceChildren();

    const linkDataCategory = link.dataset.category;
    addWordCards(linkDataCategory);
    currentCategory = linkDataCategory;

    link.classList.add('burger__link_active');
    previousActiveLink = link;

    openCloseBurgerMenu();
    managePlayMode();
    setPlayBtnDefaultStyles(switchBtn, playBtn);
    correctPositionPlayBtn(switchBtn, playBtn);
  }
});

// Global variable sorting state
let categorySortDesc = false;
let wordSortDesc = false;
let translationSortDesc = false;
let trainCountSortDesc = false;
let playCountSortDesc = false;
let errorCountSortDesc = false;
let percentSortDesc = false;

// Function create statistics table
function createStatisticsTable() {
  const statTable = createElem(cardsInner, 'table', '', 'stat__table');
  const statTableBody = createElem(statTable, 'tbody', '', '');

  createTableHeaderTitles(statTableBody);
  fillStatisticsTable(statTableBody, wordStatisticsMap);

  // Add listener for table header titles to sorting
  const statHeaders = document.querySelector('.stat__headers');

  statHeaders.addEventListener('click', function(event) {
    const title = event.target.closest('.stat__th');

    if (!title) return;

    switch (title.dataset.headersTitle) {
      case 'Category':
        categorySortDesc = !categorySortDesc;
        wordStatisticsMap = sortByCategory(categorySortDesc, wordStatisticsMap);
      break;
      case 'Word':
        wordSortDesc = !wordSortDesc;
        wordStatisticsMap = sortByWordName(wordSortDesc, wordStatisticsMap);
      break;
      case 'Translation':
        translationSortDesc = !translationSortDesc;
        wordStatisticsMap = sortByTranslation(translationSortDesc, wordStatisticsMap);
      break;
      case 'Clicks':
        trainCountSortDesc = !trainCountSortDesc;
        wordStatisticsMap = sortByTrainCount(trainCountSortDesc, wordStatisticsMap);
      break;
      case 'Correct':
        playCountSortDesc = !playCountSortDesc;
        wordStatisticsMap = sortByPlayCount(playCountSortDesc, wordStatisticsMap);
      break;
      case 'Wrong':
        errorCountSortDesc = !errorCountSortDesc;
        wordStatisticsMap = sortByErrorCount(errorCountSortDesc, wordStatisticsMap);
      break;
      case '% Correct':
        percentSortDesc = !percentSortDesc;
        wordStatisticsMap = sortByPercent(percentSortDesc, wordStatisticsMap);
      break;
    }

    for (let i = 1; i < statTable.rows.length;) {
      statTable.deleteRow(i);
    }
    fillStatisticsTable(statTableBody, wordStatisticsMap);
  });
}

// Global variable for the collection of words to repeat
let wordCollectionForRepeat = [];

// Add listener for statistics link to open statistics page
statPageLink.addEventListener('click', () => {
  if (playListCards) {
    gameIsOver('lose');
    openCloseBurgerMenu();
  } else {
    playBtn.style.display = 'none';
    currentCategory = statPageLink.dataset.category;
    // Refresh statistics
    setStatisticsInfoToStorage(wordStatisticsMap);
    getStatisticsInfoFromStorage();
    // Delete cards inner
    cardsInner.replaceChildren();
    cardsInner.style.marginTop = 3 + 'rem';
    // Create & add statiscs buttons and table
    createStatisticsBtns(cardsInner);
    createStatisticsTable();
    openCloseBurgerMenu();

    // Add listener for statistics train button to train difficult words
    const statTrainBtn = document.querySelector('.stat__btn_train');
    statTrainBtn.addEventListener('click', () => {
      isRepeatMode = true;
      // Sort & filter the collection by the lowest percentage of correct answers
      const sortedPercentMap = filterZeroAndHundredAndPercentSort(wordStatisticsMap);
      // Pick the first eight word & add to array
      let countWords = 0;
      for (let obj of sortedPercentMap.values()) {
        if (countWords < 8) {
          let cardForRepeat = findCardByWordName(obj.name);
          wordCollectionForRepeat.push(cardForRepeat);
          countWords++;
        }
      }
      // If there is something to repeat, then add cards to page
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
        // If there is nothing to repeat, then show message
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

        playAudio('audio/success.mp3');

        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    });

    // Add listener for statistics reset button to reset statistics
    const statResetBtn = document.querySelector('.stat__btn_reset');
    statResetBtn.addEventListener('click', () => {
      // Clear session storage & refill default properties words collection for repeat
      sessionStorage.clear();
      wordCollectionForRepeat = [];
      wordStatisticsMap = new Map();
      for (let entry of wordCollection) {
        for(let card of entry[1]) {
          const wordStatistics = new WordStatistics(card.word, entry[0], card.translation);
          wordStatisticsMap.set(card.word + '_' + entry[0], wordStatistics);
        }
      }
      // Redraw table with default values
      const statTable = document.querySelector('table');
      const statTableBody = document.querySelector('tbody');
      for (let i = 1; i < statTable.rows.length;) {
        statTable.deleteRow(i);
      }
      fillStatisticsTable(statTableBody, wordStatisticsMap);
    });
  }
});

// Handler for listener's cardsInner in repeat mode
function handlerRepeatWords(event) {
  const cardFront = event.target.closest('.card__front');
  const cardWord = event.target.closest('.card__word');
  const rotateBtn = event.target.closest('.card__rotate-btn');

  if (!cardFront || rotateBtn || !isTrainMode || !isRepeatMode) return;

  if (cardWord) {
    wordCollectionForRepeat.forEach((item) => {
      if(item.word === cardWord.dataset.name) {
        playAudio(item.audioSrc);
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
// Change active link into burger-menu
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
      playAudio(item.audioSrc);
      wordStatisticsMap.get(item.word + '_' + currentCategory).addTrainCount();
    }
  });
});

// ----- Play mode -----

// Global variable switch button
const switchBtn = document.querySelector('.switch-btn input');

// Function manage play mode
function managePlayMode() {
  isTrainMode = changeStylesWordCardsDependingOnMode(isTrainMode, switchBtn);
  changeStylesPlayBtnDependingOnMode(switchBtn, playBtn);

  playBtn.addEventListener('click', () => {
    changeStylesPlayBtnToRepeatBtn(playBtn);
    correctPositionPlayBtn(switchBtn, playBtn);

    playCurrentWordAudio();
  });
}

// Add listener for switch mode to change mode
switchBtn.addEventListener('change', () => {

  if (cardsInner.children[0].classList.contains('card') || currentCategory === 'Statistics') return;

  managePlayMode();
  setPlayBtnDefaultStyles(switchBtn, playBtn);
  correctPositionPlayBtn(switchBtn, playBtn);

  if (playListCards) {
    gameIsOver('lose');
  }
});

// Global variable play data
let playListCards = null;
let currentPlayCardIndex = 0;
let errorsCount = 0;

// Function for reset global variable's property in play mode
function resetGlobalPropertyForPlayMode() {
  playListCards = null;
  currentPlayCardIndex = 0;
  errorsCount = 0;
}

// Function play audio
function playAudio(src) {
  const currentAudio = new Audio(src);
  currentAudio.play();
}

// Function play current word audio
function playCurrentWordAudio() {
  const currentPlayCard = playListCards[currentPlayCardIndex];
  playAudio(currentPlayCard.audioSrc);
}

// Function add to page stars & play audio
function createStars(result, starBox, audio) {
  const star = createElem(starBox, 'img', '', 'play__star-img');

  if (result === 'correct') {
    star.src = 'img/star-win.svg';
    star.alt = 'star win';
    playAudio('audio/correct.mp3');
  } else {
    star.src = 'img/star.svg';
    star.alt = 'star lose';
    playAudio('audio/error.mp3');
  }

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
    playAudio('audio/failure.mp3');
    gameText.innerHTML = `Number of mistakes: ${errorsCount}`;
    gameImg.src = 'img/sad.gif';
    gameImg.alt = 'you lose';
  } else {
    playAudio('audio/success.mp3');
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
          playAudio(currentPlayCard.audioSrc);
        }, 1000);
      }
    } else {
      createStars('incorrect', starBox, audio);
      currentWordStatistics.addErrorCount();
      errorsCount++;
    }
  });
}, {once: true});

// Add listener for window to set word's statistics in session storage
window.addEventListener('beforeunload', () => {
  setStatisticsInfoToStorage(wordStatisticsMap);
});
