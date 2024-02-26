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

const Medium: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M577.707947 512a290.133333 290.133333 0 0 1-288.853334 290.986667A290.133333 290.133333 0 0 1 0.00128 512a290.133333 290.133333 0 0 1 288.853333-290.986667A290.133333 290.133333 0 0 1 577.707947 512z m316.586666 0c0 151.04-64.426667 273.92-144.213333 273.92-79.786667 0-144.64-122.88-144.64-273.92s64.853333-273.92 144.64-273.92 144.213333 122.88 144.213333 273.92zM1024.00128 512c0 135.253333-22.613333 245.333333-50.773333 245.333333-28.16 0-50.773333-110.08-50.773334-245.333333s22.613333-245.333333 50.773334-245.333333C1001.387947 266.666667 1024.00128 376.746667 1024.00128 512z"
        fill={getIconColor(color, 0, '#000000')}
      />
    </svg>
  );
};

Medium.defaultProps = {
  size: 18,
};

export default Medium;
