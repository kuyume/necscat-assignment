import gulp from 'gulp'
import browserSync from 'browser-sync'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import autoPrefixer from 'gulp-autoprefixer'
import cssComb from 'gulp-csscomb'
import ejs from 'gulp-ejs'
import rename from 'gulp-rename'
import imageMin from 'gulp-imagemin'
import cache from 'gulp-cache'
import babel from 'gulp-babel'
import { deleteSync } from 'del'

const publicPath = 'dist'

const sassCompile = () => {
  return gulp
    .src(['src/scss/**/*.scss', '!src/scss/**/_*.scss'])
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(gulp.dest(`${publicPath}/css`))
    .pipe(browserSync.stream({ stream: true }))
}
const jsTranspile = () => {
  return gulp
    .src('src/js/**/*.js')
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(gulp.dest(`${publicPath}/js`))
    .pipe(browserSync.stream({ stream: true }))
}
const ejsCompile = () => {
  return gulp
    .src(['src/**/*.ejs', '!src/**/_*.ejs'])
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(publicPath))
    .pipe(browserSync.stream({ stream: true }))
}
const imageMinimize = () => {
  return gulp
    .src('src/images/**/*')
    .pipe(cache(imageMin()))
    .pipe(gulp.dest(`${publicPath}/images`))
    .pipe(browserSync.stream({ stream: true }))
}

const server = () => {
  browserSync({
    server: {
      baseDir: publicPath,
    },
    // proxy: 'localhost/site1',
  })
}

const watch = () => {
  gulp.watch('src/js/**/*.js', jsTranspile)
  gulp.watch('src/scss/**/*.scss', sassCompile)
  gulp.watch('src/**/*.ejs', ejsCompile)
  gulp.watch('src/images/**/*', imageMinimize)
}

export default gulp.parallel(watch, server)

const distInitialize = (done) => {
  deleteSync([`${publicPath}/**`])
  jsTranspile()
  sassCompile()
  ejsCompile()
  imageMinimize()
  done()
}

export const build = distInitialize
