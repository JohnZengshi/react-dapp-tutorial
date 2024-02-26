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

const ArrowDown: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M183.168 332.501333a42.666667 42.666667 0 0 1 57.621333-2.496l2.709334 2.496L512 600.96l268.501333-268.48a42.666667 42.666667 0 0 1 57.621334-2.496l2.709333 2.496a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709334-298.666667 298.666666a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709333-2.496-298.666667-298.666666a42.666667 42.666667 0 0 1 0-60.330667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

ArrowDown.defaultProps = {
  size: 18,
};

export default ArrowDown;
