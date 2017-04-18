@echo off

set filename=index.js

if exist %filename% del %filename%

for /R %%f in (*.js) do (

    rem echo %%~af

    echo // >> %filename%
    echo // %%~nxf >> %filename%
    echo // >> %filename%

    type %%f >> %filename%

    echo. >> %filename%
)