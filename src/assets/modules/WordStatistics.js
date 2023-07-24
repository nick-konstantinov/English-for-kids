class WordStatistics {
  constructor(name, category, translation, trainCount = 0, playCount = 0, errorCount = 0, percent = 0) {
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

  get category() {
    return this._category;
  }

  get translation() {
    return this._translation;
  }

  get trainCount() {
    return this._trainCount;
  }

  get playCount() {
    return this._playCount;
  }

  get errorCount() {
    return this._errorCount;
  }

  get percent() {
    return this.calculatePercent();
  }

  set name(value) {
    this._name = value;
  }

  set category(value) {
    this._category = value;
  }

  set translation(value) {
    this._translation = value;
  }

  set trainCount(value) {
    this._trainCount = value;
  }

  set playCount(value) {
    this._playCount = value;
  }

  set errorCount(value) {
    this._errorCount = value;
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
    if (this._playCount != 0) {
      this._percent = Math.round(this._playCount / (this._playCount + this._errorCount) * 100);
      return this._percent;
    }
    return 0;
  }

}

export default WordStatistics;