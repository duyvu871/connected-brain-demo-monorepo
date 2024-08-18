export function getAppName(path: string) {
		const pathArr = path.split('/');
		return pathArr[2];
}