import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    format: 'umd',
    name: 'micro',
    plugins: [terser()],
    sourcemap: false,
  }, {
    file: 'dist/index.esm.js',
    format: 'es',
    name: 'micro',
    plugins: [terser()],
    sourcemap: false,
  }],
  plugins: [
    typescript({
      // tsconfig: './tsconfig.json',
      outDir: './dist',
      // // include: ['src/**/*.ts'],
      // // exclude: ['node_modules/**', '**/*.d.ts'],
      module: "ESNext",
      declaration: true,
      declarationDir: './dist/types',
    })
  ]
}
