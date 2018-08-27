/*!
 * Unzipomania, http://tpkn.me/
 */

const fs = require('fs');
const path = require('path');
const readdirRec = require('readdirrec');
const decompress = require('decompress');


function Unzipomania(options = {}){
   return new Promise((resolve, reject) => {
      if(typeof options.zip !== 'string' && !Array.isArray(options.zip)){
         return reject('no input archive');
      }
      if(typeof options.folder !== 'string'){
         return reject('no output folder');
      }

      let zips_list = typeof options.zip === 'string' ? [options.zip] : options.zip;
      let root_folder = options.folder;

      unzipArchive(zips_list, root_folder);

      function unzipArchive(list, root){
         let queue = [];
         let next_list = [];

         for(let i = 0, len = list.length; i < len; i++){
            let file = list[i];
            let name = path.basename(file, path.extname(file));
            let folder = path.join(typeof root === 'undefined' ? path.parse(file).dir : root, name);

            // Unzipping
            let unzip = decompress(file, folder, { filter: file => !/(__MACOSX|DS_Store)/i.test(file.path) });
            unzip.then(results => {
               results = results.filter(item => item.type === 'file' && /\.zip$/i.test(item.path));

               // Collect nested zips
               results.map(item => {
                  next_list.push(path.join(folder, item.path));
               });
            });

            queue.push(unzip);
         }

         // Wait for unzipping cycle ends
         Promise.all(queue).then(results => {
            if(next_list.length){
               unzipArchive(next_list);
            }else{
               cleanupDir(root_folder).then(res => {
                  resolve('whew');
               })
               .catch(err => {
                  console.log(err);
               })
            }
         }).catch(err => {
            console.log(err);
         });
      }
   });
}

function isFile(dir){
   try { return fs.lstatSync(dir).isFile() }catch(err){ return false }
}

function isDir(dir){
   try { return fs.lstatSync(dir).isDirectory() }catch(err){ return false }
}

function isZip(dir){
   return /\.zip$/i.test(dir);
}

function cleanupDir(dir){
   return new Promise((resolve, reject) => {
      let zips = readdirRec(dir, { filter: 'zip' });
      let done = 0;

      for(let i = 0, len = zips.length; i < len; i++){
         fs.unlink(zips[i], (err) => {
            if (err) return reject(err);
            done++;

            if(done == zips.length){
               resolve('zips removed');
            }
         });
      }
   });
}

module.exports = Unzipomania;
