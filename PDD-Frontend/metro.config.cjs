const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Disable package exports — Metro's implementation is buggy with some packages.
// We manually resolve subpath exports via resolveRequest below.
config.resolver.unstable_enablePackageExports = false;

const subpathAliases = {
  // Alias @tanstack/react-router → native no-op bridge.
  // The real @tanstack/react-router initialises browser DOM singletons at
  // module evaluation time and crashes the Hermes JS engine on Android.
  '@tanstack/react-router': path.resolve(__dirname, 'src/lib/router-bridge.native.ts'),

  // Subpath exports that Metro cannot resolve without package-exports support
  '@tanstack/router-core/isServer': path.resolve(
    __dirname,
    'node_modules/@tanstack/router-core/dist/cjs/isServer/client.cjs'
  ),
  '@tanstack/router-core/ssr/client': path.resolve(
    __dirname,
    'node_modules/@tanstack/router-core/dist/cjs/ssr/client.cjs'
  ),
  '@tanstack/router-core/ssr/server': path.resolve(
    __dirname,
    'node_modules/@tanstack/router-core/dist/cjs/ssr/server.cjs'
  ),
  '@tanstack/router-core/scroll-restoration-script': path.resolve(
    __dirname,
    'node_modules/@tanstack/router-core/dist/cjs/scroll-restoration-script/client.cjs'
  ),
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
