export function download(
    fileName: string,
    data: string,
    mime = "text/plain",
  ) {
    const blobData = [data];
    const blob = new Blob(blobData, { type: mime });
    const a = document.createElement("a");
  
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href)
      a.remove()
    }, 200);
  }