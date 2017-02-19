var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');

//--------DEVELOPMENT PROCESS ----------------------
gulp.task('sass',function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) //Using gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
})


//--- group task to execute every development task
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss',['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})
//-------------------  END   --------------------------


//---------------OPTIMIZATION PROCESS------------------

//--------------------  END   --------------------------

gulp.task('build',function(callback){
  runSequence('clean:dist','sass', 'browserify', 'useref','data', callback)
})

//---- Task to be executed with only gulp command  ----
gulp.task('default', function(callback){
  runSequence(['sass','browserSync','watch'],callback)
})

gulp.task('serve', function(){
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
})