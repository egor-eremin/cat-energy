const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("gulp-clean");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const svgmin = require("gulp-svgmin");


// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return import("gulp-imagemin")
    .then(imagemin => {
      return gulp.src("source/img/**/*.{png,jpg,svg}")
        .pipe(imagemin.default([
          imagemin.mozjpeg({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo()
        ]))
        .pipe(gulp.dest("build/img"));
    })
    .catch(error => {
      console.error("Error importing gulp-imagemin:", error);
    });
}

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"));
}

exports.copyImages = copyImages;

// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
}

exports.createWebp = createWebp;

// Sprites

const createSprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(cheerio({
      run: $ => {
        $("[fill]").removeAttr("fill");
        $("[stroke]").removeAttr("stroke");
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace(/fill=["'].*?["']/g, ""))
    .pipe(replace(/stroke=["'].*?["']/g, ""))
    .pipe(svgmin({
      js2svg: {
        pretty: true,
        indent: '\t',
      },
      plugins: [
        {
          name: 'cleanupIDs',
          params: {
            minify: true,
            prefix: prefix + '-',
          },
        },
        'removeTitle',
        {
          name: 'removeViewBox',
          active: false,
        },
        'sortAttrs',
      ],
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.createSprite = createSprite;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.svg",
    "source/img/favicons/**/*",
    "!source/img/icons/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return gulp.src("build", { allowEmpty: true })
    .pipe(del());
}

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/*.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, sync.reload));
  gulp.watch("source/img/icons/**/*", gulp.series(createSprite, sync.reload));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    // createSprite,
    createWebp
  )
)

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    // createSprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
