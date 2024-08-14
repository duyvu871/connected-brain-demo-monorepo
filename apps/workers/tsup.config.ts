import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./utils/**/*", "./tasks/**/*", "./process/**/*"],
	format: ["cjs"],
	clean: true,
	...options,
}));