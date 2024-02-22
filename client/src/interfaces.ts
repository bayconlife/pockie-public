import { ItemType } from './enums';

export interface IItem {
  key: string;
  type: ItemType;
  size: number;
  src: string;
  props?: {
    [prop: string]: any;
  };
}

export interface Styled {
  style?: React.CSSProperties;
}

export interface Children {
  children?: React.ReactNode;
}

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface JObject extends Styled, Children {
  size: Size;
  position?: Position;
}
