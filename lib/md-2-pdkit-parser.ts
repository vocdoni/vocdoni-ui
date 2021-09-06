import Token from "markdown-it/lib/token";
import MarkDownIt from 'markdown-it'

enum MdTypes {
  Heading_open = "heading_open",
  Heading_close = "heading_close",
  Paragraph_open = "paragraph_open",
  Paragraph_close = "paragraph_close",
  Order_list_open = "ordered_list_open",
  Order_list_close = "ordered_list_close",
  Bullet_list_open = "bullet_list_open",
  Bullet_list_close = "bullet_list_close",
  Inline = "inline",
  Text = "text",
}
type IPdfKitOpt = 'text' | 'moveDown' | 'fontSize' | 'list'

export class PdfkitOpt {
  public type: IPdfKitOpt
  public args: any[]
  public closed: boolean

  constructor(type?: IPdfKitOpt, args?: any[]) {
    this.type = type
    this.args = args
    this.closed = false
  }
}

export class PdfkitOptStack {
  public stack: PdfkitOpt[] = []
  public opened: boolean = true

  public push(type: IPdfKitOpt, args?: any[]) {
    this.stack.push(new PdfkitOpt(type, args))
  }

  public concat (stackOpt: PdfkitOptStack): PdfkitOptStack {
    this.stack = this.stack.concat(stackOpt.stack)

    return this
  }

  public pop() {
    this.stack.pop()
  }

  public getTop() {
    return this.stack[this.stack.length - 1]
  }

  set text(text: string) {
    this.push('text', [text])
  }
}

class PdfKitListOpt extends PdfkitOptStack {
  public listOptions: any;

  constructor(text: string, listOptions: any) {
    super()

    this.push('fontSize', [listOptions.fontSize || 12])
    this.push('list', [[], {...listOptions, listType: listOptions.listType}])
  }

  set text(text: string) {
    this.stack[1].args[0].push(text)
  }
}

class PdfkitOrderedListOpt extends PdfKitListOpt {
  constructor(text: string, listOptions: any) {
    super(text, {...listOptions, listType: 'numbered'})
  }
}

class PdfkitBulletListOpt extends PdfKitListOpt {
  constructor(text: string, listOptions: any) {
    super(text, {...listOptions, listType: 'bullet'})
  }
}
class PdfkitTextOpt extends PdfkitOptStack {
  public textOptions: any

  constructor(text: string, textOptions?: any) {
    super()

    this.push('fontSize', [textOptions.fontSize])
    this.push('text', [text, textOptions])
  }

  set text(text: string) {
    this.stack[1].args[0] = text
  }
}

class PdfKitH1Opt extends PdfkitTextOpt {
  constructor(text: string) {
    super(text,
      {
        fontSize: 18,
        fontWeight: 500
      }
    )
  }
}

class PdfKitH2Opt extends PdfkitTextOpt {
  constructor(text: string) {
    super(text,
      {
        fontSize: 16,
        fontWeight: 300
      }
    )
  }
}

class PdfKitParagraphOpt extends PdfkitTextOpt {
  constructor(text: string) {
    super(text,
      {
        fontSize: 12,
        fontWeight: 300
      }
    )
  }
}



const md = new MarkDownIt()

export class Md2PdfkitParser {
  private parsedMd: Token[]
  private pdfkitOperations: PdfkitOptStack[]

  constructor(mdString: string, options?: any) {
    this.parsedMd = md.parse(mdString, {})
  };

  public getPdfkitOperations(): PdfkitOptStack[] {
    // console.log(this.parsedMd)

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
        openStack.opened = false
        break

      case MdTypes.Paragraph_open:
        if (openStack instanceof PdfKitListOpt) {
          console.log('sales or la lista')
          return
        }
        stackOpt = new PdfKitParagraphOpt('')
        break

      case MdTypes.Paragraph_close:
        openStack.opened = false
        break

      case MdTypes.Inline:
        openStack.text = token.content
        // token.children.forEach(childrenToken => {
        //   this.parseToken(childrenToken, openStack)
        // });

        break

      case MdTypes.Text:
        if (openStack instanceof PdfkitTextOpt) {
          openStack.text = token.content
        }

        break

      case MdTypes.Order_list_open:
        stackOpt =  new PdfkitOrderedListOpt(token.content, {})
        break
      case MdTypes.Order_list_close:
        openStack.opened = false
        break

      case MdTypes.Bullet_list_open:
        stackOpt =  new PdfkitBulletListOpt(token.content, {})
        break
      case MdTypes.Bullet_list_close:
        openStack.opened = false
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
      debugger
      const pdfkitOpt = this.parseToken(token, pdfkitOperations.slice(-1)[0])
      if (pdfkitOpt) {
        pdfkitOperations.push(pdfkitOpt)
      }
    })

    return pdfkitOperations
  };
}