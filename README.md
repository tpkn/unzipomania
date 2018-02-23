# Unzipomania
Nodejs module for 'deep' unzipping.


Module recursively unzips all zip archives inside the specified zip. It can:
- create output folder based on input file name
- remove source zip files after unzipping
- remove wrapping folder at the root of the output folder, like that:
```
dir/               --->    dir/
  └─ folder/                 ├─ file1
     ├─ file1                └─ folder/
     └─ folder/                 ├─ file2
        ├─ file2                └─ file3
        └─ file3                        
```


## Usage
```javascript
const Unzipomania = require('unzipomania');

new Unzipomania({
   zip: path.join(__dirname, 'test.zip'), 
   unzip_folder: path.join(__dirname, Date.now())
})
.then(result => {
   console.log(result);
}, error => {
   console.log(error);
});
```


## Output
```
{ 
  id: 0,
  status: 'ok',
  message: 'Unzipping completed!',
  input: 'X:/unzipomania/test.zip',
  output: 'X:/unzipomania/1516729394918/' 
}
```


## Options

### zip_file 
*Type*: *String*<br>
*Aliases*: `file`, `zip` 


### unzip_folder 
*Type*: *String*<br>
*Default*: *main_zip_path/zip_name* 


### keep_zip 
*Type*: *Boolean*<br>
*Default*: `false`<br>
Keep already uzipped archives 


### no_wrapper 
*Type*: *Boolean*<br>
*Default*: `true`<br>
Remove wrapping folder 




## Changelog 
#### 2018-02-23:
- Moved from `yauzl` to `decompress` module 
- Fixed incorrect finish error


