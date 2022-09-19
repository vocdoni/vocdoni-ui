import React from 'react'
import styled from 'styled-components'
import { DATA_POLICY_PATH } from '@const/routes'
import { Typography, TypographyVariant } from '@components/elements/typography'

export const OnPagePrivacyLayer1En = () => (
  <>
    <Typography variant={TypographyVariant.ExtraSmall}>In compliance with the provisions of Regulation 2016/679, of the European Parliament and of the Council, of April 27, 2016 (GDRP), Aragon, as data controller, informs you that your personal data is accurate for the provision of the interested request, and that these data will be processed, as indicated in the record of the processing activities provided for in article 30 of the GDRP.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}>The following information is also provided <strong> (Layer 1)</strong>:</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Responsible</strong> - The personal data that is collected directly from the applicant for the voting process will be treated confidentially and will be incorporated into the corresponding treatment activity owned by Aragon.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Purpose</strong> - Sending information, advertising, subscription to the newsletter of news and assistance.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Legitimation</strong> - The legal basis for the treatment in relation to sending information, assistance Advertising and advertising on Aragon products and services is the consent referred to in article 6.1.a) GDRP, and article 7 of the GDRP.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Recipients</strong> - Aragon shares personal information with other Aragon companies, among the Aragon Association group or third party service providers that assist Aragon providing services. This may include sharing information with third party contractors, bound by obligations of confidentiality, in connection with the processing of user's personal information for the purposes described in this Policy, such as, but not limited to, IT and communications service providers, third parties relevant to the services that Aragon provides including regulators, authorities and governmental institutions. Aragon may transfer personal information outside Europe. In those cases Aragon will ensure that it is protected and transferred in a manner consistent with legal requirements applicable to the information. The data subject consents that the data will be shared between Aragon and the Aragon Association and other partners of the Aragon Network that require the data in order to adequately perform their duties.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Rights</strong> - Access, rectify and delete data, as well as other rights, as explained in the additional information.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Additional Information (layer 2)</strong> - You can consult the additional information and detailed information on Data Protection on our website: <a target="_blank" href={DATA_POLICY_PATH}>https://vocdoni.app{DATA_POLICY_PATH}</a>.</Typography>
    <Typography variant={TypographyVariant.ExtraSmall}><strong>Source (provenance) of the data in the event that the personal data has not been obtained directly from you </strong> - Does not apply.</Typography>
    <br /><br />
  </>
)
