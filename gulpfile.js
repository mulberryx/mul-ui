var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify'); 
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var sequence = require('gulp-sequence');
var proxy = require('http-proxy-middleware');

var browserSync = require('browser-sync');
var pkg = require('./package.json');

var yargs = require('yargs')
    .options({
        'w': {
            alias: 'watch',
            type: 'boolean'
        },
        's': {
            alias: 'server',
            type: 'boolean'
        },
        'p': {
            alias: 'port',
            type: 'number'
        }
    }).argv;

var dist = {
    dev: __dirname + '/assets',
    prod: __dirname + '/assets'
};

gulp.task('build:libs', function (){
    return gulp.src('src/libs/**/**')
        .pipe(gulp.dest(dist.dev + '/libs'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:app:assets', function (){
    return gulp.src('src/images/**/**.?(png|jpg|gif)')
        .pipe(gulp.dest(dist.dev + '/images'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:app:js', function (){
    return gulp.src(['src/js/common.js', 
                     'src/js/app.js', 
                     'src/js/pages/user.js', 
                     'src/js/pages/evaluate.js', 
                     'src/js/pages/results.js', 
                     'src/js/pages/result-details.js', 
                     'src/js/pages/evaluate-steps.js'])
        .pipe(concat('app.js'))
        .pipe(plumber())
        .pipe(gulp.dest(dist.dev + '/js'));    
});

gulp.task('build:weui:less', function (){
    var banner = [
        '/*!',
        ' * WeUI v<%= pkg.version %> (<%= pkg.homepage %>)',
        ' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
        ' * Licensed under the <%= pkg.license %> license',
        ' */',
        ''].join('\n');

    return gulp.src('src/less/weui.less')
        .pipe(sourcemaps.init())
        .pipe(less().on('error', function (e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(sourcemaps.write())
        .pipe(plumber())
        .pipe(gulp.dest(dist.dev + '/css'));
});

gulp.task('build:app:less', function (){
    return gulp.src('src/less/app.less')
        .pipe(less().on('error', function (e){
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
        .pipe(nano({
            zindex: false,
            autoprefixer: false
        }))
        .pipe(plumber())
        .pipe(gulp.dest(dist.dev + '/css'));
});

gulp.task('build:html', function (){
    return gulp.src('src/index.html')
        .pipe(tap(function (file){
            var dir = path.dirname(file.path);
            var contents = file.contents.toString();

            contents = contents.replace(/<link\s+rel="import"\s+href="(.*)">/gi, function (match, $1){
                var filename = path.join(dir, $1);
                var id = path.basename(filename, '.html');
                var content = fs.readFileSync(filename, 'utf-8');
                return '<script type="text/html" id="tpl_'+ id +'">\n'+ content +'\n</script>';
            });

            file.contents = new Buffer(contents);
        }))
        .pipe(plumber())
        .pipe(gulp.dest(dist.dev));
});

gulp.task('build:version', function () {
    return gulp.src(dist.dev + '/index.html')
        .pipe(tap(function (file){
            var dir = path.dirname(file.path);
            var contents = file.contents.toString();
            var time = new Date().getTime();

            file.contents = new Buffer(contents.replace(/\?v=\d{13}/gi, '?v=' + time));
        }))
        .pipe(plumber())
        .pipe(gulp.dest(dist.dev))
        .pipe(browserSync.reload({stream: true}));
});

// 编译开发版本
gulp.task('build:app', sequence(['build:libs', 'build:weui:less', 'build:app:assets', 'build:app:less', 'build:app:js'], 'build:html', 'build:version');

// 监听
gulp.task('watch', ['build:app'], function () {
    gulp.watch('src/libs/**/**', ['build:libs']);
    gulp.watch('src/images/**/**.?(png|jpg|gif)', ['build:app:assets']);

    gulp.watch('src/less/**/**', sequence(['build:weui:less', 'build:app:less'], 'build:version');
    gulp.watch('src/js/**/**', sequence('build:app:js', 'build:version');
    gulp.watch('src/**/**.html', sequence('build:html', 'build:version');
});

// 编译正式版本
gulp.task('build:app:prod', ['build:app'], function () {
    gulp.src('src/libs/**/**')
        .pipe(gulp.dest(dist.prod + '/libs'))
        .pipe(browserSync.reload({stream: true}));

    gulp.src('src/images/**/**.?(png|jpg|gif)')
        .pipe(gulp.dest(dist.prod + '/images'))
        .pipe(browserSync.reload({stream: true}));

    gulp.src(dist.dev + '/js/**/**')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(plumber())
        .pipe(gulp.dest(dist.prod + '/js'));

    gulp.src(dist.dev + '/css/**/**')
        .pipe(nano({
            zindex: false,
            autoprefixer: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(plumber())
        .pipe(gulp.dest(dist.prod + '/css'));

    gulp.src(dist.dev + '/index.html')
        .pipe(tap(function (file){
            var dir = path.dirname(file.path);
            var contents = file.contents.toString();

            contents = contents.replace(/\.\/css\/app.css/gi, './css/app.min.css');
            contents = contents.replace(/\.\/css\/weui.css/gi, './css/weui.min.css');
            contents = contents.replace(/\.\/js\/app.js/gi, './js/app.min.js');            

            file.contents = new Buffer(contents);
        }))
        .pipe(htmlmin({collapseWhitespace: true, minifyJS: true, processScripts: ['text/html'], removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true}))
        .pipe(plumber())
        .pipe(gulp.dest(dist.prod));
});

// 启动服务
gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./assets",
            middleware: [
                proxy('/api', {
                    target: 'http://localhost:1337/',
                    changeOrigin: true
                })
            ]
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: '/'
    });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default', ['watch'], function () {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }
});
