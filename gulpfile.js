const gulp = require('gulp');

/*gulp.task('dev', function() {
    tsProject.config.noEmitOnError = false;
});*/

const tasks = ['script', 'server', 'less', 'watch'];

tasks.forEach(task => {
    //    console.log('init task:', task);
    var t = require('./tasks/' + task);
    console.log(task);
    gulp.task(task, t.fn);
});

// css после завершения задачи запускает script 
// haxe после завершения задачи запускает swf-copyw
gulp.task('default', gulp.series(['script', 'server', 'less', 'watch' /*, 'script'*/ ]));
// gulp.task('build', gulp.series(['css', /*'script',*/ 'vendor', 'optimize']));