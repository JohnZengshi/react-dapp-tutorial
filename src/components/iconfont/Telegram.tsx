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

const Telegram: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 0C229.2224 0 0 229.2224 0 512s229.2224 512 512 512 512-229.2224 512-512S794.7776 0 512 0z m237.312 348.2112c-7.68 80.9472-41.0368 277.4272-58.0096 368.1024-7.168 38.3488-21.2992 51.2-34.9952 52.48-29.696 2.7392-52.3008-19.6352-81.1008-38.528-45.056-29.5424-70.528-47.9232-114.2528-76.7488-50.56-33.3056-17.792-51.6096 11.008-81.536 7.552-7.8336 138.5472-127.0016 141.0816-137.8048 0.3328-1.3568 0.64-6.4-2.3808-9.0624-2.9952-2.6368-7.424-1.7408-10.5984-1.024q-6.784 1.536-215.9616 142.7456-30.6432 21.0432-55.5264 20.5056c-18.2784-0.384-53.4528-10.3424-79.5904-18.8416-32.0512-10.4192-57.5488-15.9232-55.3216-33.6384q1.7408-13.824 38.0928-28.2624 223.872-97.536 298.5728-128.64c142.208-59.136 171.7504-69.4016 191.0016-69.7344 4.2496-0.0768 13.696 0.9728 19.84 5.9392 4.096 3.5584 6.6816 8.4992 7.296 13.8752 1.024 6.656 1.3312 13.44 0.8448 20.1728z"
        fill={getIconColor(color, 0, '#FFFFFF')}
      />
    </svg>
  );
};

Telegram.defaultProps = {
  size: 18,
};

export default Telegram;
