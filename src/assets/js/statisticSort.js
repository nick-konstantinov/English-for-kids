export function sortByCategory(categorySortDesc, wordStatisticsMap) {
    if (categorySortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (a[1].category > b[1].category ? 1 : -1)));
    } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (b[1].category > a[1].category ? 1 : -1)));
    }
    return wordStatisticsMap;
}

export function sortByWordName(wordSortDesc, wordStatisticsMap) {
    if (wordSortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (a[1].name > b[1].name ? 1 : -1)));
      } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (b[1].name > a[1].name ? 1 : -1)));
      }
    return wordStatisticsMap;
}

export function sortByTranslation(translationSortDesc, wordStatisticsMap) {
    if (translationSortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (a[1].translation > b[1].translation ? 1 : -1)));
    } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => (b[1].translation > a[1].translation ? 1 : -1)));
    }
    return wordStatisticsMap;
}

export function sortByTrainCount(trainCountSortDesc, wordStatisticsMap) {
    if (trainCountSortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].trainCount - b[1].trainCount));
    } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].trainCount - a[1].trainCount));
    }
    return wordStatisticsMap;
}

export function sortByPlayCount(playCountSortDesc, wordStatisticsMap) {
    if (playCountSortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].playCount - b[1].playCount));
    } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].playCount - a[1].playCount));
    }
    return wordStatisticsMap;
}

export function sortByErrorCount(errorCountSortDesc, wordStatisticsMap) {
    if (errorCountSortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].errorCount - b[1].errorCount));
    } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].errorCount - a[1].errorCount));
    }
    return wordStatisticsMap;
}

export function sortByPercent(percentSortDesc, wordStatisticsMap) {
    if (percentSortDesc) {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => a[1].percent - b[1].percent));
    } else {
        wordStatisticsMap = new Map([...wordStatisticsMap].sort((a, b) => b[1].percent - a[1].percent));
    }
    return wordStatisticsMap;
}

export function filterZeroAndHundredAndPercentSort(map) {
    return new Map([...map]
        .sort((a, b) => a[1].percent - b[1].percent)
        .filter( item => (item[1].percent != 0 && item[1].percent != 100)
          || (item[1].percent === 0 && item[1].errorCount > 0)))
      ;
}
