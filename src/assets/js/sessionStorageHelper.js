import WordStatistics from "../modules/WordStatistics";

// Function get statistics info from session storage
export function getStatisticsInfoFromStorage() {
    if (sessionStorage.getItem('stat')) {
      const statMapFromStorage = new Map(JSON.parse(sessionStorage.getItem('stat')));
      const wordStatMapFromStorage = new Map();

      for (let entry of statMapFromStorage) {
        const card = entry[1];
        const wordStatistics = new WordStatistics(card._name, card._category, card._translation, card._trainCount, card._playCount, card._errorCount, card._percent);

        wordStatMapFromStorage.set(card._name + '_' + card._category, wordStatistics);
      }
      return wordStatMapFromStorage;
    }
}

// Function set statistics info to session storage
export function setStatisticsInfoToStorage(map) {
    sessionStorage.setItem('stat', JSON.stringify(Array.from(map.entries())));
}