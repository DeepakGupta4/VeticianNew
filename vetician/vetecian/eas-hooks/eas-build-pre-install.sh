#!/bin/bash
set -e

echo "🔧 Forcing Gradle 8.8 to avoid metadata.bin bug..."

# Wait for prebuild to complete
sleep 2

if [ -f "android/gradle/wrapper/gradle-wrapper.properties" ]; then
  echo "📝 Current Gradle version:"
  grep "distributionUrl" android/gradle/wrapper/gradle-wrapper.properties
  
  sed -i 's|gradle-8.10.2-all.zip|gradle-8.8-all.zip|g' android/gradle/wrapper/gradle-wrapper.properties
  sed -i 's|gradle-8.10.2-bin.zip|gradle-8.8-bin.zip|g' android/gradle/wrapper/gradle-wrapper.properties
  
  echo "✅ Updated Gradle version:"
  grep "distributionUrl" android/gradle/wrapper/gradle-wrapper.properties
else
  echo "⚠️  gradle-wrapper.properties not found yet"
fi
