/**
 * @Author: ManKeung
 * @Date: 2018-07-31
 */

// 在gulpfile中先载入gulp包，因为这个包提供一些API
const gulp = require('gulp');

// 1. scss编译 压缩
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const auto = require('gulp-autoprefixer');

gulp.task('style', () => {

  return gulp.src('./src/styles/*.scss') // 引入文件
    .pipe(sass().on('error', sass.logError)) // scss 编译成 css 有错输出
    .pipe(auto({
      browsers: ['last 2 versions'],
      cascade: false
    })) // css 兼容
    .pipe(cssnano()) // css 压缩
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 2. ES6转ES5 合并 压缩混淆
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// 自己写的方法合并
gulp.task('public', () => {

  return gulp.src(['./src/scripts/public/main.js', './src/scripts/public/own.js'])
    .pipe(babel({
      presets: ['env']
    })) // es6 转 es5
    .pipe(concat('mk-1.0.0.min.js')) // 合并
    .pipe(uglify()) // 混淆
    .pipe(gulp.dest('./dist/js/pub'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 单页js
gulp.task('business', () => {

  return gulp.src('./src/scripts/business/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/bus'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 第三方框架
gulp.task('plugins', () => {

  return gulp.src('./src/plugins/**/**/*.*')
    .pipe(gulp.dest('./dist/plu'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 3. 图片复制 压缩
const imagemin = require('gulp-imagemin');

gulp.task('image', () => {

  return gulp.src('./src/images/**/*.{png,jpg,gif,jpeg,svg}')
    .pipe(imagemin({
      optimizationLevel: 5, // 类型： Number 默认： 3 取值范围： 0 -7 （优化等级）
      progressive: true, // 类型： Boolean 默认： false 无损压缩jpg图片
      interlaced: true, // 类型： Boolean 默认： false 隔行扫描gif进行渲染
      multipass: true // 类型： Boolean 默认： false 多次优化svg值到完美优化
    }))
    .pipe(gulp.dest('./dist/img'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 4. html 压缩
const htmlmin = require('gulp-htmlmin');

gulp.task('html', () => {

  return gulp.src('./src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    })) // 压缩html
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// html其他
gulp.task('view', () => {

  return gulp.src('./src/views/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/views'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// 5. font 字体图标
gulp.task('font', () => {

  return gulp.src('./src/*.*')
    .pipe(gulp.dest('./dist/font'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// 6. 服务
const browserSync = require('browser-sync'); // 服务

gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: ['dist'] // 服务器根目录
    },
  }, (err, bs) => {
    console.log(bs.options.getIn(["urls", "local"]));
  });

  gulp.watch('./src/styles/*.scss', ['style']);
  gulp.watch('./src/scripts/public/*.js', ['public']);
  gulp.watch('./src/scripts/business/*.js', ['business']);
  gulp.watch('./src/scripts/plugins/**/**/*.*', ['plugins']);
  gulp.watch('./src/images/**/*.{png,jpg,gif,jpeg}', ['image']);
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/views/*.html', ['view']);
  gulp.watch('./src/font/*.*', ['font']);
});
