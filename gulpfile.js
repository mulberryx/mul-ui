/**
 * gulpfile
 * @author Philip
 */

const path = require("path")
const fs = require("fs")

const gulp = require("gulp")
const less = require("gulp-less")
const header = require("gulp-header")
const tap = require("gulp-tap")
const nano = require("gulp-cssnano")
const postcss = require("gulp-postcss")
const autoprefixer = require("autoprefixer")
const rename = require("gulp-rename")
const concat = require("gulp-concat")
const sourcemaps = require("gulp-sourcemaps")
const uglify = require("gulp-uglify") 
const htmlmin = require("gulp-htmlmin")
const plumber = require("gulp-plumber")
const sequence = require("gulp-sequence")
const proxy = require("http-proxy-middleware")

const browserSync = require("browser-sync")
const pkg = require("./package.json")

const yargs = require("yargs")
  .options({
    "w": {
      alias: "watch",
      type: "boolean"
    },
    "s": {
      alias: "server",
      type: "boolean"
    },
    "p": {
      alias: "port",
      type: "number"
    }
  }).argv

const DevDir = __dirname + "/build/dev"
const ProdDir = __dirname + "/build/prod"

// 构建图片
gulp.task("build:images", () => {
  return gulp.src("src/images/**/**.?(png|jpg|gif)")
             .pipe(gulp.dest(DevDir + "/images"))
             .pipe(browserSync.reload({stream: true}))
})

// 构建脚本
gulp.task("build:js", () => {
  return gulp.src(["src/js/common.js", 
                   "src/js/index.js", 
                   "src/js/pages/user.js", 
                   "src/js/pages/evaluate.js", 
                   "src/js/pages/results.js", 
                   "src/js/pages/result-details.js", 
                   "src/js/pages/evaluate-steps.js"])
      .pipe(concat("app.js"))
      .pipe(plumber())
      .pipe(gulp.dest(DevDir + "/js"))    
})

// 构建样式
gulp.task("build:less", () => {
  var banner = [
      "/*!",
      " * WeUI v<%= pkg.version %> (<%= pkg.homepage %>)",
      " * Copyright <%= new Date().getFullYear() %> Tencent, Inc.",
      " * Licensed under the <%= pkg.license %> license",
      " */",
      ""].join("\n")

  return gulp.src("src/less/weui.less")
      .pipe(sourcemaps.init())
      .pipe(less().on("error", (e) => {
          console.error(e.message)
          this.emit("end")
      }))
      .pipe(postcss([autoprefixer(["iOS >= 7", "Android >= 4.1"])]))
      .pipe(header(banner, { pkg : pkg } ))
      .pipe(sourcemaps.write())
      .pipe(plumber())
      .pipe(gulp.dest(DevDir + "/css"))
})

// 构建html
gulp.task("build:html", () => {
  return gulp.src('./usage/*.ejs')
    .pipe(ejs({
      msg: 'Hello Gulp!',
    }, {

    }, {
      ext: '.html' 
    }))
    .pipe(gulp.dest('./dist'))
})

// 构建版本
gulp.task("build:version", () => {
  return gulp.src(DevDir + "/index.html")
    .pipe(tap(function (file){
      var dir = path.dirname(file.path)
      var contents = file.contents.toString()
      var time = new Date().getTime()

      file.contents = new Buffer(contents.replace(/\?v=\d{13}/gi, "?v=" + time))
    }))
    .pipe(plumber())
    .pipe(gulp.dest(dist.dev))
    .pipe(browserSync.reload({
      stream: true,
    }))
})

// 编译开发版本
gulp.task("build", sequence(["build:less", "build:assets", "build:less", "build:js"], "build:html", "build:version")

// 编译正式版本
gulp.task("build:prod", ["build"], () => {
  gulp.src("src/images/**/**.?(png|jpg|gif)")
      .pipe(gulp.dest(dist.prod + "/images"))
      .pipe(browserSync.reload({stream: true}))

  gulp.src(dist.dev + "/js/**/**")
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min"
      }))
      .pipe(plumber())
      .pipe(gulp.dest(dist.prod + "/js"))

  gulp.src(dist.dev + "/css/**/**")
      .pipe(nano({
        zindex: false,
        autoprefixer: false
      }))
      .pipe(rename((path) => {
        path.basename += ".min"
      }))
      .pipe(plumber())
      .pipe(gulp.dest(dist.prod + "/css"))
})

// 监听
gulp.task("watch", [], () => {
  gulp.watch("src/images/**/**.?(png|jpg|gif)", ["build:assets"])

  gulp.watch("src/less/**/**", sequence("build:less", "build:version")
  gulp.watch("src/js/**/**", sequence("build:js", "build:version")
  gulp.watch("src/**/**.html", sequence("build:html", "build:version")
})

// 启动服务
gulp.task("server", function () {
  yargs.p = yargs.p || 8080
  browserSync.init({
    server: {
      baseDir: "./assets",
      middleware: [
        proxy("/api", {
          target: "http://localhost:8080/",
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
    startPath: "/"
  })
})

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task("default", ["watch"], () => {
  gulp.run("build")

  if (yargs.s) {
    gulp.start("server")
  }

  if (yargs.w) {
    gulp.start("watch")
  }
})
