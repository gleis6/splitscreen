const { src, dest, watch, task, series } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const uglify = require('gulp-uglify');
const gutil = require( 'gulp-util' );
const ftp = require( 'vinyl-ftp' );
const confirm = require('gulp-confirm');
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

task('js_compiling', function () {
    return js_compiling_F();
});

function js_compiling_F() {
    return src(jsFiles)
        .pipe(concat('all.js'))
        .pipe(dest('./web/assets/js'));
}

// DEFAULT: Kompilliere ein mal
task('default', series('js_compiling', 'css_compiling', 'sass_compiling'));

// DEV: Starte alle watchers
//task('dev', function () {
    watch('./src/sass/**/*.scss', series('sass_compiling'));
    watch('./src/sass/*.css', series('css_compiling'));
    watch('./src/js/*.js', series('js_compiling'));
//});

// SCRIPTS: Kompilliere ein mal
task('scripts', function() {
    return series('js_compiling', 'css_compiling', 'sass_compiling');
});

// DEPLOY: Lade die Scripte auf den Server
task('deploy', function () {
    var conn = ftp.create( {
        host:     'vsa-wumefo.cyon.net',
        user:     'daktivtl',
        password: 'OaWKnIw4Nc0UokNQKK2a',
        parallel: 4,
        log:      gutil.log
    } );
    var globs = ['web/assets/**', 'templates/**'];
    return src( globs, { base: '.', buffer: false } )
        .pipe(confirm({
            // Static text.
            question: 'Dieser Befehl lädt alle Fiels auf den Server. Continue?',
            input: '_key:y'
        }))
        .pipe( conn.newer( '/public_html/homepage' ) ) // only upload newer files
        .pipe( conn.dest( '/public_html/homepage' ) );
});