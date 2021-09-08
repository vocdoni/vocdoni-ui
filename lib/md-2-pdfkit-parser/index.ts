import Token from "markdown-it/lib/token";
import MarkDownIt from 'markdown-it'
import { MdTypes, PdfkitBulletListOpt, PdfKitFontType, PdfKitH1Opt, PdfKitH2Opt, PdfKitListOpt, PdfkitOpt, PdfkitOptStack, PdfkitOrderedListOpt, PdfKitParagraphOpt } from "./opt";

const md = new MarkDownIt()

export { MdTypes, PdfkitBulletListOpt, PdfKitFontType, PdfKitH1Opt, PdfKitH2Opt, PdfKitListOpt, PdfkitOpt, PdfkitOptStack, PdfkitOrderedListOpt, PdfKitParagraphOpt }

export class Md2PdfkitParser {
  private parsedMd: Token[]
  private pdfkitOperations: PdfkitOptStack[]

  constructor(mdString: string, options?: any) {
    this.parsedMd = md.parse(mdString, {})
  };

  public getPdfkitOperations(): PdfkitOptStack[] {
    console.log(this.parsedMd)

    if (!this.pdfkitOperations) {
      this.pdfkitOperations = this.parse(this.parsedMd)
    }

    return this.pdfkitOperations
  }

  private parseToken(token: Token, openStack: PdfkitOptStack): PdfkitOptStack {
    let stackOpt;

    switch (token.type) {
      case MdTypes.Heading_open:
        switch (token.tag) {
          case 'h1':
            stackOpt = new PdfKitH1Opt(token.content)
            break

          case 'h2':
            stackOpt = new PdfKitH2Opt(token.content)
            break
        }
        break

      case MdTypes.Heading_close:
        if (openStack instanceof PdfKitH1Opt || openStack instanceof PdfKitH2Opt) openStack.opened = false
        break

      case MdTypes.Paragraph_open:
        if (openStack instanceof PdfKitListOpt && openStack.opened) {
          return
        }

        stackOpt = new PdfKitParagraphOpt('')
        break

      case MdTypes.Paragraph_close:
        if (openStack instanceof PdfKitParagraphOpt) openStack.opened = false
        break

      case MdTypes.Inline:
        token.children.forEach(childrenToken => {
          this.parseToken(childrenToken, openStack)
        });

        break

      case MdTypes.Text:
        openStack.text(token.content)
        break

      case MdTypes.Italic_open:
        openStack.setFontType(PdfKitFontType.Italic)
        break

      case MdTypes.Italic_close:
        openStack.disableFontType(PdfKitFontType.Italic)
        break

      case MdTypes.Bold_open:
        openStack.setFontType(PdfKitFontType.Bold)
        break

      case MdTypes.Bold_close:
        openStack.disableFontType(PdfKitFontType.Bold)
        break

      case MdTypes.Order_list_open:
        stackOpt =  new PdfkitOrderedListOpt(token.content, {})
        break
      case MdTypes.Order_list_close:
        if (openStack instanceof PdfkitOrderedListOpt) openStack.opened = false
        break

      case MdTypes.Bullet_list_open:
        stackOpt =  new PdfkitBulletListOpt(token.content, {})
        break
      case MdTypes.Bullet_list_close:
        if (openStack instanceof PdfkitBulletListOpt) openStack.opened = false
        break
    }


    if (stackOpt && openStack && openStack.opened) {
      openStack.concat(stackOpt)
      return
    }

    return stackOpt
  }


  private parse(md: Token[]): PdfkitOptStack[] {
    const pdfkitOperations: PdfkitOptStack[] = []

    md.forEach(token => {
      const pdfkitOpt = this.parseToken(token, pdfkitOperations.slice(-1)[0])
      if (pdfkitOpt) {
        pdfkitOperations.push(pdfkitOpt)
      }
    })

    return pdfkitOperations
  };
}