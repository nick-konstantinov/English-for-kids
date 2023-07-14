import Card from "./Card";
import { createElem } from "../js/helpers";

class CardWord extends Card {
  createCard(srcImg, altText, classNameImg,  classNameTitle, frontTitleText, backTitleText, classNameFront, classNameBack) {

    const cardWord = super.createCardContainer(frontTitleText);

    const cardFrontSide = createElem(cardWord, 'div', '', classNameFront);
    const rotateBtn = createElem(cardFrontSide, 'img', '', 'card__rotate-btn');
    rotateBtn.src = 'img/rotate.svg';

    const cardBackSide = createElem(cardWord, 'div', '', classNameBack);

    super.addCardContent(cardFrontSide, srcImg, altText, classNameImg, classNameTitle,  frontTitleText);
    super.addCardContent(cardBackSide, srcImg, altText, classNameImg, classNameTitle,  backTitleText);

    return cardWord;
  }
}

export default CardWord;