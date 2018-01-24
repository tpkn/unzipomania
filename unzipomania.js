/*!
 * Unzipomania (v1.0.0.20180121), http://tpkn.me/
 */

const fs = require('fs-extra');
const path = require('path');
const yauzl = require('yauzl');


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

      let total_zips = 1;
      let msg_data = {id: 0, status: 'fail', message: ''};

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
            fs.ensureDir(unzip_folder, err => {
               if(err){
                  msg_data.message = err.message;
                  return reject(msg_data);
               }

               yauzl.open(zip_file, {autoClose: true, lazyEntries: true}, (err, zipfile) => {
                  if(err){
                     msg_data.message = err.message;
                     return reject(msg_data);
                  }

                  zipfile.readEntry();

                  zipfile.on('entry', entry => {

                     let file_path = path.join(unzip_folder, entry.fileName);

                     // Ignored files/folders
                     if(/(__MACOSX|\.DS_Store)/i.test(entry.fileName)){
                        zipfile.readEntry();
                        return;
                     }

                     if(/\/$/.test(entry.fileName)){
                        fs.ensureDir(file_path);
                        zipfile.readEntry();
                     }else{
                        zipfile.openReadStream(entry, (err, readStream) => {
                           if(err){
                              msg_data.message = err.message;
                              return reject(msg_data);
                           }

                           readStream.on('end', () => {
                              zipfile.readEntry();
                           });

                           // Write files
                           readStream.pipe(fs.createWriteStream(file_path))
                           .on('finish', () => {

                              // If it is another one zip file...
                              if(/\.zip$/i.test(entry.fileName)){

                                 total_zips++;

                                 // Cut zip filename from it's path, then decompress files into this folder
                                 // folder/some.zip -> folder/
                                 unzip(file_path, path.parse(file_path).dir);
                              }
                           });
                        });
                     }
                  });

                  zipfile.on('close', () => {
                     total_zips--;

                     // Remove source zip file when all files are decompressed and saved
                     if(!keep_zip){
                        fs.remove(zip_file, err => {});
                     }

                     if(total_zips == 0){
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

                     // TO DO
                     // Pass array of archives that should not be deleted
                  });
               });
            });
         }
      }catch(err){
         msg_data.message = err.message;
         reject(msg_data)
      }
   });
}

module.exports = Unzipomania;
