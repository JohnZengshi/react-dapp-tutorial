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

const ArrowRight: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M332.501333 840.832a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709334L600.95999999 512l-268.47999999-268.501333a42.666667 42.666667 0 0 1-2.496-57.621334l2.496-2.709333a42.666667 42.666667 0 0 1 57.621333-2.496l2.709334 2.496 298.66666599 298.666667a42.666667 42.666667 0 0 1 2.49600001 57.62133299l-2.49600001 2.70933301-298.66666599 298.666667a42.666667 42.666667 0 0 1-60.330667 0z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

ArrowRight.defaultProps = {
  size: 18,
};

export default ArrowRight;
