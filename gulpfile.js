const gulp = require('gulp');
const replace = require('gulp-replace');
const fs = require('fs');

const OUT_ESM = 'lib/esm';
const OUT_CJS = 'lib/cjs';

function updateVersion(dst, file){

    const VERSION = JSON.parse(fs.readFileSync('./package.json')).version;

    return gulp.src(dst + '/' + file)
        .pipe(replace('CONFIGCAT_SDK_VERSION', VERSION))
        .pipe(gulp.dest(dst));
}

function updateVersion_esm(){
    return updateVersion(OUT_ESM, 'Version.js');
}

function updateVersion_cjs(){
    return updateVersion(OUT_CJS, 'Version.js');
}

exports.esm = gulp.series(updateVersion_esm);
exports.cjs = gulp.series(updateVersion_cjs);
