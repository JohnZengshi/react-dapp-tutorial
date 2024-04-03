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

const Xiangxiajiantou: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512.2048 1024H512a25.4976 25.4976 0 0 1-18.1248-7.4752L168.0384 690.688a25.6 25.6 0 0 1 36.2496-36.2496l282.112 282.112V25.6a25.6 25.6 0 0 1 51.2 0v911.36l282.5216-282.5216a25.6 25.6 0 1 1 36.1984 36.2496l-325.8368 325.8368a25.4976 25.4976 0 0 1-18.2784 7.4752z"
        fill={getIconColor(color, 0, '#000000')}
      />
    </svg>
  );
};

Xiangxiajiantou.defaultProps = {
  size: 18,
};

export default Xiangxiajiantou;
