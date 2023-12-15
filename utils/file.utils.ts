export async function getFileContent(file: File | Blob) {
    const buffer = await getFileBuffer(file);
    return buffer.toString();
}

export async function getFileBuffer(file: File | Blob) {
    return Buffer.from(await file.arrayBuffer());
}   