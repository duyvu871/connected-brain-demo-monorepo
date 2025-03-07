import React from 'react';

type UploadWrappedProps = {
	onFileSelect: (files: File | File[]) => void;
	accept?: string;
	children: React.ReactNode;
	className?: string;
	variant?: string;
	multiSelect?: boolean;
}

const UploadWrapped: React.FC<UploadWrappedProps> = ({
	onFileSelect,
	accept = ".xlsx,.xls",
	children,
	multiSelect = false,
	...props
}) => {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return;
		
		if (multiSelect) {
			const files = Array.from(e.target.files);
			onFileSelect(files);
		} else {
			const file = e.target.files[0];
			onFileSelect(file);
		}
	};

	return (
		<label {...props}>
			<input
				accept={accept}
				onChange={handleFileChange}
				style={{ display: 'none' }}
				type="file"
				multiple={multiSelect}
			/>
			{children}
		</label>
	);
};

export default UploadWrapped;