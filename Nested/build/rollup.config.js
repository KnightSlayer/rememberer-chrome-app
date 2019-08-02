import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy'
import htmlTemplate from 'rollup-plugin-generate-html-template';

import fs from 'fs';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;


export default new Promise(resolvePromise => {
  fs.readdir(path.join('..', 'src', 'pages'), (err, pages) => {

    const configs = pages.map(page => {
      const config = {
        input: `src/pages/${page}/index.js`,
        output: {
          sourcemap: true,
          format: 'iife',
          name: 'app',
          file: `dist/pages/${page}/${page}.js`,
        },
        plugins: [
          svelte({
            // enable run-time checks when not in production
            dev: !production,
            // css: css => {
            //   css.write('public/bundle.css');
            // }
          }),
          resolve({
            browser: true,
            dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
            customResolveOptions: {
              moduleDirectory: 'src'
            }
          }),
          commonjs(),
          htmlTemplate({
            template: 'src/pages/template.html',
            target: `${page}.html`,
          }),

          // If we're building for production (npm run build
          // instead of npm run dev), minify
          production && terser()
        ],
        watch: {
          clearScreen: false,
        }
      };

      return config;
    });

    configs.push({
      input: 'src/background/background.js',
      output: {
        format: 'iife',
        name: 'background',
        file: 'dist/background.js',
      },
      plugins: [
        copy({
          targets: [
            { src: 'src/assets', dest: 'dist' },
            { src: 'src/manifest.json', dest: 'dist' },
          ]
        }),
      ],
    });

    resolvePromise(configs)
  });
})
