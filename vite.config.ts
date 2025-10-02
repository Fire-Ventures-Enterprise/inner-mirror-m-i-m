import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  plugins: [
    react({
      jsxImportSource: 'react',
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic', importSource: 'react' }]
        ]
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
