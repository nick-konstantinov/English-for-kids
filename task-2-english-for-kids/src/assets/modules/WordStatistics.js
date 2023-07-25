class WordStatistics {
  constructor(
    name,
    category,
    translation,
    trainCount = 0,
    playCount = 0,
    errorCount = 0,
    percent = 0,
  ) {
    this.name = name;
    this.category = category;
    this.translation = translation;
    this.trainCount = trainCount;
    this.playCount = playCount;
    this.errorCount = errorCount;
    this.percent = percent;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get category() {
    return this._category;
  }

  set category(value) {
    this._category = value;
  }

  get translation() {
    return this._translation;
  }

  set translation(value) {
    this._translation = value;
  }

  get trainCount() {
    return this._trainCount;
  }

  set trainCount(value) {
    this._trainCount = value;
  }

  get playCount() {
    return this._playCount;
  }

  set playCount(value) {
    this._playCount = value;
  }

  get errorCount() {
    return this._errorCount;
  }

  set errorCount(value) {
    this._errorCount = value;
  }

  get percent() {
    return this.calculatePercent();
  }

  set percent(value) {
    this._percent = value;
  }

  addTrainCount() {
    this._trainCount++;
  }

  addPlayCount() {
    this._playCount++;
  }

  addErrorCount() {
    this._errorCount++;
  }

  calculatePercent() {
    if (this._playCount !== 0) {
      this._percent = Math.round((this._playCount / (this._playCount + this._errorCount)) * 100);
      return this._percent;
    }
    return 0;
  }
}

export default WordStatistics;
