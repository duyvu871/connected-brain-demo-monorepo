import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entry: ["./src/**/*"],
	format: ["cjs", "esm"],
	clean: true,
	tsconfig: "./tsconfig.json",
	...options,
}));