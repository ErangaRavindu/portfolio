var gulp, sass, sourceMaps, browserSync, autoprefixer, concat, uglifyCss, sassdoc, gzip, svgSprite;
var autoPrefixBrowserList = ['last 2 version'];

gulp        = require('gulp');
browserSync = require('browser-sync').create();
sass        = require('gulp-sass');
autoprefixer = require('gulp-autoprefixer');
sourceMaps  = require('gulp-sourcemaps');
concat = require('gulp-concat');
uglifyCss = require('gulp-uglifycss');
sassdoc = require('sassdoc');
gzip = require('gulp-gzip');
svgSprite = require('gulp-svg-sprite');


// Static Server + watching scss/html files
gulp.task('serve', function() {

    browserSync.init({
        server: "./public",
        ghostMode: false,
        port: 9004,
        ui: {
            port: 9004
        }
    });

    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("public/**/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/init.scss")
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade:  true
        }))
        .pipe(sourceMaps.write())
        .pipe(concat('style.css'))
        .pipe(gulp.dest("public/css"))
        .pipe(browserSync.stream());
});
gulp.task('svg-icons', function () {
    // More complex configuration example
    var config = {
        shape: {
            id: {

            },
            dimension: { // Set maximum dimensions
                maxWidth: 21,
                maxHeight: 21
            },
            spacing: { // Add padding
                padding: 0
            },
            // dest: 'out/intermediate-svg' // Keep the intermediate files
        },
        mode: {
            symbol: {
                sprite: 'icons.svg',
                dest: 'svg',
                prefix: "svg-%s",
                example: true
            }
        },
        svg: {
            xmlDeclaration: false, // strip out the XML attribute
            doctypeDeclaration: false // don't include the !DOCTYPE declaration
        }
    };
    return  gulp.src('**/*.svg', { cwd: 'public/assets/svg-icons' })
        .pipe(svgSprite(config))
        .pipe(gulp.dest('public/assets'));
});
gulp.task('default', ['sass', 'serve']);
