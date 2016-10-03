// Requiring Gulp
var gulp = require('gulp');

// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var $            = require('gulp-load-plugins')();
var runSequence  = require('run-sequence');
var del          = require('del');
var reload       = browserSync.reload;
var argv         = require('yargs').argv;
var lazypipe     = require('lazypipe');

var gutil = require('gulp-util');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});


/* vars */
var appPath = './src';
var distPath = 'dist';


var sassPath = appPath + '/sass/';
var jsSrcPath = appPath + '/js/';

var jsDistPath = distPath + '/js/';

var config = {
  defaultPort: 3000,
  supportedBrowsers: [
    'ie >= 9',
    'last 1 Firefox versions',
    'last 1 Chrome versions',
    'Safari >= 6',
    'iOS >= 6',
    'ChromeAndroid >= 4.2'
  ],
  version: require('./package.json').version,
  minify: argv.minify || false
};

// Clean site directory
gulp.task('clean', del.bind(null, ['dist'], {dot: true}));

gulp.task('styles', function() {
  gulp.src('src/sass/**/*.scss')
  	.pipe(sourcemaps.init()) // Initialize sourcemap plugin
    .pipe(sass()) 
    .pipe(autoprefixer()) // Passes it through gulp-autoprefixer 
    .pipe(sourcemaps.write()) // Writing sourcemaps 
    .pipe(gulp.dest('dist/css')) // Outputs it in the css folder
    // Reloading the stream
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', function () {
    return  gulp.src( appPath + '/fonts/*.ttf' )
        .pipe(gulp.dest( 'dist/css/fonts' ))
        .pipe(browserSync.reload({
          stream: true
        }));
});

gulp.task('copy-folders', function() {
  return  gulp.src( appPath + '/**/*.*' )
    .pipe(gulp.dest( 'dist/' ))
    .pipe(browserSync.reload({
      stream: true
    }));
  });

gulp.task('pages', function () {
    return  gulp.src( appPath + '/*.html' )
        .pipe(gulp.dest( distPath ))
        .pipe(browserSync.reload({
          stream: true
        }));
});


var scriptsFinish = lazypipe()
  .pipe(gulp.dest, 'dist/js/')
  .pipe(function () {
    return $.if(config.minify, $.uglify());
  })
  .pipe(function () {
    return $.if(config.minify, $.rename({suffix: '.min'}));
  })
  .pipe(function () {
    return $.if(config.minify, gulp.dest(jsDistPath));
  });

gulp.task('libs', function() {
  return gulp.src(jsSrcPath + '/libs/*.js')
  .pipe(gulp.dest(jsDistPath + '/libs'))
});


// Lint and build scripts
gulp.task('scripts', ['libs'], function() {
  return gulp.src(jsSrcPath + '*.js')
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.if(config.isWatching, $.jshint()))
    .pipe($.if(config.isWatching, $.jshint.reporter('jshint-stylish')))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
    .pipe($.concat('scripts.js'))
    .pipe(scriptsFinish());
});

// Optimize images and copy that version to dist
// if the script is run with the --minify flag
gulp.task('images', function () {
  return gulp.src(['src/images/**/**'])
    .pipe($.plumber({errorHandler: $.notify.onError('Error: <%= error.message %>')}))
    .pipe($.if(config.isWatching, $.cached('images')))
    .pipe($.if(config.minify, $.cache($.imagemin({
      progressive: true,
      interlaced: true
    }))))
    .pipe(gulp.dest('dist/images'));
});



gulp.task('setWatch', function() {
  config.isWatching = true;
});

// Development task
gulp.task('dev', ['default', 'setWatch'], function() {
  browserSync({
    port: argv.port || config.defaultPort, //default: 3000
    server: { baseDir: './dist/'},
    ui: {
      port: argv.port + 5000 || config.defaultPort + 5000, //default: 8000
      weinre: { port: argv.port + 6092 || config.defaultPort + 6092 } //default: 9092
    },
    notify: false,
    logLevel: 'silent' //other oprions: info, debug
  });

  gulp.watch(['src/sass/**/*.scss'], ['styles', reload]);
  gulp.watch(['src/**/*.html'], ['pages', reload]);
  gulp.watch(['src/img/**/*'], ['images', reload]);
  gulp.watch(['src/js/**/*.js'], ['scripts', reload]);
});

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {

  runSequence([
      'pages',
      'copy-folders',
      'styles',
      'fonts',
      'scripts',
      'images',
    ], cb);
});