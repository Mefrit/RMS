const gulp = require('gulp');

const config = require('./config');

exports.fn = gulp.series(['less', () => {
    gulp.watch(config.source.styles, gulp.series(['less']));
    gulp.watch(config.source.ts.concat('!source/typescript/css/**/*'), gulp.series(['script']));
    gulp.watch(config.source.nodejs.concat('!source/typescript/css/**/*'), gulp.series(['server']));
}]);