export const calculateFileSize = (size: number): string => {
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
};

export const convertToBlobURL = (data: string | Buffer | ArrayBuffer | DataView, type: "url" | "buffer" | "arraybuffer" | "dataview") => {
	switch (type) {
		case "url":
			return data as string;
		case "buffer":
			return URL.createObjectURL(new Blob([data as Buffer]));
		case "arraybuffer":
			return URL.createObjectURL(new Blob([data as ArrayBuffer]));
		case "dataview":
			return URL.createObjectURL(new Blob([data as DataView]));
		default:
			return data as string;
	}
}