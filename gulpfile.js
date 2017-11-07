/**
 * Created by SKIff on 08.06.15.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// var minify = require('gulp-minify');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');


gulp.task('sass', function() {
    return gulp.src('./sass/main.scss')
        .pipe(plumber())
        .pipe(sass()
            .on('error', sass.logError)
        )
        .pipe(autoprefixer({
            browsers: ['last 5 versions', 'opera 12', '> 1% in RU', 'ie 8']
        }))
        .pipe(gulp.dest('./css'));
});

// gulp.task('js', function(){
//     return gulp.src('./js/app.js')
//         .pipe(plumber())
//         .pipe(minify())
//         .pipe(gulp.dest('./js'))
//         .pipe(notify('JavaScript minified'));
// });

gulp.task('watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
    //gulp.watch('./js/app.js', ['js']);
});
