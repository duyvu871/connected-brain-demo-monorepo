import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./utils/**/*.ts", "./schemas/**/*.ts", "./helpers/**/*.ts"],
	format: ["cjs"],
	dts: true,
	clean: true,
	...options,
}));