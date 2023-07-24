import { createElem, getCoords } from "./helpers";

// Function create main link
export function createMainLink(burgerItem) {
    const mainPageImg = createElem(burgerItem, 'object', '', 'burger-menu__main-img');
    mainPageImg.type = 'image/svg+xml';
    mainPageImg.data = 'img/home.svg';

    const mainPageLink = createElem(burgerItem, 'a', 'Main page', 'burger-menu__main-link');
    mainPageLink.setAttribute('href', '#');
    mainPageLink.classList.add('burger__link_active')
    mainPageLink.dataset.category = 'Main page';
}

// Function create categories links
export function createCategoriesLinks(categoriesName, burgerInner) {
    categoriesName.forEach((category) => {
    const burgerItem = createElem(burgerInner, 'li', '', '');
    const burgerLink = createElem(burgerItem, 'a', category, '');
    burgerLink.setAttribute('href', '#');
    burgerLink.dataset.category = category;

    burgerInner.append(burgerItem);
});
}

// Function create statistics link
export function createStatLink(burgerInner) {
    const burgerItemLi = createElem(burgerInner, 'li', '', '');
    const statPageLink = createElem(burgerItemLi, 'a', 'Statistics', 'stat__link');
    statPageLink.setAttribute('href', '#');
    statPageLink.dataset.category = 'Statistics';

    return statPageLink;
}

// Function correct position burger-menu
export function correctPositionBurgerMenu(burgerMenu, burgerBtn) {
    let coordsBurgerBtn = getCoords(burgerBtn);
    burgerMenu.style.left = `${coordsBurgerBtn.left - 20}px`;

    const homeImg = document.querySelector('.burger-menu__main-img');
    const widthScreen = document.documentElement.scrollWidth;
    burgerMenu.style.left = `${coordsBurgerBtn.left - 20}px`;

    if (widthScreen > 466 && widthScreen < 682) {
      burgerMenu.style.top = 6 + 'rem';
      burgerMenu.style.height = 'calc(100vh - 6rem)';
    }

    if (widthScreen < 466) {
      burgerMenu.style.paddingTop = 4 + 'rem';
      homeImg.style.top = 4.45 + 'rem';
    }
  }

