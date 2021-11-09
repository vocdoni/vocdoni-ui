import { DATA_POLICY_PATH } from '@const/routes'
import React from 'react'
import styled from 'styled-components'

export const TermsLayer1En = () => (
  <>

    <p>
      In compliance with the provisions of Regulation 2016/679, of the European Parliament and of the Council, of April 27, 2016 (GDRP), Aragon Labs, as data controller, informs you that your personal data is accurate for the provision of the interested request, and that these data will be processed, as indicated in the record of the processing activities provided for in article 30 of the GDRP.
    </p>

    <p>The following information is also provided <strong> (Layer 1)</strong>:</p>
    <TableWrapper>
      <table>
        <tbody>
        <tr>
        <td colSpan={2}>Basic Information on Data Protection</td>
        </tr>
          <tr>
            <td>Responsible</td>
            <td>The personal data that is collected directly from the applicant for the voting processes will be treated confidentially and will be incorporated into the corresponding treatment activity owned by Aragon Labs.</td>
          </tr>
          <tr>
            <td>Purpose</td>
            <td>Sending information, advertising, subscription to the newsletter of news and assistance.</td>
          </tr>
          <tr>
            <td>Legitimation</td>
            <td> <p>
            The legal basis for the treatment in relation to sending information, assistance Advertising and advertising on Aragon Labs products and services is the consent referred to in article 6.1.a) GDRP, and article 7 of the GDRP.
              </p>
            </td>
          </tr>
          <tr>
            <td>Recipients</td>
            <td>Aragon Labs shares personal information with other Aragon companies, among the Aragon Association group or third party service providers that assist Aragon Labs providing services. This may include sharing information with third party contractors, bound by obligations of confidentiality, in connection with the processing of user's personal information for the purposes described in this Policy, such as, but not limited to, IT and communications service providers, third parties relevant to the services that Aragon Labs provides including regulators, authorities and governmental institutions. Aragon Labs may transfer personal information outside Europe. In those cases Aragon will ensure that it is protected and transferred in a manner consistent with legal requirements applicable to the information. The data subject consents that the data will be shared between Aragon Labs and the Aragon Association and other partners of the Aragon Network that require the data in order to adequately perform their duties.</td>
          </tr>
          <tr>
            <td>Rights</td>
            <td>Access, rectify and delete data, as well as other rights, as explained in the additional information Additional.</td>
          </tr>
          <tr>
            <td>Additional Information (layer 2)</td>
            <td>You can consult the additional information and detailed information on Data Protection on our website:
            <a target="_blank" href={DATA_POLICY_PATH}>https://vocdoni.app{DATA_POLICY_PATH}</a>.
            </td>
          </tr>
          <tr>
            <td>Source (provenance) of the data in the event that the personal data has not been obtained directly from you</td>
            <td>Does not apply.</td>
          </tr>
        </tbody>
      </table>
    </TableWrapper>
  </>
)


const TableWrapper = styled.div`
  & > table > tbody > tr > td {
    padding: 10px;
    border: solid 3px ${({ theme }) => theme.lightBorder};
  }

  & > table > tbody > tr > td:first-child {
    font-weight: bold;
  }
`
