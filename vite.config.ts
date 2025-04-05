
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.sentry-build-plugin" });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    sentryVitePlugin({
      org: "smart-cleaning-solutions",
      project: "scserp",
      authToken:
        process.env.SENTRY_AUTH_TOKEN ||
        process.env.ORGANIZATION_AUTH_TOKEN_SENTRY,
      sourcemaps: {
        assets: "./dist/**",
      },
      telemetry: false,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
  define: {
    // Provide environment variables to client code
    'import.meta.env.PROD': mode === 'production',
    'import.meta.env': JSON.stringify(process.env)
  }
}));
