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

const Xiangzuojiantou: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M0.2048 512c-0.0512-6.656 2.4064-13.2608 7.4752-18.2784l325.8368-325.8368a25.6 25.6 0 1 1 36.1984 36.1984L87.2448 486.6048h911.36a25.6 25.6 0 1 1 0 51.2H87.552l282.112 282.112a25.6 25.6 0 0 1-36.1984 36.1984L7.68 530.2784a25.4976 25.4976 0 0 1-7.4752-18.0736V512z"
        fill={getIconColor(color, 0, '#000000')}
      />
    </svg>
  );
};

Xiangzuojiantou.defaultProps = {
  size: 18,
};

export default Xiangzuojiantou;
