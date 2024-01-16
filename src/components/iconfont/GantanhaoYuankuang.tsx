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

const GantanhaoYuankuang: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 1021.72444445C793.25866667 1021.72444445 1021.72444445 793.25866667 1021.72444445 512s-228.46577778-509.72444445-509.72444445-509.72444445-509.72444445 228.46577778-509.72444445 509.72444445S230.74133333 1021.72444445 512 1021.72444445z m-36.40888889-800.99555556l72.81777778 0 0 72.81777778-72.81777778 0 0-72.81777778z m72.81777778 145.63555556L548.40888889 803.27111111l-72.81777778 0 0-436.90666666 72.81777778 0z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

GantanhaoYuankuang.defaultProps = {
  size: 18,
};

export default GantanhaoYuankuang;
