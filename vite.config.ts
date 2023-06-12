import { UserConfig, defineConfig } from 'vite';
import pkg from './package.json';
import moment from 'moment';
import { resolve } from 'path';


function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
};

export default defineConfig((): UserConfig => {
  const root = process.cwd();
  const timestamp = new Date().getTime();
  return {
    base: '/',
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /\/@comp\//,
          replacement: pathResolve('src') + '/components/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      // Listening on all local IPs
      host: true,
      port: 3333,
    },
    esbuild: {
      pure:  ['console.log', 'debugger'],
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      minify: 'terser',
      /*terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: true,
        },
      },*/
      reportCompressedSize: false,
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        output: {
          // 入口文件名
          entryFileNames: 'assets/[name].js',
          // 块文件名
          chunkFileNames: 'assets/[name]-[hash].js',
          // 资源文件名 css 图片等等
          assetFileNames: `assets/[name]-[hash]-${timestamp}.[ext]`,
        },
      },
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

  };
});
