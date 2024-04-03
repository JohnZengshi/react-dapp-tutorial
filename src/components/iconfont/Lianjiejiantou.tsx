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

const Lianjiejiantou: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M842.353778 608.483556V214.072889a28.785778 28.785778 0 0 0-32.085334-32.028445H415.914667a28.444444 28.444444 0 1 0 0 56.888889h329.272889l-555.121778 555.121778a28.444444 28.444444 0 1 0 40.220444 40.220445l555.178667-555.121778v329.386666a28.444444 28.444444 0 1 0 56.888889 0z"
        fill={getIconColor(color, 0, '#000000')}
      />
    </svg>
  );
};

Lianjiejiantou.defaultProps = {
  size: 18,
};

export default Lianjiejiantou;
