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

const AZu392: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 2124 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M2123.277838 1.107027H0V0h2123.277838v1.107027z"
        fill={getIconColor(color, 0, '#000000')}
        opacity=".6"
      />
      <path
        d="M2124.384865 1024H1.107027v-1.107027h2123.277838v1.107027zM2124.384865 913.297297H1.107027v-1.107027h2123.277838v1.107027zM2123.277838 797.059459H0v-1.107027h2123.277838v1.107027zM2123.277838 683.035676H0v-1.107027h2123.277838v1.107027zM2123.277838 569.011892H0v-1.107027h2123.277838v1.107027zM2123.277838 453.881081H0v-1.107027h2123.277838v1.107027zM2123.277838 339.857297H0v-1.107027h2123.277838v1.107027zM2123.277838 225.833514H0v-1.107028h2123.277838v1.107028zM2123.277838 111.80973H0v-1.107027h2123.277838v1.107027z"
        fill={getIconColor(color, 1, '#000000')}
        opacity=".1"
      />
      <path
        d="M136.717838 858.499459v-825.842162h-1.107027v825.842162h1.107027zM247.420541 858.499459v-825.842162h-1.107027v825.842162h1.107027zM358.123243 858.499459v-825.842162h-1.107027v825.842162h1.107027zM468.825946 858.499459v-825.842162h-1.107027v825.842162h1.107027zM579.528649 858.499459v-825.842162h-1.107027v825.842162h1.107027zM690.231351 858.499459v-825.842162h-1.107027v825.842162h1.107027zM800.934054 858.499459v-825.842162h-1.107027v825.842162h1.107027zM911.636757 858.499459v-825.842162h-1.107027v825.842162h1.107027zM1022.339459 858.499459v-825.842162h-1.107027v825.842162h1.107027z"
        fill={getIconColor(color, 2, '#000000')}
        opacity=".1"
      />
    </svg>
  );
};

AZu392.defaultProps = {
  size: 18,
};

export default AZu392;
