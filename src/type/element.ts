export type TElementType = 'test' | 'timer' | 'browser';
export type TElementID = 'string';
export interface IElementBase {
  id: TElementID,
  type: TElementType,
}
export interface IElementTest extends IElementBase {
  type: 'test',
  text: string,
}
export interface IElementTimer extends IElementBase {
  type: 'timer',
}
export interface IElementBrowser extends IElementBase {
  type: 'browser',
}
export type TPossibleElementType = IElementTest | IElementTimer | IElementBrowser;
