// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";
import path from "path";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        { find: /react-native-web[/\\]dist[/\\]modules[/\\]prefixStyles/, replacement: path.resolve(__dirname, "./src/lib/prefixStyles-bridge.ts") },
        { find: "react-native/Libraries/Utilities/codegenNativeComponent", replacement: path.resolve(__dirname, "./src/lib/codegen-bridge.ts") },
        { find: /^react-native$/, replacement: "react-native-web" },
        { find: "lucide-react-native", replacement: "lucide-react" },
        { find: "@expo/vector-icons", replacement: path.resolve(__dirname, "./src/lib/expo-icons-bridge.tsx") },
      ],
    },
    ssr: {
      noExternal: ["react-native-web"],
      external: ["inline-style-prefixer"],
    },
    plugins: [
      nitro({
        preset: "vercel",
      }),
    ],
  },
});

