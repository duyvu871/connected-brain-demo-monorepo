export function extractFileName(encodedUrl: string) {
    // Giải mã URL
    const decodedUrl = decodeURI(encodedUrl);

    // Tạo đối tượng URL từ URL đã giải mã
    const urlObject = new URL(decodedUrl);

    // Lấy đường dẫn từ URL
    const pathname = urlObject.pathname;

    // Tách các phần của đường dẫn và lấy phần cuối cùng
    const segments = pathname.split('/');
    const fileName = segments.pop();

    return fileName ? decodeURI(fileName) : fileName;
}