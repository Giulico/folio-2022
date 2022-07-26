const path = require("path");

module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-flexbugs-fixes"),
    require("postcss-for"),
    require("postcss-hexrgba"),
    require("postcss-mixins")({
      mixinsDir: path.resolve(__dirname, "src/styles/mixins"),
    }),
    require("postcss-simple-vars"),
    require("postcss-nested"),
    require("postcss-preset-env")({
      stage: 0,
      features: {
        "nesting-rules": true,
        "custom-properties": {
          disableDeprecationNotice: true,
        },
      },
      importFrom: ["src/styles/config/colors.css"],
    }),
  ],
};
