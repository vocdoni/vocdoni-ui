import React from 'react'
import styled from 'styled-components'
import { DATA_POLICY_PATH } from '@const/routes'

export const PrivacyLayer1En = () => (
  <>
    <p>In compliance with the provisions of Regulation (Eu) 2016/679 Of The European Parliament and of The Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (GDPR), ARAGON LABS, as data controller, informs you that your personal data are necessary for the provision of contracted service, and that these data will be processed, in accordance with what is indicated in the record of processing activities provided in article 30 of GDPR.</p>
    <p>The following information is also provided <strong> (Layer 1)</strong>:</p>
    <TableWrapper>
      <table>
        <tbody>
        <tr>
        <td colSpan={2}>Basic Information on Data Protection</td>
        </tr>
          <tr>
            <td>Responsible</td>
            <td>The personal data that is collected directly from the applicant for the voting process, will be treated confidentially and will be incorporated into the corresponding treatment activity owned by ARAGON LABS.</td>
          </tr>
          <tr>
            <td>Purpose</td>
            <td> 
              <p>The proper provision of the contracted electronic voting services, and commercial, and service management.</p>
            </td>
          </tr>
          <tr>
            <td>Legitimation</td>
            <td><p>The legal basis for the processing of your data is the execution of the contract referred to in article 6.1.b) GDPR. The legal basis for maintaining business relationships, is the legitimate interest of ARAGON LABS referred to in article 6.1.f) GDPR.</p>
            </td>
          </tr>
          <tr>
            <td>Recipients</td>
            <td>Your personal data will not be disclosed to third parties, nor will it be transferred outside the European Union</td>
          </tr>
          <tr>
            <td>Rights</td>
            <td>Access, rectify and delete the data, as well as other rights, as explained in the additional information</td>
          </tr>
          <tr>
            <td>Additional Information (layer 2)</td>
            <td>You can consult the additional and detailed information on Data Protection on our website:
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
