import React from 'react'
import styled from 'styled-components'

export const CsvTerms1En = () => (
  <>
    <PrivacyWrapper>
      <p>Aragon expressly informs applicants of this electronic voting service of the following:</p>
      <p>1) In relation to the provision of this electronic voting service, Aragon does not treat the personal data of participants in electronic voting in any case. (the voters). Said data is processed exclusively by the entity / applicant that contracts the electronic voting service from Aragon through these general conditions. For this reason, the entity / applicant is responsible for the processing of said data, and is obliged to comply with the obligations pertoque in such condition.</p>
      <p>2) Aragon only processes certain contact data of the entities / service applicants, in relation to which it acquires the status of data controller and complies with the obligations of Regulation (EU) 2016/679 of the European Parliament and of the Council of April 27, 2016 on the protection of natural persons with regard to the processing of personal data and the free circulation of these data and by which Directive 95/46/EC (General Data Protection Regulation) is repealed, and Spanish Organic Law 3/2018, of December 5, on the Protection of Personal Data and guarantee of digital rights (LOPDGDD).</p>
      <p>3) The result of the electronic voting will be publicly available on Vochain, a public blockchain for reading and permission to write. Therefore, the entity / applicant is informed that it is not possible to control that the reading of said results.</p>
      <p>4) Aragon warns that depending on the attributes required by the entity / applicant from the voters in the voting process, the re-identification of said voters may become possible. For this reason, Aragon recommends that, taking into account the sensitivity of the specific vote, the set of attributes required of the voters by the entity / applicant does not allow their re-identification. Likewise, the use of DNI / NIF or similar unique identification data is prohibited, in those votes whose exercise involves the treatment of special categories of personal data as indicated in article 9 of the RGPD. For example: voting on political opinions.</p>


    </PrivacyWrapper>
  </>
)

const PrivacyWrapper = styled.div`
& h2 {
text-align: center;
}
& > ul > li  {
font-size: small;
}
`
