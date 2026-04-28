/**
 * Returns an element by id. If the element is not found, an error is thrown.
 * @param id
 * @param functionName
 * @returns Element as T extends HTMLElement
 */
export function getElementByIdFrom(id, functionName) {
  const element = document.querySelector < T > `#${id}`;

  if (element === null)
    throw new Error(`Error(${functionName}): element id '${id}' not found.`);

  return element;
}

/**
 *
 * @returns App element as HTMLDivElement
 */
export function getAppElement() {
  return getElementByIdFrom < HTMLDivElement > "app";
}

export function createRowElement() {
  const element = document.createElement("div");
  element.className = "row";
  return element;
}

export function createColElement(numColums) {
  const element = document.createElement("div");
  element.className = `col-${numColums}`;
  return element;
}
