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
          console.log(e);
          return false;
        }
        return true;
      },
    },
  },
};
