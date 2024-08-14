// esbuild.config.js
const path = require('path');
const fs = require('fs');

esbuild.build({
	// ... Các tùy chọn khác
	nodePaths: ['node_modules'],
	plugins: [
		{
			name: 'resolve-folder-import',
			setup(build) {
				build.onResolve({ filter: /^[^/]+$/ }, async (args) => {
					const indexPath = path.join(args.resolveDir, args.path, 'index.js');
					const folderPath = path.join(args.resolveDir, `${args.path}.js`);

					// Kiểm tra xem 'index.js' có tồn tại hay không
					if (fs.existsSync(indexPath)) {
						return { path: indexPath, namespace: 'resolve-index-js' };
					}

					// Nếu 'index.js' không tồn tại, thử import [folderName].js
					if (fs.existsSync(folderPath)) {
						return { path: folderPath };
					}

					// Nếu cả hai file không tồn tại, trả về lỗi
					return { errors: [{ text: `Could not resolve '${args.path}'` }] };
				});
			},
		},
	],

	// ... Các tùy chọn khác
});