const fs = require('fs');
const path = require('path');

const cmakePath = path.join(__dirname, '..', 'node_modules', 'expo-av', 'android', 'CMakeLists.txt');

if (!fs.existsSync(cmakePath)) {
  console.log('expo-av CMakeLists.txt not found, skipping patch.');
  process.exit(0);
}

const content = fs.readFileSync(cmakePath, 'utf8');

if (content.includes('ReactAndroid::reactnativejni') && !content.includes('REACT_NATIVE_JNI_TARGET')) {
  // Replace the target_link_libraries block with guarded version
  const newContent = content.replace(/find_library\(LOG_LIB log\)\s*\n\s*find_package\(ReactAndroid REQUIRED CONFIG\)\s*\n\s*find_package\(fbjni REQUIRED CONFIG\)\s*\n\s*# linking\s*\n\s*target_link_libraries\([\s\S]*?\n\)\s*/,
`find_library(LOG_LIB log)

find_package(ReactAndroid REQUIRED CONFIG)

find_package(fbjni REQUIRED CONFIG)

# Choose available React Native JNI target (some RN distributions export different targets)
if (TARGET ReactAndroid::reactnativejni)
    set(REACT_NATIVE_JNI_TARGET ReactAndroid::reactnativejni)
elseif (TARGET ReactAndroid::reactnative)
    set(REACT_NATIVE_JNI_TARGET ReactAndroid::reactnative)
else()
    set(REACT_NATIVE_JNI_TARGET "")
    message(WARNING "ReactAndroid JNI target not found; linking without explicit reactnativejni target")
endif()

# linking

target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        fbjni::fbjni
        ReactAndroid::jsi
        android
)

if (REACT_NATIVE_JNI_TARGET)
    target_link_libraries(${PACKAGE_NAME} ${REACT_NATIVE_JNI_TARGET})
endif()
`);

  fs.writeFileSync(cmakePath, newContent, 'utf8');
  console.log('Patched expo-av CMakeLists.txt to guard ReactAndroid JNI linking.');
} else {
  console.log('expo-av CMakeLists.txt already patched or does not require patch.');
}
