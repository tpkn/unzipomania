/*!
 * Unzipomania (v1.1.0.20180223), http://tpkn.me/
 */

const fs = require('fs-extra');
const path = require('path');
const decompress = require('decompress');


function isFolder(dir){
   try { return fs.lstatSync(dir).isDirectory() }catch(err){ return false }
}

function listDir(dir){
   try { return fs.readdirSync(dir) }catch(err){ return [] }
}

/**
 * Check if folder has alone folder inside (maybe with files)
 * 
 * @param  {String} dir
 * @return {String} - folder name or null
 */
function getWrapper(dir){
   let list = listDir(dir);
   if(list && list.length == 1 && isFolder(dir)){
      return list[0];
   }else{
      return '';
   }
}

function Unzipomania(config){
   return new Promise((resolve, reject) => {

      let zips_total = 0;
      let msg_data = {id: 0, status: 'fail', message: '', errors: []};

      if(typeof config !== 'object'){
         msg_data.message = 'No config!';
         return reject(msg_data)
      }

      let zip_file = config.file || config.zip || config.zip_file;

      if(!/\.zip$/i.test('' + zip_file)){
         msg_data.message = 'No zip file!';
         return reject(msg_data);
      }

      let unzip_folder = config.unzip_folder || path.join(path.parse(zip_file).dir, path.basename(zip_file, path.extname(zip_file)));
      let no_wrapper = typeof config.no_wrapper !== 'boolean' ? true : config.no_wrapper;
      let keep_zip = typeof config.keep_zip !== 'boolean' ? false : config.keep_zip;

      msg_data.input = zip_file;
      msg_data.output = unzip_folder;

      try {
         unzip(zip_file, unzip_folder);

         function unzip(zip_file, unzip_folder){
            decompress(zip_file, unzip_folder, {
               filter: file => !(/(__MACOSX|\.DS_Store)/i.test(path.extname(file.path)))
            })
            .then(files => {

               if(!keep_zip){
                  fs.remove(zip_file, err => {
                     if(err) {
                        msg_data.errors.push(err.message)
                     }
                  });
               }

               for(let i = 0, len = files.length; i < len; i++){
                  let file = files[i];

                  if(file.type == 'file' && /\.zip$/i.test(file.path)){
                     zips_total++;
                     
                     let next_file = path.join(unzip_folder, file.path);
                     let next_folder = path.join(unzip_folder, file.path.replace('.zip', ''));

                     unzip(next_file, next_folder);
                  }
               }

               if(zips_total == 0){
                  msg_data.status = 'ok';
                  msg_data.message = 'Unzipping completed!';

                  // No wrapping folder at the root!
                  if(no_wrapper){
                     let wrapper = getWrapper(unzip_folder);
                     if(wrapper){
                        fs.moveSync(path.join(unzip_folder, wrapper), unzip_folder);
                     }
                  }

                  resolve(msg_data);
               }

               zips_total--;

            }).catch(err => {
               msg_data.message = err.message;
               reject(msg_data);
            })
         }
      }catch(err){
         msg_data.message = err.message;
         reject(msg_data);
      }
   });
}

module.exports = Unzipomania;
