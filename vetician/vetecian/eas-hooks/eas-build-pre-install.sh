#!/bin/bash
set -e

echo "🔧 Forcing Gradle 8.8 to avoid metadata.bin bug..."

if [ -f "android/gradle/wrapper/gradle-wrapper.properties" ]; then
  sed -i 's/gradle-8.10.2/gradle-8.8/g' android/gradle/wrapper/gradle-wrapper.properties
  echo "✅ Gradle version set to 8.8"
fi
