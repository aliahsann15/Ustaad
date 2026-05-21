const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withAsyncStorageLocalRepo(config) {
  return withProjectBuildGradle(config, (projectConfig) => {
    const { contents } = projectConfig.modResults;
    const projectRoot = projectConfig.modRequest.projectRoot;
    const repoLine = `    maven { url uri("${projectRoot}/node_modules/@react-native-async-storage/async-storage/android/local_repo") }`;

    if (contents.includes(repoLine)) {
      return projectConfig;
    }

    const targetBlock = /allprojects\s*\{\s*repositories\s*\{\s*[\s\S]*?mavenCentral\(\)\s*\n(\s*maven\s*\{\s*url\s*'https:\/\/www\.jitpack\.io'\s*\}\s*\n)/m;

    if (targetBlock.test(contents)) {
      projectConfig.modResults.contents = contents.replace(
        targetBlock,
        (match, jitpackLine) => match.replace(jitpackLine, `${repoLine}\n${jitpackLine}`),
      );
    }

    return projectConfig;
  });
};