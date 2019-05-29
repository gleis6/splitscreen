const { src, dest, watch, task, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');


task('sass_compiling', function () {
    return sass_compiling_F();
});

function sass_compiling_F() {
    return src('src/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
            .pipe(postcss([ autoprefixer() ]))
            .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist'));
}

// DEFAULT: Kompilliere ein mal
task('default', series('sass_compiling'));

// DEV: Starte alle watchers
task('dev', function () {
    watch('./src/sass/**/*.scss', series('sass_compiling'));
});