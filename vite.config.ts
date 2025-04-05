
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.sentry-build-plugin" });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }: { mode: string }) => {
  // Check if Sentry is enabled (either via env variable or production mode)
  const sentryDsn = process.env.VITE_SENTRY_DSN || process.env.ORGANIZATION_AUTH_TOKEN_SENTRY;
  const sentryEnabled = !!sentryDsn || mode === 'production';

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      // Only add Sentry plugin if enabled
      sentryEnabled && sentryVitePlugin({
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
      sourcemap: sentryEnabled, // Only generate source maps if Sentry is enabled
    },
    define: {
      // Provide environment variables to client code
      'import.meta.env.PROD': mode === 'production',
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://fzrhweggxusfwrohtvpb.supabase.co'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6cmh3ZWdneHVzZndyb2h0dnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU4MjQsImV4cCI6MjA1OTI4MTgyNH0.W0ocOlTW9Oc4nRytpYByg49B_4pA4lgWoxeSUM0tqdc'),
      'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(process.env.VITE_SENTRY_DSN || ''),
      'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(process.env.VITE_ENVIRONMENT || mode),
      'import.meta.env.VITE_ENABLE_SENTRY': JSON.stringify(sentryEnabled ? 'true' : 'false')
    }
  };
});
