/* tslint:disable */
/* eslint-disable */

import React, { CSSProperties, SVGAttributes, FunctionComponent } from "react";
import { getIconColor } from "./helper";

interface Props extends Omit<SVGAttributes<SVGElement>, "color"> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: "block",
};

const ADropDownmenu: FunctionComponent<Props> = ({
  size,
  color,
  style: _style,
  ...rest
}) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size + "px"}
      height={size + "px"}
      style={style}
      {...rest}
    >
      <path
        d="M169.581714 291.474286h682.678857q3.584 0 7.131429-0.658286 3.547429-0.731429 6.875429-2.084571 3.291429-1.389714 6.290285-3.401143 2.998857-1.974857 5.558857-4.534857 2.56-2.56 4.534858-5.522286 2.011429-2.998857 3.401142-6.326857 1.389714-3.328 2.084572-6.875429 0.694857-3.547429 0.694857-7.131428 0-3.620571-0.731429-7.131429-0.658286-3.547429-2.048-6.875429-1.389714-3.291429-3.401142-6.326857-1.974857-2.998857-4.534858-5.522285-2.56-2.56-5.558857-4.571429-2.962286-1.974857-6.290285-3.364571-3.328-1.389714-6.875429-2.084572-3.547429-0.731429-7.131429-0.731428H169.581714q-3.584 0-7.131428 0.731428-3.510857 0.731429-6.838857 2.084572-3.328 1.389714-6.326858 3.364571-2.998857 2.011429-5.558857 4.571429-2.56 2.56-4.534857 5.522285-2.011429 2.998857-3.401143 6.326857-1.353143 3.328-2.084571 6.875429-0.694857 3.510857-0.694857 7.131429 0 3.584 0.731428 7.131428 0.694857 3.547429 2.048 6.875429 1.389714 3.291429 3.401143 6.326857 1.974857 2.962286 4.534857 5.522286 2.56 2.56 5.558857 4.534857 2.998857 2.011429 6.326858 3.401143 3.291429 1.389714 6.838857 2.084571 3.547429 0.694857 7.131428 0.694857zM169.581714 547.474286h682.678857q3.584 0 7.131429-0.694857t6.875429-2.048q3.291429-1.389714 6.290285-3.401143 2.998857-2.011429 5.558857-4.534857 2.56-2.56 4.534858-5.558858 2.011429-2.998857 3.401142-6.326857 1.389714-3.291429 2.084572-6.838857 0.694857-3.547429 0.694857-7.131428 0-3.620571-0.731429-7.131429-0.658286-3.547429-2.048-6.875429-1.389714-3.328-3.401142-6.326857-1.974857-2.998857-4.534858-5.522285-2.56-2.56-5.558857-4.571429-2.962286-1.974857-6.290285-3.364571-3.328-1.389714-6.875429-2.084572-3.547429-0.731429-7.131429-0.731428H169.581714q-3.584 0-7.131428 0.731428-3.510857 0.731429-6.838857 2.084572-3.328 1.389714-6.326858 3.364571-2.998857 2.011429-5.558857 4.571429-2.56 2.56-4.534857 5.522285-2.011429 2.998857-3.401143 6.326857-1.353143 3.328-2.084571 6.875429-0.694857 3.510857-0.694857 7.131429 0 3.584 0.731428 7.131428 0.694857 3.510857 2.048 6.838857 1.389714 3.328 3.401143 6.326857 1.974857 2.998857 4.534857 5.558858 2.56 2.56 5.558857 4.534857 2.998857 2.011429 6.326858 3.401143 3.291429 1.353143 6.838857 2.048 3.547429 0.731429 7.131428 0.731428zM169.581714 803.474286h682.678857q3.584 0 7.131429-0.658286 3.547429-0.731429 6.875429-2.084571 3.291429-1.389714 6.290285-3.401143 2.998857-1.974857 5.558857-4.534857 2.56-2.56 4.534858-5.522286 2.011429-2.998857 3.401142-6.326857 1.389714-3.328 2.084572-6.875429 0.694857-3.547429 0.694857-7.131428 0-3.620571-0.731429-7.131429-0.658286-3.547429-2.048-6.875429-1.389714-3.291429-3.401142-6.326857-1.974857-2.998857-4.534858-5.522285-2.56-2.56-5.558857-4.571429-2.962286-1.974857-6.290285-3.364571-3.328-1.389714-6.875429-2.084572-3.547429-0.731429-7.131429-0.731428H169.581714q-3.584 0-7.131428 0.731428-3.510857 0.731429-6.838857 2.084572-3.328 1.389714-6.326858 3.364571-2.998857 2.011429-5.558857 4.571429-2.56 2.56-4.534857 5.522285-2.011429 2.998857-3.401143 6.326857-1.353143 3.328-2.084571 6.875429-0.694857 3.510857-0.694857 7.131429 0 3.584 0.731428 7.131428 0.694857 3.547429 2.048 6.875429 1.389714 3.291429 3.401143 6.326857 1.974857 2.962286 4.534857 5.522286 2.56 2.56 5.558857 4.534857 2.998857 2.011429 6.326858 3.401143 3.291429 1.389714 6.838857 2.084571 3.547429 0.694857 7.131428 0.694857z"
        fill={getIconColor(color, 0, "#ffc100")}
      />
    </svg>
  );
};

ADropDownmenu.defaultProps = {
  size: 18,
};

export default ADropDownmenu;
