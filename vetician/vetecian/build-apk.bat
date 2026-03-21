@echo off
echo Building production AAB for Play Console...
cd android
call gradlew clean
call gradlew bundleRelease
echo AAB built successfully!
echo Location: android\app\build\outputs\bundle\release\app-release.aab
pause