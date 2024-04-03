/* tslint:disable */
/* eslint-disable */

import React, { SVGAttributes, FunctionComponent } from 'react';
import Lianjiejiantou from './Lianjiejiantou';
import Diqiu from './Diqiu';
import Instagram from './Instagram';
import Xiangzuojiantou from './Xiangzuojiantou';
import Xiangxiajiantou from './Xiangxiajiantou';
import AZu392 from './AZu392';
import ADuobianxing10 from './ADuobianxing10';
import Diannao1 from './Diannao1';
import Telegram1 from './Telegram1';
import YoutubeFill from './YoutubeFill';
import Discord from './Discord';
import AXinbantuitewuyuanjiao from './AXinbantuitewuyuanjiao';
import Medium from './Medium';
import ArrowDown from './ArrowDown';
import ArrowLeft from './ArrowLeft';
import ArrowRight from './ArrowRight';
import Wushuju1 from './Wushuju1';
import Metamask from './Metamask';
import Jiazai from './Jiazai';
import GantanhaoYuankuang from './GantanhaoYuankuang';
import Book from './Book';
import Bitcoin from './Bitcoin';
import StarkWare from './StarkWare';
import Roos from './Roos';
import ADropDownmenu from './ADropDownmenu';
import Telegram from './Telegram';
import Github from './Github';
export { default as Lianjiejiantou } from './Lianjiejiantou';
export { default as Diqiu } from './Diqiu';
export { default as Instagram } from './Instagram';
export { default as Xiangzuojiantou } from './Xiangzuojiantou';
export { default as Xiangxiajiantou } from './Xiangxiajiantou';
export { default as AZu392 } from './AZu392';
export { default as ADuobianxing10 } from './ADuobianxing10';
export { default as Diannao1 } from './Diannao1';
export { default as Telegram1 } from './Telegram1';
export { default as YoutubeFill } from './YoutubeFill';
export { default as Discord } from './Discord';
export { default as AXinbantuitewuyuanjiao } from './AXinbantuitewuyuanjiao';
export { default as Medium } from './Medium';
export { default as ArrowDown } from './ArrowDown';
export { default as ArrowLeft } from './ArrowLeft';
export { default as ArrowRight } from './ArrowRight';
export { default as Wushuju1 } from './Wushuju1';
export { default as Metamask } from './Metamask';
export { default as Jiazai } from './Jiazai';
export { default as GantanhaoYuankuang } from './GantanhaoYuankuang';
export { default as Book } from './Book';
export { default as Bitcoin } from './Bitcoin';
export { default as StarkWare } from './StarkWare';
export { default as Roos } from './Roos';
export { default as ADropDownmenu } from './ADropDownmenu';
export { default as Telegram } from './Telegram';
export { default as Github } from './Github';

export type IconNames = 'lianjiejiantou' | 'diqiu' | 'instagram' | 'xiangzuojiantou' | 'xiangxiajiantou' | 'a-zu392' | 'a-duobianxing10' | 'diannao1' | 'telegram1' | 'Youtube-fill' | 'discord' | 'a-xinbantuitewuyuanjiao' | 'medium' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'wushuju1' | 'metamask' | 'jiazai' | 'gantanhao-yuankuang' | 'book' | 'Bitcoin' | 'StarkWare' | 'roos' | 'a-drop-downmenu' | 'telegram' | 'github';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  name: IconNames;
  size?: number;
  color?: string | string[];
}

const IconFont: FunctionComponent<Props> = ({ name, ...rest }) => {
  switch (name) {
    case 'lianjiejiantou':
      return <Lianjiejiantou {...rest} />;
    case 'diqiu':
      return <Diqiu {...rest} />;
    case 'instagram':
      return <Instagram {...rest} />;
    case 'xiangzuojiantou':
      return <Xiangzuojiantou {...rest} />;
    case 'xiangxiajiantou':
      return <Xiangxiajiantou {...rest} />;
    case 'a-zu392':
      return <AZu392 {...rest} />;
    case 'a-duobianxing10':
      return <ADuobianxing10 {...rest} />;
    case 'diannao1':
      return <Diannao1 {...rest} />;
    case 'telegram1':
      return <Telegram1 {...rest} />;
    case 'Youtube-fill':
      return <YoutubeFill {...rest} />;
    case 'discord':
      return <Discord {...rest} />;
    case 'a-xinbantuitewuyuanjiao':
      return <AXinbantuitewuyuanjiao {...rest} />;
    case 'medium':
      return <Medium {...rest} />;
    case 'arrow-down':
      return <ArrowDown {...rest} />;
    case 'arrow-left':
      return <ArrowLeft {...rest} />;
    case 'arrow-right':
      return <ArrowRight {...rest} />;
    case 'wushuju1':
      return <Wushuju1 {...rest} />;
    case 'metamask':
      return <Metamask {...rest} />;
    case 'jiazai':
      return <Jiazai {...rest} />;
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
