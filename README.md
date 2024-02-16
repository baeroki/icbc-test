
## About This
Added a test with language comparison in Simplified Chinese and English bilingual to the ICBC official driver license test.

## Installation
To build executables, install Node.js version 18 from the following link: https://nodejs.org/download/release/v18.19.1/node-v18.19.1-x64.msi. If you prefer, you can also install the latest version of Node.js instead: https://nodejs.org/.
```
cd icbc-test
npm i
```

## Generate Bilingual Comparison Document
Merge 2 language of question xml documents into one bilingual xml document:
```
node merge.js
```
This will merge data/english.xml and data/mandarin.xml to mandarin_merged.xml

## Run
```
start.bat
```

## Build Executable
This is only available under Node.js version 18:
```
built.bat
```
The executable will be generate in 'dist/icbc-test.exe'
