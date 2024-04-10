import typescriptPlugin from 'rollup-plugin-typescript2';

import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { builtinModules } from 'node:module';
import { join as pathJoin } from 'node:path';

const MODULES = [
	'log-receiver',
	'log-parser'
];

const coreModules = builtinModules.filter(name => (
	!/(^_|\/)/.test(name)
));

const cacheRoot = pathJoin(tmpdir(), '.rpt2_cache');

const getModulePath = path => (
    pathJoin(
        fileURLToPath(new URL('.', import.meta.url)),
        'packages',
        path
    )
);

export default async () => (
	Promise.all(
		MODULES
			.map(getModulePath)
			.map(async (modulePath) => {
				const modulePkg = await import(
                    pathJoin(modulePath, 'package.json'),
                    {
                        assert: {
                            type: 'json'
                        }
                    },
                );

				const src = pathJoin(modulePath, 'src');
				const lib = pathJoin(modulePath, 'lib');

				return {
					input: pathJoin(src, 'index.ts'),
					plugins: [
						typescriptPlugin({
							cacheRoot,

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
							file: pathJoin(modulePath, 'lib/index.js'),
							format: 'cjs',
							exports: 'named'
						},
						{
							file: pathJoin(modulePath, 'lib/index.mjs'),
							format: 'esm'
						}
					]
				};
			})
	)
);
