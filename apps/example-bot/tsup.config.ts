import { defineConfig } from 'tsup';


export default defineConfig({      
	dts: false,
  entry: ['src/**/*.ts', '!src/**/*.d.ts', 'src/**/*.tsx', '!src/**/*.test.ts*'],
	format: ['cjs'],
	minify: false,    
	tsconfig: 'tsconfig.json',
	target: 'es2022',
	splitting: false,
	skipNodeModulesBundle: false,
	sourcemap: true,
	shims: false,	
	keepNames: true,
	noExternal: [
		"@answeroverflow/discordjs-react",
		"lodash-es"
],
});