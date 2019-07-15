# Unzipomania
Node.js module for recursive unpacking archives

Unpacks all archives including nested ones (optional).
[![npm Package](https://img.shields.io/npm/v/unzipomania.svg)](https://www.npmjs.org/package/unzipomania)


## Installation
```bash
npm install unzipomania
```



## API
```javascript
await Unzipomania(input[, output_folder, options])
```

### options.deep   
**Type**: _Boolean_   
**Default**: `false`   
Unpack nested archives  


### options.remove_source  
**Type**: _Boolean_   
**Default**: `false`   
Delete source zip file 



## Usage
```javascript
const Unzipomania = require('unzipomania');

let file1 = 'z:\unzipomania\zip1.zip';
let file2 = 'z:\unzipomania\zip2.zip';
let file3 = 'z:\unzipomania\zip3.zip';
let output = 'z:\unzipomania\unzip\';

(async () => {
   try {

      await Unzipomania([ file1, file2, file3 ], output, { remove_source: true });

   }catch(err){
      console.log(err);
   }
})()

```


## Changelog 
#### v2.1.0 (2019-07-16):
- faster and more stable
- fixed bugs

#### v2.0.1 (2018-08-26):
- fixed bugs

#### v1.x.x (2018-03-03):
- Moved from `yauzl` to `decompress` module 
- Fixed incorrect finish error


