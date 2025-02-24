"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vite = require("vite");

var _pluginReact = _interopRequireDefault(require("@vitejs/plugin-react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = (0, _vite.defineConfig)({
  plugins: [(0, _pluginReact["default"])()],
  server: {
    port: 3001,
    // Specify a different port
    open: true,
    // Automatically open browser
    host: true,
    // Listen on all local IPs
    strictPort: false // Try next available port if 3001 is taken

  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name].[hash].mjs',
        chunkFileNames: '[name].[hash].mjs',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});

exports["default"] = _default;