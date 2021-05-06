import { InvalidFileError } from "./errors/invalid-file-error";

export interface IFile {
  file: File,
  url: string
}

export const fileValidator = (file: IFile) => (
  file.file || file.url? null: new InvalidFileError()
)