import React from 'react'
import styled from 'styled-components'
import { DATA_POLICY_PATH } from '@const/routes'


export const PrivacyLayer1En = () => (
  <>

    <p>
    In compliance with the provisions of Regulation 2016/679, of the European Parliament and of the Council, of April 27, 2016 (GDPR), Aragon Labs, as data controller, informs you that your personal data is accurate for the provision of the contracted service, and that these data will be processed, in accordance with what is indicated in the record of the processing activities provided for in article 30 of the GDPR.
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
            <td> <p>The proper provision of the contracted electronic voting services.</p>
<p>The proper relationship with the applicants of the electronic voting service, and the commercial management and services.</p>
</td>
          </tr>
          <tr>
            <td>Legitimation</td>
            <td> <p>The legal basis for the processing of your data is the execution of the contract referred to in article 6.1.b) GDPR.</p>
            <p>The legal basis for maintaining business relationships is the legitimate interest of Aragon Labs referred to in article 6.1.f) GDPR.</p>
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
