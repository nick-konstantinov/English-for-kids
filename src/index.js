import './style.css';
import cards from './assets/js/cards';
import Card from './assets/module/Card';
import CardWord from './assets/module/CardWord';
import { createElem } from './assets/js/helpers';
import { getCoords } from './assets/js/helpers';

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

// Add listener for window to correct position burger-menu
window.addEventListener('resize', () => {
  coordsBurgerBtn = getCoords(burgerBtn);
  burgerMenu.style.left = `${coordsBurgerBtn.left - 20}px`;
});

// Add listener for burger button to open&close burger-menu
burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('burger-btn_active');
  burgerMenu.classList.toggle('burger-menu_open');
  body.classList.toggle('noscroll');
  mask.hidden = !mask.hidden;
});

// Add listener for mask to close burger-menu
mask.addEventListener('click', () => {
  burgerBtn.classList.toggle('burger-btn_active');
  burgerMenu.classList.toggle('burger-menu_open');
  body.classList.toggle('noscroll');
  mask.hidden = !mask.hidden;
});

// Add listener for logo if push reload page
const logo = document.querySelector('.header__logo');

logo.addEventListener('click', () => {
  location.reload();
});

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

    cardsInner.append(wordCard.createCard(cardWordSrc, cardWordAlt, 'card__img', 'card__title', cardWordFrontTitle, cardWordBackTitle, 'card__front', 'card__back'));
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
cardsInner.addEventListener('click', function(event) {
  const card = event.target.closest('.card');

  if (!card) return;

  cardsInner.replaceChildren();
  addWordCards(card.dataset.name);
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

  cardBack.addEventListener('mouseleave', () => {
    cardFront.style.transform = 'rotateY(0deg)';
    cardBack.style.transform = 'rotateY(180deg)';
  });

});
