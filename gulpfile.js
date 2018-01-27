var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReaplce = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var config = {
    esin: 'src/es/*.js',
    esout: 'src/js/',
    dist: 'dist/',
    src: 'src/',
    cssin: 'src/css/*.css',
    jsin: 'src/js/*.js',
    imgin: 'src/img/*.{jpg,jpeg,png,svg,gif,JPG}',
    htmlin: 'src/*.html',
    htmlpagesin: 'src/pages/*.html',
    scssin: 'src/scss/*.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'dist/img/',
    htmlout: 'dist/',
    scssout: 'src/css/',
    cssoutname: 'styles.css',
    jsoutname: 'script.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js'
};

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
    browserSync({server: config.src});

    gulp.watch([
        config.htmlin, config.htmlpagesin, config.jsin, config.scssin
    ], ['reload']);
    gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function() {
    return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 3 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
    return gulp.src(config.cssin)
      .pipe(concat(config.cssoutname))
      .pipe(cleanCSS())
      .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
    gulp.src(config.jsin)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat(config.jsoutname))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function() {
    return gulp.src(config.imgin)
      .pipe(changed(config.imgout))
      .pipe(imagemin())
      .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function() {
    return gulp.src(config.htmlin)
    .pipe(htmlReaplce({'css': config.cssreplaceout, 'js': config.jsreplaceout}))
    .pipe(htmlMin({sortAttributes: true, sortClassName: true, collapseWhitespace: true}))
    .pipe(gulp.dest(config.dist))
});

gulp.task('libs', function () {
   return gulp.src('src/libs/**')
      .pipe(gulp.dest('dist/libs'))
});
gulp.task('docs', function () {
   return gulp.src('src/docs/**')
      .pipe(gulp.dest('dist/docs'))
});
gulp.task('fonts', function () {
   return gulp.src('src/fonts/**')
      .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
    return del([config.dist]);
});

gulp.task('build', function() {
    sequence('clean', ['html', 'css', 'img', 'js', 'libs', 'fonts', 'docs']);
});

gulp.task('default', ['serve']);
