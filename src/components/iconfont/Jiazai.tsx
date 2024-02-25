/* tslint:disable */
/* eslint-disable */

import React, { CSSProperties, SVGAttributes, FunctionComponent } from 'react';
import { getIconColor } from './helper';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: 'block',
};

const Jiazai: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 61.44a40.96 40.96 0 0 1 40.96 40.96v122.88a40.96 40.96 0 1 1-81.92 0V102.4a40.96 40.96 0 0 1 40.96-40.96z"
        fill={getIconColor(color, 0, '#000000')}
      />
      <path
        d="M737.28 121.79456a40.96 40.96 0 0 1 14.99136 55.95136l-61.44 106.43456a40.96 40.96 0 1 1-70.94272-40.96l61.44-106.43456A40.96 40.96 0 0 1 737.28 121.79456z"
        fill={getIconColor(color, 1, '#191919')}
      />
      <path
        d="M902.20544 286.72a40.96 40.96 0 0 1-14.99136 55.95136l-106.43456 61.44a40.96 40.96 0 0 1-40.96-70.94272l106.43456-61.44a40.96 40.96 0 0 1 55.95136 14.99136z"
        fill={getIconColor(color, 2, '#333333')}
      />
      <path
        d="M962.56 512a40.96 40.96 0 0 1-40.96 40.96h-122.88a40.96 40.96 0 1 1 0-81.92h122.88a40.96 40.96 0 0 1 40.96 40.96z"
        fill={getIconColor(color, 3, '#4C4C4C')}
      />
      <path
        d="M902.20544 737.28a40.96 40.96 0 0 1-55.95136 14.99136l-106.43456-61.44a40.96 40.96 0 1 1 40.96-70.94272l106.43456 61.44A40.96 40.96 0 0 1 902.20544 737.28z"
        fill={getIconColor(color, 4, '#666666')}
      />
      <path
        d="M737.28 902.20544a40.96 40.96 0 0 1-55.95136-14.99136l-61.44-106.43456a40.96 40.96 0 0 1 70.94272-40.96l61.44 106.43456A40.96 40.96 0 0 1 737.28 902.20544z"
        fill={getIconColor(color, 5, '#7F7F7F')}
      />
      <path
        d="M512 962.56a40.96 40.96 0 0 1-40.96-40.96v-122.88a40.96 40.96 0 1 1 81.92 0v122.88a40.96 40.96 0 0 1-40.96 40.96z"
        fill={getIconColor(color, 6, '#999999')}
      />
      <path
        d="M286.72 902.20544a40.96 40.96 0 0 1-14.99136-55.95136l61.44-106.43456a40.96 40.96 0 1 1 70.94272 40.96l-61.44 106.43456a40.96 40.96 0 0 1-55.95136 14.99136z"
        fill={getIconColor(color, 7, '#ACACAC')}
      />
      <path
        d="M121.79456 737.28a40.96 40.96 0 0 1 14.99136-55.95136l106.43456-61.44a40.96 40.96 0 0 1 40.96 70.94272l-106.43456 61.44A40.96 40.96 0 0 1 121.79456 737.28z"
        fill={getIconColor(color, 8, '#BFBFBF')}
      />
      <path
        d="M61.44 512a40.96 40.96 0 0 1 40.96-40.96h122.88a40.96 40.96 0 1 1 0 81.92H102.4a40.96 40.96 0 0 1-40.96-40.96z"
        fill={getIconColor(color, 9, '#CCCCCC')}
      />
      <path
        d="M121.79456 286.72a40.96 40.96 0 0 1 55.95136-14.99136l106.43456 61.44a40.96 40.96 0 1 1-40.96 70.94272l-106.43456-61.44A40.96 40.96 0 0 1 121.79456 286.72z"
        fill={getIconColor(color, 10, '#E5E5E5')}
      />
      <path
        d="M286.72 121.79456a40.96 40.96 0 0 1 55.95136 14.99136l61.44 106.43456a40.96 40.96 0 0 1-70.94272 40.96l-61.44-106.43456A40.96 40.96 0 0 1 286.72 121.79456z"
        fill={getIconColor(color, 11, '#F2F2F2')}
      />
    </svg>
  );
};

Jiazai.defaultProps = {
  size: 18,
};

export default Jiazai;
