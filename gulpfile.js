////////////////////////////////////////////////////////////////////////////////
// Gulp modules.
////////////////////////////////////////////////////////////////////////////////
var gulp = require("gulp");
var sass = require("gulp-sass");
var webserver = require('gulp-webserver');

////////////////////////////////////////////////////////////////////////////////
// Paths
////////////////////////////////////////////////////////////////////////////////
var srcPath = "source/";
var destPath = "build/";
var modulesPath = "node_modules/";

////////////////////////////////////////////////////////////////////////////////
// Tasks
////////////////////////////////////////////////////////////////////////////////

// Move HTML files.
gulp.task("html", function() {
  gulp.src(srcPath + "*.html")
    .pipe(gulp.dest(destPath));
});

// Move images.
gulp.task("images", function() {
  gulp.src(srcPath + "images/**/*")
    .pipe(gulp.dest(destPath + "images/"));
});

// Move JavaScript.
gulp.task("javascript", function() {
  gulp.src(srcPath + "javascript/**/*.js")
    .pipe(gulp.dest(destPath + "js"));
});

// Move Components.
gulp.task("components", function() {

  // jQuery.
  gulp.src(modulesPath + "jquery/dist/jquery.js")
    .pipe(gulp.dest(destPath + "components/jquery/"));

  // Bootstrap.
  gulp.src(modulesPath + "bootstrap/dist/**/*")
    .pipe(gulp.dest(destPath + "components/bootstrap/"));

  // Font-Awesome
  gulp.src(modulesPath + "font-awesome/css/*")
    .pipe(gulp.dest(destPath + "components/font-awesome/css/"));
  gulp.src(modulesPath + "font-awesome/fonts/*")
    .pipe(gulp.dest(destPath + "components/font-awesome/fonts/"));

  // Mustache.js
  gulp.src(modulesPath + "mustache/mustache.js")
    .pipe(gulp.dest(destPath + "components/mustache/"));

});

// Compile and move .scss.
gulp.task("scss", function() {
  gulp.src(srcPath + "stylesheets/*.scss")
    .pipe(sass())
    .pipe(gulp.dest(destPath + "css"));
});

// Fonts.
gulp.task("fonts", function() {
  gulp.src(srcPath + "fonts/**/*")
    .pipe(gulp.dest(destPath + "fonts/"));
});

// Webserver.
gulp.task("webserver", function() {
  gulp.src(destPath)
    .pipe(webserver({
      fallback: "index.html",
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

////////////////////////////////////////////////////////////////////////////////
// Watch Tasks.
////////////////////////////////////////////////////////////////////////////////

// Watch task
gulp.task("watch", function() {
  gulp.watch(srcPath + "*.html", ["html"]); // HTML files.
  gulp.watch(srcPath + "images/**/*", ["images"]); // Images.
  gulp.watch(srcPath + "javascript/**/*.js", ["javascript"]); // JavaScript.
  gulp.watch(srcPath + "stylesheets/_*.scss", ["scss"]); // SASS Partials.
  gulp.watch(srcPath + "stylesheets/*.scss", ["scss"]); // SASS Main.
});

////////////////////////////////////////////////////////////////////////////////
// Default Task.
////////////////////////////////////////////////////////////////////////////////
gulp.task("default", ["watch", "html", "scss", "images", "javascript" ,"components", "fonts", "webserver"]);
