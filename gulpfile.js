var gulp         = require('gulp');
var gutil        = require('gulp-util');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var cleanCSS     = require('gulp-clean-css');
var imagemin     = require('gulp-imagemin');
var cache        = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var ftp          = require('vinyl-ftp');
var del          = require('del');
var imageminJR   = require('imagemin-jpeg-recompress');
var imageminPng  = require('imagemin-pngquant');

//minify css/js
gulp.task('minify', ['minify-js', 'minify-css']);
gulp.task('minify-js', function() {
    return gulp.src([
        'libs/jquery.js',
        'js/test.js',
        'js/main.js', // всегда в конце
    ])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});
gulp.task('minify-css', function() {
    return gulp.src(['css/**/*.css', '!css/script.min.css'])
        .pipe(autoprefixer(['last 25 versions']))
        .pipe(concat('script.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('css'));
});

//build src application
gulp.task('build', ['remove-src', 'imagemin', 'minify-css', 'minify-js'], function() {
    gulp.src([
        '*.php',
        '*.js',
        '*.json',
        '.htaccess',
    ]).pipe(gulp.dest('src'));

    gulp.src([
        'css/script.min.css',
    ]).pipe(gulp.dest('src/css'));

    gulp.src([
        'js/script.min.js',
    ]).pipe(gulp.dest('src/js'));

    gulp.src([
        'fonts/**/*',
    ]).pipe(gulp.dest('src/fonts'));
});
gulp.task('remove-src', function() { return del.sync('src'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

// compress image
gulp.task('imagemin', function () {
    return gulp.src('img/**/*')
        .pipe(gulp.dest('src/img')) //Копируем изображения заранее, imagemin может пропустить парочку )
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imageminJR({
                progressive: true,
                max: 80,
                min: 70
            }),
            imageminPng({quality: '80'}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ])))
        .pipe(gulp.dest('src/img'));
});

//deploy src files on server
gulp.task('deploy', function() {

    var conn = ftp.create({
        host:      'host',
        user:      'user',
        password:  'password',
        parallel:  10,
        log: gutil.log
    });

    var globs = [
        'src/**',
        'src/.htaccess',
    ];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('path/to/folder/on/server'));

});