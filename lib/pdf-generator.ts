import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import { Md2PdfkitParser, PdfkitOpt, PdfkitOptStack } from './md-2-pdfkit-parser';

interface IPageOptions {
  size?: string;
  width?: number;
  height?: number;
  margin?: number;
  background?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  lineHeight?: number;
  textAlign?: string;
  textMargin?: number;
  textDirection?: string;
  lineSpacing?: number;
  fontStyle?: string;
  fontWeight?: string;
  fontVariant?: string;
  lineGap?: number;
}

interface ITextOptions {
  width?: number;
  height?: number;
  margin?: number;
  background?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  lineHeight?: number;
  align?: 'center' | 'left' | 'right' | 'justify';
  ellipsis?: boolean;
  columns?: number;
}

interface IImageOptions {
  width?: number;
  height?: number;
  top: number;
  left: number;
}

export class PdfGenerator {
  public pdf: PDFDocument
  static defaultSize = 'A4'

  static defaultTextStyle: ITextOptions = {
    fontSize: 12,
  }

  constructor() {
    this.pdf = new PDFDocument();
  }

  private addPage(page: IPageOptions): void {
    this.pdf.addPage(page)
  }

  public gotoPage(page: number): void {
    this.pdf.goToPage(page)
  }

  public getPageCount(): number {
    const range = this.pdf.bufferedPageRange()

    return range.start + range.count
  }

  public addSeparator(color: string) {
    this.pdf.lineWidth(2)

    const lineWidth = this.pdf.page.width - (this.pdf.page.margins.left + this.pdf.page.margins.right)

    this.pdf
      .rect(this.pdf.x, this.pdf.y, lineWidth, 0)
      .stroke(color)
      .moveDown(1)
  }

  public addHeaderStroke(color: string): void {
    this.pdf.lineWidth(20)

    this.pdf.moveTo(0, 0)
      .lineTo(this.pdf.page.width, 0)
      .stroke(color)
  }

  public addImage(image: string, options?: IImageOptions): void {
    this.pdf.image(image, options.left, options.top,  options)
  }

  public addMdText(text: string, options: IPageOptions = PdfGenerator.defaultTextStyle): void {
    const md2PdfKitParser = new Md2PdfkitParser(text, options)

    const pdfOpts = md2PdfKitParser.getPdfkitOperations()

    pdfOpts.forEach((pdfStackOpt: PdfkitOptStack) => {
      pdfStackOpt.stack.forEach((pdfOpt: PdfkitOpt) => {
        this.pdf[pdfOpt.type]?.apply(this.pdf, pdfOpt.args)
      })
    });
  }

  public addText(text: string, options: IPageOptions = PdfGenerator.defaultTextStyle): void {
    this.pdf.fontSize(options.fontSize || 12)
    this.pdf.fillColor(options.fontColor || 'black')

    this.pdf
      .text(text, options)
      .moveDown(options.margin || 0.5)

  }

  public addSpace(space: number) {
    this.pdf.moveDown(space)
  }

  public margin(margin: number) {
    // this.pdf.spaceLeft(margin)
  }

  public addTitle(title: string, options?: ITextOptions): void {
    const titleDefaultOptions = {
      fontSize: 18,
      align: 'center',
      margin: 1.2,
      ...options || {},
    }

    this.addText(title, titleDefaultOptions)
  }

  public addSubTitle(title: string, options?: ITextOptions): void {
    const titleDefaultOptions = {
      fontSize: 16,
      align: 'center',
      margin: 0.8,
      ...options || {},
    }

    this.addText(title, titleDefaultOptions)
  }
  
  public generatePage() {
    this.addPage({
      size: PdfGenerator.defaultSize,
    })
  }

  public downloadPdf(): Promise<string> {
    return new Promise((resolve, reject) => {

      const stream = this.pdf.pipe(blobStream())
      this.pdf.end()

      stream.on('finish', () => {
        const blob = stream.toBlob('application/pdf')
        const url = stream.toBlobURL('application/pdf')
        resolve(url)
      })

      stream.on('error', (err) => {
        reject(err)
      })
    })
  }
}