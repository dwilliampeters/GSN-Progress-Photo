// include gulp
var gulp = require('gulp'),
    // include plug-ins
    fileinclude = require('gulp-file-include'),
    jshint      = require('gulp-jshint'),
    changed     = require('gulp-changed'),
    imagemin    = require('gulp-imagemin'),
    concat      = require('gulp-concat'),
    stripDebug  = require('gulp-strip-debug'),
    uglify      = require('gulp-uglify'),
    autoprefix  = require('gulp-autoprefixer'),
    minifyCSS   = require('gulp-minify-css'),
    sass        = require('gulp-sass'),
    watch       = require('gulp-watch');

// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/img/**/*',
      imgDst = './app/img';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// File include
gulp.task('fileinclude', function() {
  gulp.src(['./src/html/views/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./app'));
});

// Fonts task
gulp.task('fonts', function() {
  gulp.src('./src/font/*')
    .pipe(gulp.dest('./app/font/'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('./src/js/vendor/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest('./app/js/vendor/'));

  gulp.src(['./src/js/components/*.js','./src/js/modules/*.js','./src/js/*.js'])
    .pipe(concat('app.js'))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(gulp.dest('./app/js/'));
});

// Sass task
gulp.task('sass', function () {
  gulp.src('./src/scss/**/*.scss')
    .pipe(sass( { errLogToConsole: true, includePaths : ['./src/scss']} ))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./app/css'));
});

// default gulp task
gulp.task("default", ["fileinclude", "imagemin", "fonts", "scripts", "sass"], function() {

  // watch for IMG changes
  watch('./src/img/**/*', function () {
    gulp.start("imagemin");
  });

  // watch for JS changes
  watch('./src/js/**/*.js', function () {
    gulp.start("scripts");
  });

  // watch for CSS changes
  watch('./src/scss/**/*.scss', function () {
    gulp.start("sass");
  });

  // watch for HTML changes
  watch('./src/html/**/*.html', function () {
    gulp.start("fileinclude");
  });
});
