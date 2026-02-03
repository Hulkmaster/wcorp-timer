import type { IElementTest, TElementID, TElementType, TPossibleElementType } from '@/type/element';

export enum ELocalStorageKey {
  ELEMENT_POSITIONS = 'ELEMENT_POSITIONS',
  ELEMENT_LIST = 'ELEMENT_LIST',
}

interface ILocalStorageMapping {
  [ELocalStorageKey.ELEMENT_POSITIONS]: Record<
    TElementID,
    | {
        x: number;
        y: number;
      }
    | undefined
  >;
  [ELocalStorageKey.ELEMENT_LIST]: Record<TElementID, TPossibleElementType | undefined>;
}

export function localStorageGet<T extends ELocalStorageKey>(
  key: T,
): ILocalStorageMapping[T] {
  const restoredString = localStorage.getItem(key);
  return restoredString ? JSON.parse(restoredString) : ({} as any);
}

export function localStorageSet<T extends ELocalStorageKey>(
  key: T,
  value: ILocalStorageMapping[T],
) {
  return localStorage.setItem(key, JSON.stringify(value));
}
