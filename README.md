## 关于
ICBC官方驾考测试只有英语与Punjabi，本项目在ICBC官方驾考测试的基础上增加简体中文与英文双语对照的版本。

<img src="https://github.com/baeroki/icbc-test/blob/master/screenshots/launch.png?raw=true" alt="Launch" title="Launch" width="800" />

<img src="https://github.com/baeroki/icbc-test/blob/master/screenshots/test.png?raw=true" alt="Test" title="Test" width="800" />

## 安装

### 浏览器
如需运行独立的可执行文件，需要安装Chrome浏览器，并确保其安装路径在C:\Program Files\Google\Chrome\Application\chrome.exe。

### Node.js
如要生成独立的可执行文件，需要安装Node.js 18，因为pkg只支持到Node 18： https://nodejs.org/download/release/v18.19.1/node-v18.19.1-x64.msi； 如果不需要独立的可执行文件，可以安装最新版本的Node.js： https://nodejs.org/.

### 检出代码与安装依赖项
```
git clone git@github.com:baeroki/icbc-test.git
cd icbc-test
npm i
```

### 生成双语对照资源（可选）
从两个语言的题目资源文件生成一个双语对照的题目资源文件，这在需要修改题目内容时可以用到（如翻译错误）:
```
node merge.js
```
此操作会将'data/english.xml'与'data/mandarin.xml'合并为'data/mandarin_merged.xml'

## 运行
```
start.bat
```

## 构建可执行程序
生成独立的可执行文件只在Node.js 18下有效:
```
built.bat
```
生成的可执行文件在'dist/icbc-test.exe'，运行需要安装Chrome。

---

## About This
Added a test with language comparison in Simplified Chinese and English bilingual to the ICBC official driver license test.

## Installation
To build executables, install Node.js version 18 from the following link: https://nodejs.org/download/release/v18.19.1/node-v18.19.1-x64.msi. If you prefer, you can also install the latest version of Node.js instead: https://nodejs.org/.
```
git clone git@github.com:baeroki/icbc-test.git
cd icbc-test
npm i
```

## Generate Bilingual Comparison Document (Optional)
Merge 2 language of question xml documents into one bilingual xml document:
```
node merge.js
```
This will merge data/english.xml and data/mandarin.xml to data/mandarin_merged.xml

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
