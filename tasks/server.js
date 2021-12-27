const gulp = require("gulp");
const config = require("./config");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./nodetsconfig.json");
const maps = require("gulp-sourcemaps");

exports.fn = (done) => {
    return gulp
        .src(config.source.nodejs)
        .pipe(maps.init())
        .pipe(tsProject())
        .on("error", function (error) {
            done();
        })
        .pipe(maps.write("maps"))
        .pipe(gulp.dest(config.output.nodejs));
};
