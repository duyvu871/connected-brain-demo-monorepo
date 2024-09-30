import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./src/**/*"],
	format: ["cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	...options,
}));