import { isInBox } from '../util/html';
import { rafCallback } from '@/util/raf';

// some elements use portals to be bound somewhere,
// for these cases we specify static selector list
const GLOBAL_ELEMENT_SELECTOR = [
  // primevue portal
  '[data-p=portal-body]'
];

type TPosition = { x: number; y: number };
const elementList: HTMLElement[] = [];
let currentIgnoreCursorEvents: boolean = true;

const deviceMouseMoveRafCallback = rafCallback((event: MouseEvent) => {
  // if at least 1 element was hit
  let hasHit = false;
  const listCopy = [
    ...GLOBAL_ELEMENT_SELECTOR.map(
      (_selector) => document.querySelector(_selector) as HTMLElement,
    ).filter((_element) => !!_element),
    ...elementList,
  ];

  // Note that CSS pixel is different from device pixel.
  // See [this doc](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
  listCopy.forEach((_element) => {
    hasHit = hasHit || isInBox(event.x, event.y, _element);
  });

  if (!hasHit && currentIgnoreCursorEvents === false) {
    currentIgnoreCursorEvents = true;
    window.electronAPI.setIgnoreMouseEvents(true, { forward: true } as Electron.IgnoreMouseEventsOptions);
    return;
  }

  if (hasHit && currentIgnoreCursorEvents === true) {
    currentIgnoreCursorEvents = false;
    window.electronAPI.setIgnoreMouseEvents(false);
  }
});

export function addGlobalMouseListener() {
  window.document.addEventListener('mousemove', deviceMouseMoveRafCallback);
}

export function removeGlobalMouseListener() {
  window.document.removeEventListener('mousemove', deviceMouseMoveRafCallback);
}

/**
 * Global controller is responsible for communication with backend based on mousemove
 */
export function useGlobalController() {
  function addElement(element: HTMLElement) {
    elementList.push(element);
  }

  function removeElement(element: HTMLElement) {
    const index = elementList.findIndex((_element) => _element === element);
    elementList.splice(index, 1);
  }

  function getInitialAbsolutePosition(): TPosition {
    const position = 10;
    const elementLengthRest = elementList.length % 5;
    return elementLengthRest === 0
      ? {
          x: position,
          y: position,
        }
      : {
          x: position * elementLengthRest,
          y: position * elementLengthRest,
        };
  }

  return {
    addElement,
    removeElement,
    elementList,
    getInitialAbsolutePosition,
  };
}
