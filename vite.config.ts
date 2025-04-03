
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Sentry Vite plugin with organization-based environment variables
    sentryVitePlugin({
      org: process.env.SENTRY_ORGANIZATION_SLUG || "smart-cleaning-solutions",
      project: "aussie-clean-erp",
      // Use organization auth token instead of simple auth token
      authToken: process.env.ORGANIZATION_AUTH_TOKEN_SENTRY || process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      sourcemaps: {
        assets: './dist/**',
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Ensure source maps are generated
  },
}));

