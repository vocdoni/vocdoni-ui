import xlsx, { WorkBook } from 'xlsx'
import { InvalidRowLength } from './validators/errors/invalid-row-length'
import { InvalidWeightedRow } from './validators/errors/invalid-weighted-row-length'

export enum VotingType {
  Normal = 'normal',
  Weighted = 'weighted',
}

export enum ErrorType {
  InvalidRowLength = 'invalidRowLength',
  InvalidWeightedVoted = 'invalidWeightedVoted',
}

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

  public validateDataIntegrity(csvType: VotingType): void {
    const errorTypes: ErrorType[] = []
    const invalidRows = []

    this.data.forEach((row, index) => {
      if (row.length !== this.header.length) {
        if (!errorTypes.includes(ErrorType.InvalidRowLength)) {
          errorTypes.push(ErrorType.InvalidRowLength)
        }

        invalidRows.push(index + 1)
      }

      if (csvType === VotingType.Weighted) {
        const regex = /^[0-9]?$/
        if (!regex.test(row[0])) {
          if (!errorTypes.includes(ErrorType.InvalidWeightedVoted)) {
            errorTypes.push(ErrorType.InvalidWeightedVoted)
          }

          errorTypes.push(ErrorType.InvalidWeightedVoted)

          invalidRows.push(index + 1)
        }
      }
    })

    if (errorTypes.includes(ErrorType.InvalidRowLength)) {
      throw new InvalidRowLength(invalidRows)
    }

    if (errorTypes.includes(ErrorType.InvalidWeightedVoted)) {
      throw new InvalidWeightedRow(invalidRows)
    }
  }

  public getHeader(csvType: VotingType): string[] {
    return csvType === VotingType.Normal? this.header:this.header.slice(1)
  }

  private handleUploadPromise(): Promise<SpreadSheetReader> {
    return new Promise((resolve, reject): void => {
      this.reader.onload = (event) => {
        try {
          this.workBook = xlsx.read(this.reader.result, {
            type: 'binary',
            codepage: 65001,
          })
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
