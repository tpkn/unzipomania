# Unzipomania
Node.js module for 'deep' unzipping



Keep in mind that zip files would be removed right after extraction!


## Usage
```javascript
const Unzipomania = require('unzipomania');

let input = '/input/test.zip';
let output = '/output';

Unzipomania(input, output)
.then(result => {
   console.log(result);
}, error => {
   console.log(error);
});
```


## API

### input 
__Type__: *String*<br>
Path to folder or path to zip file.


### output 
__Type__: *String*<br>
__Default__: */{input}*<br>
 Path to output folder. If not set, then it would be equal to input path.



## Output
```
{ status: 'ok',
  message: 'completed',
  list: [
    { file: 'file1.zip', folder: 'X:/output/file1' },
    { file: 'file2.zip', folder: 'X:/output/file2' },
    { file: 'file3.zip', folder: 'X:/output/file3' }
  ]
}
```



## Changelog 
#### 2018-03-03:
- Moved from `yauzl` to `decompress` module 
- Fixed incorrect finish error


