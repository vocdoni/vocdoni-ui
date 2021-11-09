import React from 'react'
import styled from 'styled-components'
import i18n from '@i18n'
import { useCookies } from '@hooks/cookies'
import { Button } from '@components/elements/button'
import { CheckboxToggle } from 'react-rainbow-components';

const CoookiesPage = () => {
  const { acceptCookies, rejectCookies, accepted } = useCookies()

  return (
    <>
      <PrivacyWrapper>
        <h2>Cookies Policy</h2>
        <p ></p>
        <p ></p>
        <h4>Use of cookies</h4>
        <p ></p>
        <p >This website uses "Cookies", and other similar mechanisms (hereinafter, Cookies). Cookies are files sent to a browser through a web server to record the User's activities on a specific
          website or on all websites, apps and / or services on this website. The first purpose of Cookies is to provide
          the User with faster and more personalized access to the services it offers. Cookies are only associated with an
          anonymous User and their computer and do not provide references that allow the User's personal data to be
          deduced.</p>
        <p ></p>
        <p >The User may configure their browser to notify and reject the installation of Cookies
          sent by this website, without affecting the User's ability to access the Contents. However, we point out
          that, in any case, the quality of operation of the website may decrease. </p>
        <p ></p>
        <h4>Typology, purpose and operation of Cookies</h4>
        <p ></p>
        <p >Cookies, depending on their permanence, can be divided into session or permanent cookies.
          The first ones expire when the User closes the browser. The second ones expire depending on when the objective
          for which they serve is fulfilled or when they are manually deleted. </p>
        <p ></p>
        <p >Additionally, depending on their objective, Cookies can be classified as follows:
        </p>
        <p ></p>
        <p >PERFORMANCE COOKIES: This type of Cookie remembers your preferences for the tools found
          in the Services, so you do not have to reconfigure the service every time you visit. As an example, this
          typology includes: Volume settings for video or sound players. The video transmission speeds that are compatible
          with your browser. The objects stored in the &quot;shopping cart&quot; in e-commerce services such as
          stores.</p>
        <p ></p>
        <p >GEO-LOCATION COOKIES: These Cookies are used to find out which country you are in when a
          Service is requested. This Cookie is completely anonymous, and is only used to help guide the content to your
          location. Additionally, some Services may use connectors with social networks such as Facebook or Twitter. When
          the User registers in a Service with credentials of a social network, he authorizes the social network to save a
          persistent Cookie that remembers his identity and guarantees him access to the Services until it expires. The
          User can delete this Cookie and revoke access to the Services through social networks by updating their
          preferences in the specific social network.</p>
        <p ></p>
        <p >ANALYTICAL COOKIES: Every time a User visits a Service, a tool from an external provider
          (Rudderstack) generates an analytical Cookie on the User's computer. This Cookie, which is only
          generated during the visit, will serve in future visits to Aragonlabs.org to anonymously identify the visitor.
          The main objectives pursued are: Allow the anonymous identification of browsing Users through the
          &quot;Cookie&quot; (identifies browsers and devices, not people) and therefore the approximate count of the
          number of visitors and their trend over time. Anonymously identify the most visited content and therefore the
          most attractive to Users. Know if the User who is accessing is a new or repeated visit. Analytical cookies are used to understand how visitors interact with the website.
          These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc. </p>
        <p ></p> <br />
        <h4>
          <CheckboxToggle
            id="accept-analytics"
            value={accepted}
            onChange={(event) => event.target.checked ? acceptCookies() : rejectCookies()}
            label={i18n.t('cookies.analytics')}
            labelAlignment={'left'}
          />
        </h4>
        <p ></p>
        <p >The following table lists the cookies currently being used:</p>
        <table>
          <tbody>
            <tr>
              <th>Cookie</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Description</th>
            </tr>
            <tr>
              <td>rl_page_init_referrer</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rl_page_init_referring_domain</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rl_group_id</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rl_user_id</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rl_group_trait</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rudder_cookies</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rl_anonymous_id</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>test_rudder</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
            <tr>
              <td>rl_trait</td>
              <td>0</td>
              <td>365 days</td>
              <td>Rudderstack analytics cookie</td>
            </tr>
          </tbody>
        </table><br />
        <h4>How to disable Cookies in the main browsers</h4>
        <p ></p>
        <p >Normally it is possible to stop accepting browser Cookies, or to stop accepting Cookies
          from a particular Service. All modern browsers allow you to change the cookie settings. These settings are
          usually found in the 'options' or 'Preferences' of your browser menu. Use the following
          instructions according to your internet browser to change your cookie preferences.</p>
        <p ></p>
        <p >INTERNET EXPLORER.- Tools -&gt; Internet Options -&gt; Privacy -&gt;
          Configuration.</p>
        <p >For more information, you can consult Microsoft support or browser Help.</p>
        <p ></p>
        <p >FIREFOX.- Tools -&gt; Options -&gt; Privacy -&gt; History -&gt; Custom
          Configuration.</p>
        <p >For more information, you can consult Mozilla support or browser Help.</p>
        <p ></p>
        <p >CHROME.- Settings -&gt; Show advanced options -&gt; Privacy -&gt; Content
          settings.</p>
        <p >For more information, you can consult Google support or browser Help.</p>
        <p ></p>
        <p >SAFARI.- Preferences -&gt; Security.</p>
        <p >For more information, you can consult Apple support or browser Help.</p>
        <p ></p>
        <p >Some functionalities of the Services will be disabled, such as, for example, remaining
          identified, keeping purchases in the &quot;shopping cart&quot; in an e-commerce Service, receiving information
          directed to their location or viewing some videos.</p>
        <p ></p>
        <p >Aragon Labs may modify this Cookies Policy based on legislative and regulatory
          requirements, or in order to adapt said policy to the instructions issued by the competent Data Protection
          Authority, therefore Users are advised to periodically visit this page to find out the changes suffered in them.
          When significant changes occur in this Cookies Policy, Users will be notified either through the web or via
          email to Users registered in the newsletter service.</p>
        <p ></p>
        <p >We want to be transparent about the data that we and our partners collect and how we use it so that
          you have greater control over your personal data.</p>

        <SpacedContainer>
          <Button positive href={"/"}>
            {i18n.t('cookies.save')}
          </Button>
        </SpacedContainer>
      </PrivacyWrapper>
    </>
  )
}

const PrivacyWrapper = styled.div`
& h2 {
  text-align: center;
}
& > ul > li  {
  font-size: small;
}
& > ol > li  {
  font-size: small;
}
& > table  {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
  table-layout: fixed;
  overflow-wrap: break-word;
  td {
    border: 1px solid gray;
    padding: 5px;
  }
  th {
    border: 1px solid black;
    padding: 5px;
  }
}
`
const SpacedContainer = styled.div`
  margin-top: 40px;
  margin-bottom: 30px;
`

export default CoookiesPage
