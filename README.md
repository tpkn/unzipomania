# Unzipomania
Node.js module for 'deep' unzipping


Keep in mind that zip files would be removed right after extraction!


## Installation
```bash
npm install unzipomania
```



## API
### Unzipomania(options)


### options.zip   
**Type**: _String|Array_   
Single zip or a list of archives  


### options.folder  
**Type**: _String_   
Unzip folder  



## Usage
```javascript
const path = require('path');
const Unzipomania = require('unzipomania');

let file1 = path.join(__dirname, 'light_zip.zip');
let file2 = path.join(__dirname, 'super_zip.zip');
let file3 = path.join(__dirname, 'same_super_zip.zip');

let output = path.join(__dirname, (Math.floor(Math.random() * 1000000).toString('16')));

(async () => {
   try {

      let um = await Unzipomania({ zip: [file1, file2, file3], folder: output });
      console.log(um); //=> wheh

   }catch(err){
      console.log(err);
   }
})()

```


## Changelog 
#### v2.0.1 (2018-08-26):
- fixed bugs

#### v1.x.x (2018-03-03):
- Moved from `yauzl` to `decompress` module 
- Fixed incorrect finish error


