const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

const subpathAliases = {
  '@tanstack/router-core/isServer': path.resolve(__dirname, 'node_modules/@tanstack/router-core/dist/cjs/isServer/client.cjs'),
  '@tanstack/router-core/ssr/client': path.resolve(__dirname, 'node_modules/@tanstack/router-core/dist/cjs/ssr/client.cjs'),
  '@tanstack/router-core/ssr/server': path.resolve(__dirname, 'node_modules/@tanstack/router-core/dist/cjs/ssr/server.cjs'),
  '@tanstack/router-core/scroll-restoration-script': path.resolve(__dirname, 'node_modules/@tanstack/router-core/dist/cjs/scroll-restoration-script/client.cjs'),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (subpathAliases[moduleName]) {
    return {
      filePath: subpathAliases[moduleName],
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
