export enum MdTypes {
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
  Italic_open = "em_open",
  Italic_close = "em_close",
  Bold_open = "strong_open",
  Bold_close = "strong_close",
  Strong_open = "strong_open",
  Strong_close = "strong_close",
  Blockquote_open = "blockquote_open",
  Blockquote_close = "blockquote_close",
}

export type PdfKitOpt = 'text' | 'moveDown' | 'fontSize' | 'list' | 'font'

export enum PdfKitFontType {
  Normal = 'Helvetica',
  Italic = 'Helvetica-Oblique',
  Bold ='Helvetica-Bold',
  BoldItalic = 'Helvetica-BoldOblique',
}

export class PdfkitOpt {
  public type: PdfKitOpt
  public args: any[]
  public closed: boolean

  constructor(type?: PdfKitOpt, args?: any[]) {
    this.type = type
    this.args = args
    this.closed = false
  }
}

export class PdfkitOptStack {
  public stack: PdfkitOpt[] = []
  public _opened: boolean = true

  public push(type: PdfKitOpt, args?: any[]) {
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

  public text(text: string) {
    this.push('text', [text])
  }

  public setFontType(fontType: PdfKitFontType) {
    const lastFontType = this.getLastStackType('font')

    if (
      lastFontType &&
      (fontType === PdfKitFontType.Bold || PdfKitFontType.BoldItalic)  && 
      lastFontType !== PdfKitFontType.Normal
    ) {
      this.push('font', [PdfKitFontType.BoldItalic])
    } else {
      this.push('font', [fontType])
    }
  }

  public disableFontType(fontType: PdfKitFontType) {
    const lastFontType = this.getLastStackType('font')?.args[0]

    if (lastFontType === fontType || lastFontType === PdfKitFontType.Normal) {
      this.push('font', [PdfKitFontType.Normal])
    } else if (fontType === PdfKitFontType.Bold) {
      this.push('font', [PdfKitFontType.Italic])
    } else if (fontType === PdfKitFontType.Italic) {
      this.push('font', [PdfKitFontType.Bold])
    }
  }

  private getLastStackType(stackType: PdfKitOpt) {
    let lastStackText;

    this.stack.forEach(opt => {
      if (opt.type === stackType) lastStackText = opt
    })

    return lastStackText
  }

  set opened(value: boolean) {
    const lastStackText = this.getLastStackType('text')

    if (!value && lastStackText) {
      lastStackText.args[1].continued = false
    }

    this._opened = value
  }

  get opened() {
    return this._opened
  }
}

export class PdfKitListOpt extends PdfkitOptStack {
  public listOptions: any;

  constructor(text: string, listOptions: any) {
    super()

    this.push('fontSize', [listOptions.fontSize || 12])
    this.push('list', [[], {...listOptions, listType: listOptions.listType}])
  }

  public text(text: string) {
    this.stack[1].args[0].push(text)
  }
}

export class PdfkitOrderedListOpt extends PdfKitListOpt {
  constructor(text: string, listOptions: any) {
    super(text, {...listOptions, listType: 'numbered'})
  }
}

export class PdfkitBulletListOpt extends PdfKitListOpt {
  constructor(text: string, listOptions: any) {
    super(text, {...listOptions, listType: 'bullet'})
  }
}

export class PdfkitTextOpt extends PdfkitOptStack {
  public textOptions: any

  constructor(text: string, textOptions?: any) {
    super()

    this.push('fontSize', [textOptions.fontSize])
    this.push('text', [text, textOptions])
  }

  public text(text: string, textOptions?: any) {
    this.push('text', [text, {...textOptions, continued: true}])
  }
}

export class PdfKitH1Opt extends PdfkitTextOpt {
  constructor(text: string) {
    super(text,
      {
        fontSize: 18,
        fontWeight: 500
      }
    )
  }
}

export class PdfKitH2Opt extends PdfkitTextOpt {
  constructor(text: string) {
    super(text,
      {
        fontSize: 16,
        fontWeight: 300
      }
    )
  }
}

export class PdfKitParagraphOpt extends PdfkitTextOpt {
  constructor(text: string) {
    super(text,
      {
        fontSize: 12,
        fontWeight: 300
      }
    )
  }
}