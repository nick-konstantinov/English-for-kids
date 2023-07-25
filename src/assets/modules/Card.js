import { createElem } from '../js/helpers';

export function addCardContent(card, srcImg, altText, classNameImg, classNameTitle, titleText) {
  const cardImg = createElem(card, 'img', '', classNameImg);
  cardImg.src = srcImg;
  cardImg.alt = altText;

  const cardTitle = createElem(card, 'h3', titleText, classNameTitle);

  if (titleText.length > 15) {
    cardTitle.style.marginTop = 0;
  }

  return card;
}

export class Card {
  constructor(name, className) {
    this.name = name;
    this.className = className;
  }

  createCard(srcImg, altText, classNameImg, titleText, classNameTitle) {
    const card = this.createCardContainer(titleText);
    return addCardContent(card, srcImg, altText, classNameImg, classNameTitle, titleText);
  }

  createCardContainer(titleText) {
    const card = document.createElement('div');
    card.classList.add(this.className);
    card.dataset.name = titleText;
    return card;
  }
}

export default Card;
