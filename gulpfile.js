const { src, dest, series } = require('gulp');
const del = require('del');
const fs = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
const webpack_stream = require('webpack-stream');
const webpack_config = require('./webpack.config.js');
var exec = require('child_process').exec;

const paths = {
  prod_build: 'prod-build',
  server_file_name: 'server.bundle.js',
  database_src: 'database/*',
  database_dest: 'prod-build/database',
  assets_src: 'assets/*',
  assets_dest: 'prod-build/assets',
  angular_src: 'frontend-application/dist/**/*',
  angular_dist: 'prod-build/StudyCenter/dist',
  zipped_file_name: 'StudyCenter.zip'
};

function clean() {
  log('removing the old files in the directory')
  return del('prod-build/**', { force: true });
}

function createProdBuildFolder() {

  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function buildAngularCodeTask(cb) {
  log('Building Angular code :  npm run build ....')
  return exec('cd frontend-application && npm run build', function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  })
}

function copyAngularCodeTask() {
  log('copying Angular code into the directory')
  return src(`${paths.angular_src}`)
    .pipe(dest(`${paths.angular_dist}`));
}

function copyDatabaseTask() {
  log('copying Database into the directory')
  return src(`${paths.database_src}`)
    .pipe(dest(`${paths.database_dest}`));
}

function copyAssetsTask() {
  log('copying Assets into the directory')
  return src(`${paths.assets_src}`)
    .pipe(dest(`${paths.assets_dest}`));
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory')
  return webpack_stream(webpack_config)
    .pipe(dest(`${paths.prod_build}`))
}

function zippingTask() {
  log('zipping the code ')
  return src(`${paths.prod_build}/**`)
    .pipe(zip(`${paths.zipped_file_name}`))
    .pipe(dest(`${paths.prod_build}`))
}


exports.default = series(
  clean,
  createProdBuildFolder,
  buildAngularCodeTask,
  copyDatabaseTask,
  copyNodeJSCodeTask,
  copyAngularCodeTask,
  copyAssetsTask,
  zippingTask
);