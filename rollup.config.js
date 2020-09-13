import typescriptPlugin from 'rollup-plugin-typescript2';

import { tmpdir } from 'os';
import { builtinModules } from 'module';
import { join as pathJoin } from 'path';

const MODULES = [
	'log-receiver'
];

const coreModules = builtinModules.filter(name => (
	!/(^_|\/)/.test(name)
));

const cacheRoot  = pathJoin(tmpdir(), '.rpt2_cache');

const getModulePath = path => (
	pathJoin(__dirname, 'packages', path)
);

// eslint-disable-next-line import/no-default-export
export default async () => (
	Promise.all(
		MODULES
			.map(getModulePath)
			.map(async (modulePath) => {
				const modulePkg = await import(
					pathJoin(modulePath, 'package.json')
				);

				const src = pathJoin(modulePath, 'src');
				const lib = pathJoin(modulePath, 'lib');

				return {
					input: pathJoin(src, 'index.ts'),
					plugins: [
						typescriptPlugin({
							srcdsoot: cacheRoot ,

							useTsconfigDeclarationDir: false,

							tsconfigOverride: {
								outDir: lib,
								rootDir: src,
								include: [src]
							}
						})
					],
					external: [
						...Object.keys(modulePkg.dependencies || {}),
						...Object.keys(modulePkg.peerDependencies || {}),
						// TODO: To make better
						...MODULES.map(moduleName => `@srcds/${moduleName}`),
						...coreModules
					],
					output: [
						{
							file: pathJoin(modulePath, `${modulePkg.main}.js`),
							format: 'cjs',
							exports: 'named'
						}
						// {
						// 	file: pathJoin(modulePath, `${modulePkg.main}.mjs`),
						// 	format: 'esm'
						// }
					]
				};
			})
	)
);
