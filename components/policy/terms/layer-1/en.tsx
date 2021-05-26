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
            <td>The personal data that is collected directly from the applicant for the voting process will be treated confidentially and will be incorporated into the corresponding treatment activity owned by Aragon Labs
</td>
          </tr>
          <tr>
            <td>Purpose</td>
            <td> Sending information, advertising, subscription to the newsletter of news and assistance</td>
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
            <td>Your personal data will not be transferred to third parties, nor will it be transferred outside the European Union</td>
          </tr>
          <tr>
            <td>Rights</td>
            <td>Access, rectify and delete data, as well as other rights, as explained in the additional information Additional</td>
          </tr>
          <tr>
            <td>Additional Information (layer 2)</td>
            <td>You can consult the additional information and detailed information on Data Protection on our website::
            <a target="_blank" href={DATA_POLICY_PATH}>https://vocdoni.app{DATA_POLICY_PATH}</a>
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
