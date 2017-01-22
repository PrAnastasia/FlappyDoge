let gulp = require('gulp'),
	watch = require('gulp-watch');
let less = require('gulp-less');
let replace = require('gulp-replace');
let rename = require('gulp-rename');
let sourceMaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let exorcist = require('exorcist');
let browserify = require('browserify');
let debowerify = require('debowerify');
let tsify = require('tsify');
let uglifyJs = require('gulp-uglify');
let uglifyCss = require('gulp-minify-css');
let nodemon = require('gulp-nodemon');
let notify = require('gulp-notify');
let livereload = require('gulp-livereload');
let typedoc = require("gulp-typedoc");

let config = {
	bowerDir: __dirname + '/bower_components',
	applicationDir: __dirname + '/app',
	stylesDir: __dirname + '/styles',
	publicDir: __dirname + '/public'
};


// ====== APPLICATION


/**
 * Compile ts files to js and save result to public directory
 */
gulp.task('compile-js', function() {
	let bundler = browserify({
			basedir: config.applicationDir,
			debug: true
		})
		.add(config.applicationDir + '/index.ts')
		.plugin(tsify)
		.transform(debowerify);
		//.require("../bower_components/phaser/build/phaser.min.js");

	return bundler.bundle()
		.pipe(exorcist(config.publicDir + '/application.js.map'))
		.pipe(source('application.js'))
		.pipe(gulp.dest(config.publicDir));
});


/**
 * Minify result js file
 */
gulp.task('uglify-js', ['compile-js'], function() {
	return gulp.src(config.publicDir + '/application.js')
		.pipe(uglifyJs())
		.pipe(rename('application.min.js'))
		.pipe(gulp.dest(config.publicDir));
});


// ====== STYLES


/**
 * Compile less styles to css and save result to public directory
 */
gulp.task('compile-css', function() {
	return gulp.src(config.stylesDir + '/index.less')
		.pipe(sourceMaps.init())
		.pipe(less({paths: [config.stylesDir]}))
		.pipe(replace('../fonts/glyphicons', './fonts/bootstrap/glyphicons'))       // set right paths to bootstrap fonts
		.pipe(rename('style.css'))                                                  // rename must be before source maps call
		.pipe(sourceMaps.write('.'))                                                // must be relative to public directory
		.pipe(gulp.dest(config.publicDir));
});


/**
 * Minify result css file
 */
gulp.task('uglify-css', ['compile-css'], function() {
	return gulp.src(config.publicDir + '/style.css')
		.pipe(uglifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest(config.publicDir));
});


// ====== FONTS


/**
 * Copy bootstrap fonts to public directory
 */
gulp.task('fonts-bootstrap', function() {
	return gulp.src(config.bowerDir + '/bootstrap/fonts/*')
		.pipe(gulp.dest(config.publicDir + '/fonts/bootstrap'));
});


/**
 * Copy all fonts to public directory
 */
gulp.task('fonts', ['fonts-bootstrap']);

//--------------------------------------
 
gulp.task("typedoc", function() {
    return gulp
        .src(["app/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs) 
            module: "commonjs",
            target: "es5",
            includeDeclarations: true,
 
            // Output options (see typedoc docs) 
            out: "./docs",
            theme: "minimal",
 
            // TypeDoc options (see typedoc docs) 
            name: "Flappy Doge Game",
            ignoreCompilerErrors: false,
            externalPattern: "bower_components/phaser/typescript/*.ts",
            excludeExternals: true,
            version: true
        }))
    ;
});

gulp.task('default', function () {
    gulp.run('fonts', 'typedoc', 'uglify-css', 'uglify-js');

    gulp.watch(config.applicationDir + '/**/*', function(event) {
        gulp.run('uglify-js');
    });

    gulp.watch(config.stylesDir  + '/**/*', function(event) {
        gulp.run('uglify-css');
    });

    livereload.listen();

    nodemon({
		// the script to run the app
		script: 'server.js',
		ext: 'js'
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('server.js')
			.pipe(livereload());
	})

});


 