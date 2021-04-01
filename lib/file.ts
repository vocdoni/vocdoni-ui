/**
 * Handy Promise for reading RcFile with FileReader
 *
 * @param RcFile Which file to read the contents from.
 */
 export const FileReaderPromise = (file: File) : Promise<Buffer>=> new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const buffer = Buffer.from(e.target.result as string)

    resolve(buffer)
  }
  reader.onerror = (e) => {
    reject(e)
  }

  reader.readAsArrayBuffer(file)
})
