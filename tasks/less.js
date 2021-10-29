const gulp = require('gulp');

const less = require("gulp-less");
const path = require("path");
exports.fn = () => {
    return gulp
        .src("./source/less/**/*.less")
        .pipe(
            less({
                paths: [path.join(__dirname, "includes")],
            })
        )
        .pipe(gulp.dest("./public/css"));
};