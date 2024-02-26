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

const AXinbantuitewuyuanjiao: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M954.368 68.096h-80.896L573.44 412.16 334.848 68.096H51.2L414.72 593.92l-345.088 395.776h80.896L450.56 645.632l238.08 344.064H972.8L609.28 463.872l345.088-395.776z m-88.576 867.328h-125.44c-150.528-210.944-423.424-593.92-574.976-805.888h127.488c148.992 209.92 422.912 594.432 572.928 805.888z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

AXinbantuitewuyuanjiao.defaultProps = {
  size: 18,
};

export default AXinbantuitewuyuanjiao;
