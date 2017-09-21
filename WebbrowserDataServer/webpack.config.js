// https://webpack.js.org/configuration/
// const path = require('path');
// path.resolve(__dirname, "dist"), // string
// TODO : try to use it, using PHP for now, with : php -S localhost:8000 -t build
// => not well configured yet, ok with php for imediate purpose

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "build"),
        //compress: true,
        port: 9000,
    }
};
