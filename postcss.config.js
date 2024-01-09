/*
 * @LastEditors: John
 * @Date: 2024-01-09 09:16:54
 * @LastEditTime: 2024-01-09 09:18:46
 * @Author: John
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 37.5,
      propList: ["*"],
      exclude: (e) => {
        // console.log(e);
        if (/.*-m\.scss$/.test(e)) {
          // console.log(e);
          return false;
        }
        return true;
      },
    },
  },
};
