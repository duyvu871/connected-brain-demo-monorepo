import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./src/**/*"],
	format: ["cjs", 'esm'],
	dts: true,
	clean: true,
	sourcemap: true,
	...options,
}));