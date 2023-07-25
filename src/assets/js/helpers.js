// Function create html element
export function createElem(parentElem, tagName, textContent, className = '') {
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

// Function to get html element's coords
export function getCoords(elem) {
  const box = elem.getBoundingClientRect();
  return {
    top: box.top + window.scrollY,
    right: box.right + window.scrollX,
    bottom: box.bottom + window.scrollY,
    left: box.left + window.scrollX,
  };
}
