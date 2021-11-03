import React from 'react'
import styled from 'styled-components'
import { DATA_POLICY_PATH } from '@const/routes'
import { Typography, TypographyVariant } from '@components/elements/typography'

export const OnPagePrivacyLayer1En = () => (
  <>
    <Typography variant={TypographyVariant.ExtraSmall}>In compliance with the provisions of Regulation 2016/679, of the European Parliament and of the Council, of April 27, 2016 (GDRP), Aragon Labs, as data controller, informs you that your personal data is accurate for the provision of the interested request, and that these data will be processed, as indicated in the record of the processing activities provided for in article 30 of the GDRP.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}>The following information is also provided <strong> (Layer 1)</strong>:</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Responsible</strong> - The personal data that is collected directly from the applicant for the voting process will be treated confidentially and will be incorporated into the corresponding treatment activity owned by Aragon Labs</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Purpose</strong> - Sending information, advertising, subscription to the newsletter of news and assistance</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Legitimation</strong> - The legal basis for the treatment in relation to sending information, assistance Advertising and advertising on Aragon Labs products and services is the consent referred to in article 6.1.a) GDRP, and article 7 of the GDRP.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Recipients</strong> - Your personal data will not be transferred to third parties, nor will it be transferred outside the European Union</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Rights</strong> - Access, rectify and delete data, as well as other rights, as explained in the additional information</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Additional Information (layer 2)</strong> - You can consult the additional information and detailed information on Data Protection on our website: <a target="_blank" href={DATA_POLICY_PATH}>https://vocdoni.app{DATA_POLICY_PATH}</a></Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Source (provenance) of the data in the event that the personal data has not been obtained directly from you </strong> - Does not apply.</Typography>
    <br /><br />
  </>
)