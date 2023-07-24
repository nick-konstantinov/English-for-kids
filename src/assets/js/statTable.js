import { createElem } from "./helpers";

// Function create headers title table
export function createTableHeaderTitles(statTableBody) {
    const statTableTr = createElem(statTableBody, 'tr', '', 'stat__headers');
    const thTitles = ['№', 'Category', 'Word', 'Translation', 'Clicks', 'Correct', 'Wrong', '% Correct'];
    thTitles.forEach((item) => {
      if (item === '№') {
        createElem(statTableTr, 'th', item, 'stat__number');
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
export function fillStatisticsTable(statTableBody, wordStatisticsMap) {
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
export function createStatisticsBtns(cardsInner) {
    const statBtnsInner = createElem(cardsInner, 'div', '', 'stat__btn-inner');
    createElem(statBtnsInner, 'button', 'Train difficult', ['stat__btn', 'stat__btn_train']);
    createElem(statBtnsInner, 'button', 'Reset statistics', ['stat__btn', 'stat__btn_reset']);
}