import esbuild from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import fs from 'fs/promises';
import { glob } from 'glob';

const makeMjsBuildSettings = async (options) => ({
  tsconfig: './tsconfig.mjs.json',
  entryPoints: await glob(['./src/*.ts?(x)', './src/**/*.ts?(x)'], { ignore: ['**/__tests__/**', '**/__test_dependency__/**'] }),
  outdir: './lib/mjs',
  sourcemap: true,
  format: 'esm',
  outExtension: { '.js': '.mjs' },
  loader: { '.js': 'jsx' },
  plugins: [
    esbuildPluginTsc({ force: true }),
    {
      // In cases where both .ts and .mjs.ts files are provided, effectively use the .mjs.ts file, which will be compiled as .mjs.mjs, by
      // renaming it to replace the .mjs file.  Also updates any references to .mjs.mjs to point to .mjs.
      name: 'use-mjs-file-when-explicitly-provided',
      setup(build) {
        build.onEnd(async () => {
          const generatedPaths = await glob([
            './lib/mjs/*.mjs.mjs',
            './lib/mjs/*.mjs.mjs.map',
            './lib/mjs/**/*.mjs.mjs',
            './lib/mjs/**/*.mjs.mjs.map'
          ]);
          await Promise.all(
            generatedPaths.map(async (generatedPath) => {
              let data = await fs.readFile(generatedPath, 'utf-8');
              data = data.replace(/\.mjs\.mjs/g, '.mjs');
              await fs.writeFile(generatedPath.replace(/\.mjs\.mjs/g, '.mjs'), data, 'utf-8');

              await fs.unlink(generatedPath);
            })
          );
        });
      }
    },
    {
      name: 'fix-mjs-import-and-export-paths',
      setup(build) {
        build.onEnd(async () => {
          const generatedPaths = await glob(['./lib/mjs/*.mjs', './lib/mjs/*.mjs.map', './lib/mjs/**/*.mjs', './lib/mjs/**/*.mjs.map']);
          await Promise.all(
            generatedPaths.map(async (generatedPath) => {
              let data = await fs.readFile(generatedPath, 'utf-8');
              data = data.replace(/\.js\b/g, '.mjs');
              await fs.writeFile(generatedPath, data, 'utf-8');
            })
          );
        });
      }
    }
  ],
  ...options
});

try {
  await esbuild.build(await makeMjsBuildSettings({}));
} catch (e) {
  process.exit(1);
}
