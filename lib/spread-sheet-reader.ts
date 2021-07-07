import xlsx, { WorkBook } from 'xlsx'


export class SpreadSheetReader {
  private readonly reader
  private readonly readerPromise

  public readonly file
  public workBook: WorkBook
  public header
  public data

  constructor(file: File) {
    this.reader = new FileReader()
    this.file = file
    this.readerPromise = this.handleUploadPromise()
  }

  public static AcceptedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/csv',
    'application/x-csv',
    'text/x-comma-separated-values',
    'text/comma-separated-values',
    'application/vnd.oasis.opendocument.spreadsheet',
  ]

  public onLoad(callback) {
    this.readerPromise.then(() => {
      callback(this)
    })
  }

  public validateDataIntegrity(): void {
    this.data.forEach((row) => {
      if (row.length !== this.header.length) {
        throw new Error('Invalid data integrity')
      }
    })
  }

  private handleUploadPromise(): Promise<SpreadSheetReader> {
    return new Promise((resolve, reject): void => {
      this.reader.onload = (event) => {
        try {
          this.workBook = xlsx.read(this.reader.result, { type: 'binary', codepage: 65001 })
          this.data = this.getSheetsData(this.workBook)

          this.header = this.data.splice(0, 1)[0]

          resolve(this)
        } catch (error) {
          reject(error)
        }
      }

      this.reader.readAsBinaryString(this.file)
    })
  }

  private getSheetsData(xlsFile: WorkBook) {
    const firstSheetName = xlsFile.SheetNames[0]
    const worksheet = xlsFile.Sheets[firstSheetName]
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false })
    const filteredEmptyRows = data.filter((row: Array<any>) => row.length > 0)

    return filteredEmptyRows
  }

  private rowToString(row: string[]): string {
    return row.reduce(
      (accumulator: string, value: string) => accumulator + value
    )
  }
}
