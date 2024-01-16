/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import GantanhaoYuankuang from './GantanhaoYuankuang';
import Book from './Book';
import Bitcoin from './Bitcoin';
import StarkWare from './StarkWare';
import Roos from './Roos';
import ADropDownmenu from './ADropDownmenu';
import Telegram from './Telegram';
import Github from './Github';
export { default as GantanhaoYuankuang } from './GantanhaoYuankuang';
export { default as Book } from './Book';
export { default as Bitcoin } from './Bitcoin';
export { default as StarkWare } from './StarkWare';
export { default as Roos } from './Roos';
export { default as ADropDownmenu } from './ADropDownmenu';
export { default as Telegram } from './Telegram';
export { default as Github } from './Github';

export type IconNames = 'gantanhao-yuankuang' | 'book' | 'Bitcoin' | 'StarkWare' | 'roos' | 'a-drop-downmenu' | 'telegram' | 'github';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'gantanhao-yuankuang':
      return <GantanhaoYuankuang {...rest} />;
    case 'book':
      return <Book {...rest} />;
    case 'Bitcoin':
      return <Bitcoin {...rest} />;
    case 'StarkWare':
      return <StarkWare {...rest} />;
    case 'roos':
      return <Roos {...rest} />;
    case 'a-drop-downmenu':
      return <ADropDownmenu {...rest} />;
    case 'telegram':
      return <Telegram {...rest} />;
    case 'github':
      return <Github {...rest} />;

  }

  return null;
};

export default IconFont;
