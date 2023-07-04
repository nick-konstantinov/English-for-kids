import './style.css';
import cards from './assets/cards';

// Function create element
function createElem(parentElem, tagName, textContent, className = '') {
  const newElem = document.createElement(tagName);
  if (Array.isArray(className)) {
    className.forEach((item) => newElem.classList.add(item));
  } else if (className) {
    newElem.classList.add(className);
  }
  newElem.innerHTML = textContent;
  parentElem.append(newElem);
  return newElem;
}

// Function to get element's coords
function getCoords(elem) {
  const box = elem.getBoundingClientRect();
  return {
    top: box.top + window.scrollY,
    right: box.right + window.scrollX,
    bottom: box.bottom + window.scrollY,
    left: box.left + window.scrollX,
  };
}

// Get categories name
const categoriesName = cards[0];

// Burger-menu
const { body } = document;

// Create burger-menu & add to page
const burgerMenu = createElem(body, 'nav', '', 'burger-menu');
const burgerInner = createElem(burgerMenu, 'ul', '', '');

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

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('burger-btn_active');
  burgerMenu.classList.toggle('burger-menu_open');
  body.classList.toggle('noscroll');
});
