/*!
 * Unzipomania, http://tpkn.me/ 
 */
const fs = require('fs');
const path = require('path');
const util = require('util');
const unlink = util.promisify(fs.unlink);
const decompress = require('decompress');

async function Unzip(input, output_folder, options = {}){
   let { deep, remove_source } = options;

   for(let i = 0, len = input.length; i < len; i++){
      let file = input[i];
      let name = path.basename(file, path.extname(file));
      let folder = path.join(typeof output_folder !== 'string' ? path.parse(file).dir : output_folder, name);

      // Unzip
      let unzipped = await decompress(file, folder, { 
         filter: file => !/(__MACOSX|DS_Store)/i.test(file.path) 
      });

      // Unzip nested archives
      if(deep){
         let nested_zip = unzipped.filter(j => /\.zip$/i.test(j.path));
         if(nested_zip.length){
            let flatten_nested = nested_zip.map(j => path.join(folder, j.path));
            await Unzip(flatten_nested, null, options);
         }
      }

      // Remove source zip
      if(remove_source){
         await unlink(file);
      }
   }
}

async function Unzipomania(input, output_folder, options = {}){
   if(!Array.isArray(input) && typeof input !== 'string'){
      throw new TypeError('Input should be a <String> or an <Array>');
   }

   if(!Array.isArray(input) && typeof input === 'string'){
      input = [ input ];
   }

   await Unzip(input, output_folder, options);
}

module.exports = Unzipomania;
