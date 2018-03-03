/*!
 * Unzipomania (v1.2.0.20180303), http://tpkn.me/
 */

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const decompress = require('decompress');

function isFolder(dir){
   try { return fs.lstatSync(dir).isDirectory() }catch(err){ return false }
}

function Unzipomania(input, output, options = {}){
   return new Promise((resolve, reject) => {

      let logger = {status: 'fail', message: '', list: []};

      if(typeof input !== 'string'){
         logger.message = 'No input!';
         return reject(logger);
      }

      if(typeof output === 'object'){
         options = output;
      }

      if(typeof output === 'undefined' || typeof output === 'object'){
         output = isFolder(input) ? input : path.parse(input).dir;
      }

      loop(input);


      function loop(dir){
         globby(dir, {expandDirectories: {extensions: ['zip']}}).then(files => {

            let total = files.length;

            if(total == 0){
               logger.status = 'ok';
               logger.message = 'completed';
               return resolve(logger);
            }

            for(let i = 0, len = files.length; i < len; i++){

               let file = files[i];
               let folder = path.join(output, path.basename(file, path.extname(file)));

               decompress(file, folder, {
                  filter: file => !/(__MACOSX|DS_Store)/.test(file.path)
               })
               .then(files => {
                  total--;
                  logger.list.push({file: path.basename(file), folder: folder});

                  fs.unlink(file, err => {
                     if(err) console.log(file, err.message);

                     if(total == 0){
                        loop(output);
                     }
                  });
               })
               .catch(err => {
                  reject(err)
               });
            }
         });
      }
   });
}

module.exports = Unzipomania;
