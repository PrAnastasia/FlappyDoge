cd .
@echo off
cls
echo Resolving dependencies...
echo Npm is running...
call npm install .
echo Bower is running...
call bower install
echo "Runinig gulpfile.js"
gulp