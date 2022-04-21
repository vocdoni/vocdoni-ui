import i18n from "@i18n";
import { SingleChoiceQuestionResults, ProcessDetails } from 'dvote-js'
import { colors } from "@theme/colors";

import { PdfGenerator } from "./pdf-generator";
import RouterService from "./router";
import { IProcessResults, VotingType } from "./types";

interface IResultsPdfGeneratorOptions {
  process: ProcessDetails;
  processResults: IProcessResults;
}

export class ResultPdfGenerator extends PdfGenerator {
  private readonly process: ProcessDetails;
  private readonly processResults: IProcessResults;
  private logoHeader: string;
  constructor({ process, processResults }: IResultsPdfGeneratorOptions) {
    super();

    this.process = process;
    this.processResults = processResults;

    this.pdf.on('pageAdded', this.generateHeader.bind(this))
  }

  private fetchImageUri(imageUrl: string): Promise<string> {
    return fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))
  }

  private  generateHeader() {
      this.addHeaderStroke(colors.textAccent1)
      this.addImage(this.logoHeader, { width: 100, top: 30, left: 20})
      this.addSpace(3)
  }

  private async generatePdfContent() {
    const processVotingType: VotingType = this.process?.state?.censusOrigin as any
    const totalVotes =
      VotingType.Weighted === processVotingType
        ? this.processResults?.totalWeightedVotes
        : this.processResults?.totalVotes

    this.logoHeader = await this.fetchImageUri(RouterService.instance.get('/media/logo_coec.png', {}))
    this.generateHeader()
    this.addTitle(i18n.t('results.pdf.process_title'), { align: 'left', fontColor: colors.text, margin: 0.5 })
    this.addText(this.process.metadata.title.default, { fontSize: 18, margin: 2, fontColor: colors.lighterText })
    this.addTitle(i18n.t('results.pdf.process_description'), { width: 400, align: 'left', fontColor: colors.text, margin: 0.5  })
    this.addMdText(this.process.metadata.description.default)
    this.addSpace(1)
    this.addSubTitle(i18n.t('results.pdf.total_votes', { votes: totalVotes }), { align: 'left' })
    this.addTitle(i18n.t('results.pdf.questions'), { align: 'left', margin: 1, fontColor: colors.text  })

    this.addSeparator(colors.lightBorder)

    for (const question of this.processResults.questions) {
      await this.generateQuestion(question)
    }
  }

  private async generateQuestion(question: SingleChoiceQuestionResults) {
    this.addTitle(`${i18n.t('results.pdf.title')}: ${question.title.default}`, { align: 'left', fontSize: 16 })
    this.addText(i18n.t('results.pdf.results'), { fontSize: 14})
    this.addSpace(1)

    for (const result of question.voteResults) {
      this.addText(`${i18n.t('results.pdf.choice')}: ${result.title.default}`)
      this.addText(`${i18n.t('results.pdf.votes', { votes: result.votes.toString() })}`, { fontSize: 12, margin: 0 })
      this.addSpace(1)
    }
    
    this.addSpace(2)
  }


  public async generatePdfUrl(): Promise<string> {
    await this.generatePdfContent()

    return this.downloadPdf()
  }

}