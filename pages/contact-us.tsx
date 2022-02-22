import { PageCard } from "@components/elements/cards"
import { DefaultLayout } from "@components/pages/app/layout-v2/default"
import { ContactUsView } from "@components/pages/contact-us"
import styled from "styled-components"

const ContactUs = () => {
  return (
    <PaddingPageCard>
      <ContactUsView />
    </PaddingPageCard>
  )
}
ContactUs["Layout"] = DefaultLayout
export default ContactUs

const PaddingPageCard = styled(PageCard)`
  padding-top: 48px;
  padding-bottom: 48px;
`
