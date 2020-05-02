'use strict';

const gulp = require('gulp');

// CSS related plugins.
const sass = require( 'gulp-sass' ); // Gulp plugin for Sass compilation.
const minifycss = require( 'gulp-uglifycss' ); // Minifies CSS files.
const autoprefixer = require( 'gulp-autoprefixer' ); // Autoprefixing magic.
const mmq = require( 'gulp-merge-media-queries' ); // Combine matching media queries into one.

// JS related plugins.
const concat = require( 'gulp-concat' ); // Concatenates JS files.
const uglify = require( 'gulp-uglify' ); // Minifies JS files.
const babel = require( 'gulp-babel' ); // Compiles ESNext to browser compatible JS.

// Image related plugins.
const imagemin = require( 'gulp-imagemin' ); // Minify PNG, JPEG, GIF and SVG images with imagemin.

const svgmin = require("gulp-svgmin");
const svgSprite = require('gulp-svg-sprite');

const rename = require( 'gulp-rename' ); // Renames files E.g. style.css -> style.min.css.
const lineec = require( 'gulp-line-ending-corrector' ); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
const sourcemaps = require( 'gulp-sourcemaps' ); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css).
const notify = require( 'gulp-notify' ); // Sends message notification to you.
const browserSync = require( 'browser-sync' ).create(); // Reloads browser and injects CSS. Time-saving synchronized browser testing.
const remember = require( 'gulp-remember' ); //  Adds all the files it has ever seen back into the stream.
const plumber = require( 'gulp-plumber' ); // Prevent pipe breaking caused by errors from gulp plugins.
const beep = require( 'beepbeep' );
const include = require('gulp-include');
const del = require('del');

        // gutil         = require('gulp-util' ),
        // sass          = require('gulp-sass'),
        // browserSync   = require('browser-sync'),
        // concat        = require('gulp-concat'),
        // uglify        = require('gulp-uglify'),
        // cleancss      = require('gulp-clean-css'),
        // rename        = require('gulp-rename'),
        // autoprefixer  = require('gulp-autoprefixer'),
        // notify        = require('gulp-notify'),
        // rsync         = require('gulp-rsync'),
        // svgSprite     = require('gulp-svg-sprite'),
        // svgmin        = require('gulp-svgmin');

const config = {
    // productURL: './', // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.
    baseDir: 'app/dist/',
    browserAutoOpen: false,
    injectChanges: true,

    styleSRC: 'app/src/scss/**/*.scss', // Path to main .scss file.
    styleDestination: 'app/dist/css/', // Path to place the compiled CSS file. Default set to root folder.
    outputStyle: 'expanded', // Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
    errLogToConsole: true,
    precision: 10,

    // JS Vendor options.
    jsVendorSRC: 'app/src/js/vendor/*.js', // Path to JS vendor folder.
    jsVendorDestination: 'app/dist/js/', // Path to place the compiled JS vendors file.
    jsVendorFile: 'vendor', // Compiled JS vendors file name. Default set to vendors i.e. vendors.js.

    // JS Custom options.
    jsCustomSRC: 'app/src/js/common/*.js', // Path to JS custom scripts folder.
    jsCustomDestination: 'app/dist/js/', // Path to place the compiled JS custom scripts file.
    jsCustomFile: 'main', // Compiled JS custom file name. Default set to custom i.e. custom.js.

    // Images options.
    imgSRC: 'app/src/img/**/*', // Source folder of images which should be optimized and watched. You can also specify types e.g. raw/**.{png,jpg,gif} in the glob.
    imgDST: 'app/dist/img/', // Destination folder of optimized images. Must be different from the imagesSRC folder.

    svgSRC: 'app/src/icons/**/*.svg',
    svgDST: 'app/dist/icons/',

    htmlSRC: 'app/src/*.html',
    htmlDST: 'app/dist/',
    htmlParts: 'app/src/parts/',

    fontsSRC: 'app/src/fonts/**/*',
    fontsDST: 'app/dist/fonts/',

    // Watch files paths.
    watchStyles: 'app/src/scss/**/*.scss', // Path to all *.scss files inside css folder and inside them.
    watchJsVendor: 'app/src/js/vendor/*.js', // Path to all vendor JS files.
    watchJsCustom: 'app/src/js/common/*.js', // Path to all custom JS files.
    watchHtml: 'app/src/**/*.html',

    // Translation options.
    // textDomain: 'xstyle', // Your textdomain here.
    // translationFile: 'xstyle.pot', // Name of the translation file.
    // translationDestination: './languages', // Where to save the translation files.
    // packageName: 'xstyle', // Package name.
    // bugReport: 'https://AhmadAwais.com/contact/', // Where can users report bugs.
    // lastTranslator: 'Ahmad Awais <your_email@email.com>', // Last translator Email ID.
    // team: 'AhmadAwais <your_email@email.com>', // Team's Email ID.

    // Browsers you care about for autoprefixing. Browserlist https://github.com/ai/browserslist
    // The following list is set as per WordPress requirements. Though, Feel free to change.
    BROWSERS_LIST: [
        'last 2 version',
        '> 1%',
        'ie >= 11',
        'last 1 Android versions',
        'last 1 ChromeAndroid versions',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 iOS versions',
        'last 2 Edge versions',
        'last 2 Opera versions'
    ]
};

const errorHandler = error => {
	notify.onError( '\n\n❌  ===> ERROR: <%= error.message %>\n' )( error );
	beep();
};

// const browsersync = done => {
// 	browserSync.init({
// 		open: config.browserAutoOpen,
// 		injectChanges: config.injectChanges,
// 		watchEvents: [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ]
// 	});
// 	done();
// };

// Helper function to allow browser reload with Gulp 4.
// const reload = done => {
// 	browserSync.reload();
// 	done();
// };

gulp.task( 'browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: config.baseDir,
        },
        notify: false,
        injectChanges: config.injectChanges,
        watchEvents: [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ],
        open: config.browserAutoOpen,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    })
});

// gulp.task('styles', function() {
//     return gulp.src('app/scss/**/*.scss')
//     .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
//     .pipe(rename({ suffix: '.min', prefix : '' }))
//     .pipe(autoprefixer(['last 15 versions']))
//     .pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
//     .pipe(gulp.dest('app/css'))
//     .pipe(browserSync.stream())
// });

gulp.task( 'styles', () => {
	return gulp
		.src( config.styleSRC, { allowEmpty: true })
		.pipe( plumber( errorHandler ) )
		.pipe( sourcemaps.init() )
		.pipe(
			sass({
				errLogToConsole: config.errLogToConsole,
				outputStyle: config.outputStyle,
				precision: config.precision
			})
		)
		.on( 'error', sass.logError )
		.pipe( sourcemaps.write({ includeContent: false }) )
		.pipe( sourcemaps.init({ loadMaps: true }) )
		.pipe( autoprefixer( config.BROWSERS_LIST ) )
		.pipe( sourcemaps.write( './' ) )
        .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
        .pipe( gulp.dest( config.styleDestination ) )
        .pipe( mmq({ log: true }) ) // Merge Media Queries only for .min.css version.
        .pipe( minifycss({ maxLineLen: 10 }) )
        .pipe( rename({ suffix: '.min' }) )
        .pipe( gulp.dest( config.styleDestination ) )
        .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.
		.pipe( notify({ message: '\n\n✅  ===> STYLES — completed!\n', onLast: true }) )
});

// gulp.task('scripts', function() {
//     return gulp.src([
//         'node_modules/jquery/dist/jquery.min.js', // Include Jquery - last v
//         'app/js/common.js', // Always at the end
//         ])
//     .pipe(concat('scripts.min.js'))
//     // .pipe(uglify()) // Mifify js (opt.)
//     .pipe(gulp.dest('app/js'))
//     .pipe(browserSync.reload({ stream: true }))
// });

gulp.task( 'vendorsJS', () => {
	return gulp
		.src( config.jsVendorSRC, { since: gulp.lastRun( 'vendorsJS' ) }) // Only run on changed files.
		.pipe( plumber( errorHandler ) )
		.pipe(
			babel({
				presets: [
					[
						'@babel/preset-env', // Preset to compile your modern JS to ES5.
						{
							targets: { browsers: config.BROWSERS_LIST } // Target browser list to support.
						}
					]
				]
			})
        )
        .pipe( include({
            includePaths: [
              __dirname + "/node_modules",
                ]
            }) 
        )
        .pipe( remember( config.jsVendorSRC ) ) // Bring all files back to stream.
        .pipe( concat( config.jsVendorFile + '.js' ) )
        .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
        .pipe( gulp.dest( config.jsVendorDestination ) )
		.pipe(
			rename({
				basename: config.jsVendorFile,
				suffix: '.min'
			})
		)
		.pipe( uglify() )
        .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
        .pipe( gulp.dest( config.jsVendorDestination ) )
        .pipe(browserSync.reload({ stream: true }))
		.pipe( notify({ message: '\n\n✅  ===> VENDOR JS — completed!\n', onLast: true }) );
});

gulp.task( 'customJS', () => {
	return gulp
		.src( config.jsCustomSRC, { since: gulp.lastRun( 'customJS' ) }) // Only run on changed files.
		.pipe( plumber( errorHandler ) )
		.pipe(
			babel({
				presets: [
					[
						'@babel/preset-env', // Preset to compile your modern JS to ES5.
						{
							targets: { browsers: config.BROWSERS_LIST } // Target browser list to support.
						}
					]
				]
			})
		)
		.pipe( remember( config.jsCustomSRC ) ) // Bring all files back to stream.
        .pipe( concat( config.jsCustomFile + '.js' ) )
        .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
        .pipe( gulp.dest( config.jsCustomDestination ) )
		.pipe(
			rename({
				basename: config.jsCustomFile,
				suffix: '.min'
			})
		)
		.pipe( uglify() )
		.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
        .pipe( gulp.dest( config.jsCustomDestination ) )
        .pipe( browserSync.reload({ stream: true }) )
		.pipe( notify({ message: '\n\n✅  ===> CUSTOM JS — completed!\n', onLast: true }) );
});

gulp.task( 'html', () => {
    return gulp
        .src( config.htmlSRC )
        .pipe( plumber() ) 
        .pipe( include({
            includePaths: [
            __dirname + '/' + config.htmlParts,
                ]
            }) 
        )
        .pipe( gulp.dest( config.htmlDST ) )
        .pipe(browserSync.reload({ stream: true }))
        .pipe( notify({ message: '\n\n✅  ===> HTML — completed!\n', onLast: true }) );
});

gulp.task( 'fonts', () => {
    return gulp
        .src( config.fontsSRC )
        .pipe( gulp.dest( config.fontsDST ) )
        .pipe( notify({ message: '\n\n✅  ===> FONTS — completed!\n', onLast: true }) );
});

// gulp.task('svgSprite', function () {
//   return gulp.src('app/img/icons/*.svg') // svg files for sprite
//       .pipe(svgmin({
//         js2svg: {
//           pretty: true
//         }
//       }))
//       .pipe(svgSprite({
//               mode: {
//                   stack: {
//                       sprite: "../sprite.svg"  //sprite file name
//                   }
//               },
//           }
//       ))
//       .pipe(gulp.dest('app/img/sprite/'));
// });

gulp.task('svg', () => {
	return gulp.src( config.svgSRC )
	
    .pipe(svgmin({
        plugins: [{
            removeViewBox: false
        }]
    }))
    // .pipe(cheerio({
    //     run: function ($) {
    //         $('[fill]').removeAttr('fill');
    //         $('[stroke]').removeAttr('stroke');
    //         $('[style]').removeAttr('style');
    //     },
    //     parserOptions: {xmlMode: true}
    // }))
	// .pipe(replace('&gt;', '>'))
	.pipe(plumber())
    .pipe(svgSprite({
		shape: {
		  dimension: { // Set maximum dimensions
			maxWidth: 512, // Max. shape width
			maxHeight: 512, // Max. shape height
			precision: 2, // Floating point precision
			attributes: false, // Width and height attributes on embedded shapes
		  },
		  spacing: { // Add padding
			padding: 0
		  },
		  dest: 'svg' // Keep the intermediate files
		},
		svg: { // General options for created SVG files
			xmlDeclaration: true, // Add XML declaration to SVG sprite
			doctypeDeclaration: true, // Add DOCTYPE declaration to SVG sprite
			namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
			namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
			namespaceClassnames: true, // Add namespace token to all CSS class names in SVG shapes
			dimensionAttributes: true, // Width and height attributes on the sprite
		},
		mode: {
		  symbol: {
			  inline: true,
		  }, // Activate the «symbol» mode
		  stack: true // Create a «stack» sprite
		}
	  })
	)
    // .pipe(rename( 'icons.svg' ))
    .pipe(gulp.dest( config.svgDST ))
    .pipe(browserSync.reload({ stream: true }))
	.pipe( notify({ message: '\n\n✅  ===> SVG ICONS — completed!\n', onLast: true }) );
});

gulp.task( 'images', () => {
	return gulp
		.src( config.imgSRC )
		.pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg( {quality: 65, progressive: true} ),
                imagemin.optipng({ optimizationLevel: 3 }), // 0-7 low-high.
                imagemin.svgo({
                    plugins: [ { removeViewBox: true }, { cleanupIDs: false } ]
                })
            ])
		)
        .pipe( gulp.dest( config.imgDST ) )
        .pipe(browserSync.reload({ stream: true }))
		.pipe( notify({ message: '\n\n✅  ===> IMAGES — completed!\n', onLast: true }) );
});

gulp.task( 'clean', () => {
    return del( 'app/dist/' );
});

// gulp.task('rsync', function() {
//     return gulp.src('app/**')
//     .pipe(rsync({
//         root: 'app/',
//         hostname: 'username@yousite.com',
//         destination: 'yousite/public_html/',
//         // include: ['*.htaccess'], // Includes files to deploy
//         exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
//         recursive: true,
//         archive: true,
//         silent: false,
//         compress: true
//     }))
// });

// сборка
gulp.task( 'build',
    gulp.series( 'clean',
        gulp.parallel(
            'html',
            'styles',
            'vendorsJS',
            'customJS',
            'images',
            'svg',
            'fonts',
        )
    )
);

// запуск задач при изменении файлов
gulp.task( 'watch', () => {
    gulp.watch( config.watchStyles, gulp.parallel( 'styles' ) ); // Reload on SCSS file changes.
    gulp.watch( config.watchHtml, gulp.parallel( 'html' ) );
    gulp.watch( config.watchJsVendor, gulp.parallel( 'vendorsJS' ) ); // Reload on vendorsJS file changes.
    gulp.watch( config.watchJsCustom, gulp.parallel( 'customJS' ) ); // Reload on customJS file changes.
    gulp.watch( config.imgSRC, gulp.parallel( 'images' ) ); // Reload on customJS file changes.
    gulp.watch( config.svgSRC, gulp.parallel( 'svg' ) ); // Reload on customJS file changes.
    gulp.watch( config.fontsSRC, gulp.parallel( 'fonts' ) ); // Reload on customJS file changes.
});

gulp.task( 'default', gulp.series(
    'build',
    gulp.parallel( 'browser-sync', 'watch' )      
));

// gulp.task(
//     'default',
//     gulp.series( 'clean',
        
//         gulp.parallel( 'styles', 'vendorsJS', 'customJS', 'html', 'images', 'svg', 'fonts', 'browser-sync', () => {

//             gulp.watch( config.watchStyles, gulp.parallel( 'styles' ) ); // Reload on SCSS file changes.
//             gulp.watch( config.watchHtml, gulp.parallel( 'html' ) );
//             gulp.watch( config.watchJsVendor, gulp.parallel( 'vendorsJS' ) ); // Reload on vendorsJS file changes.
//             gulp.watch( config.watchJsCustom, gulp.parallel( 'customJS' ) ); // Reload on customJS file changes.
//             gulp.watch( config.imgSRC, gulp.parallel( 'images' ) ); // Reload on customJS file changes.
//             gulp.watch( config.svgSRC, gulp.parallel( 'svg' ) ); // Reload on customJS file changes.
//             gulp.watch( config.svgSRC, gulp.parallel( 'fonts' ) ); // Reload on customJS file changes.
//         })

//     )
// );

// gulp.task('watch', function() {
//     gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
//     gulp.watch('app/img/icons', gulp.parallel('svgSprite'));
//     gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
//     gulp.watch('app/*.html', gulp.parallel('code'))
// });

// gulp.task('default', gulp.parallel('styles', 'svgSprite', 'scripts', 'browser-sync', 'watch'));
