import { Button, Col, Row, Text } from '@components/elements-v2'
import { Icon } from '@components/elements-v2/icons'
import { Input } from '@components/elements-v2/input'
import { InputArea } from '@components/elements-v2/input-area'
import { Select } from '@components/elements-v2/select'
import { useBackend } from '@hooks/backend'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import { emailValidator } from '@lib/validators/email-validator'
import { maxLengthValidator } from '@lib/validators/max-length-validator'
import { minLengthValidator } from '@lib/validators/min-length-validator'
import { requiredValidator } from '@lib/validators/required-validator'
import { colorsV2 } from '@theme/colors-v2'
import { theme } from '@theme/global'
import { useEntity } from '@vocdoni/react-hooks'
import { JsonFeedTemplate } from 'dvote-js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'
import 'styled-components'
import styled from 'styled-components'
import { SocialNetwork, SocialNetworkProps } from './social-network'

export const ContactUsView = () => {
  const { wallet } = useWallet()
  const { getAccount } = useDbAccounts()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [subject, setSubject] = useState({ text: 'General', value: 'general' })
  const [message, setMessage] = useState('')
  const [messageError, setMessageError] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { i18n } = useTranslation()
  const valid = !emailError && !nameError && !messageError
  const { bkPromise } = useBackend()

  // watch for wallet change and
  // set default values to wallet
  // ones
  useEffect(() => {
    if (!wallet?.address) return
    const account = getAccount(wallet?.address)
    setName(account.name)
    setEmail(account.pending.email)
  }, [wallet])

  //  INPUT HANDLERS
  const handleNameInputChange = (e) => {
    const value = e.target.value
    // check and set errors
    setNameError(validateName(value))
    // set new value
    setName(value)
    if (messageSent) {
      setMessageSent(false)
    }
  }
  const handleEmailInputChange = (e) => {
    const value = e.target.value
    // check and set errors
    setEmailError(validateEmail(value))
    // set new value
    setEmail(value)
    if (messageSent) {
      setMessageSent(false)
    }
  }
  const handleSubjectInputChange = (e) => {
    setSubject(e)
    if (messageSent) {
      setMessageSent(false)
    }
  }
  const handleMessageInputChange = (e) => {
    const value = e.target.value
    // check and set errors
    setMessageError(validateMessage(value))
    // set new value
    setMessage(value)
    if (messageSent) {
      setMessageSent(false)
    }
  }
  const handleSubmit = async () => {
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const messageError = validateMessage(message)
    setNameError(nameError)
    setEmailError(emailError)
    setMessageError(messageError)
    if (!nameError && !emailError && !messageError) {
      setIsLoading(true)
      try {
        const bk = await bkPromise
        await bk.sendRequest(
          {
            // TODO
            // add sendContactMsg to the available methods
            method: 'sendContactMsg',
            entity: {
              name,
              email,
              subject,
              message
            },
          }
        )
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.error(err)
      }
      // setTimeout(() => {
      //   setMessageSent(true)
      //   setIsLoading(false)
      // }, 5000)
      // console.warn('TODO SEND EMAIL')
    }
  }

  const socials: SocialNetworkProps[] = [
    {
      icon: 'twitter',
      text: 'Twitter',
      link: 'https://twitter.com/vocdoni'
    },
    {
      icon: 'discord',
      text: 'Discord',
      link: 'https://discord.com/invite/aragon'
    },
    {
      icon: 'telegram',
      text: 'Telegram',
      link: 'https://t.me/s/vocdoni'
    }
  ]
  const subjectOptions = [
    {
      text: 'General',
      value: 'general'
    },
    {
      text: 'Support Request',
      value: 'support-request'
    },
    {
      text: 'Business',
      value: 'business'
    },
    {
      text: 'Other',
      value: 'other'
    }
  ]
  return (
    <Container>
      <Row gutter='5xl'>
        <Col xs={12}>
          <Row gutter='lg'>
            <Col xs={12}>
              <Text weight='bold' size='3xl' color='dark-blue'>
                {i18n.t('contact_us.title')}
              </Text>
            </Col>
            <Col xs={12}>
              <Row gutter='md' align='center'>
                <Col>
                  <Icon name='mail' size={32} />
                </Col>
                <Col>
                  <StyledAnchor href={'mailto:' + i18n.t('contact_us.email')}>
                    {i18n.t('contact_us.email')}
                  </StyledAnchor>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row gutter='xl'>
            <Col xs={12}>
              <Text color='light-gray' size='lg' weight='semi-bold'>
                {i18n.t('contact_us.or_send_us_a_message')}
              </Text>
            </Col>
            <Col xs={12}>
              <Input
                hideMesages
                type='text'
                onChange={handleNameInputChange}
                value={name}
                error={nameError}
                label={i18n.t('contact_us.name_field.label')}
                placeholder={i18n.t('contact_us.name_field.placeholder')}
              />
            </Col>
            <Col xs={12}>
              <Input
                hideMesages
                type='text'
                label={i18n.t('contact_us.email_field.label')}
                value={email}
                error={emailError}
                placeholder={i18n.t('contact_us.email_field.placeholder')}
                onChange={handleEmailInputChange}
              />
            </Col>
            <Col xs={12}>
              <Select
                onChange={handleSubjectInputChange}
                defaultValue={subject}
                label="Subject"
                options={subjectOptions}
              />
            </Col>
            <Col xs={12}>
              <InputArea
                hideMesages
                error={messageError}
                value={message}
                label={i18n.t('contact_us.message_field.label')}
                placeholder={i18n.t('contact_us.message_field.placeholder')}
                onChange={handleMessageInputChange}
              >

              </InputArea>
            </Col>
            <Col xs={12} md={messageSent ? 12 : 5}>
              <If condition={!messageSent}>
                <Then>
                  <Button
                    variant='primary'
                    disabled={!valid}
                    onClick={handleSubmit}
                    loading={isLoading}
                  >
                    {i18n.t('contact_us.send')}
                  </Button>
                </Then>
                <Else>
                  <Row gutter='2xs'>
                    <Col xs={12}>
                      <Text color='success' size='2xl' weight='semi-bold'>
                        {i18n.t('contact_us.message_sent.title')}
                      </Text>
                    </Col>
                    <Col xs={12}>
                      <Text color='dark-gray' size='sm' weight='medium'>
                        {i18n.t('contact_us.message_sent.subtitle')}
                      </Text>
                    </Col>
                  </Row>
                </Else>
              </If>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row gutter='xl'>
            <Col xs={12}>
              <Text color='light-gray' size='lg' weight='semi-bold'>
                {i18n.t('contact_us.find_us_in_the_web')}
              </Text>
            </Col>
            <Col xs={12}>
              <Row gutter='md'>
                {socials.map((item, i) => (
                  <Col xs={12} key={i}>
                    <SocialNetwork {...item} />
                  </Col>
                ))
                }
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
const Container = styled.div`
max-width: 490px;
width: 100%;
border: none;
margin: auto;
`
const StyledAnchor = styled.a`
  color: ${theme.blueText};
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  font-family: Manrope;
`

// NAME VALIDATOR
function validateName(value: string): string {
  let err: Error
  err = requiredValidator(value)
  if (err) {
    return err.message
  }
  err = minLengthValidator(value, 3)
  if (err) {
    return err.message
  }
  err = maxLengthValidator(value, 40)
  if (err) {
    return err.message
  }
  return ''
}

// EMAIL VALIDATOR
function validateEmail(value: string): string {
  let err: Error
  err = requiredValidator(value)
  if (err) {
    return err.message
  }
  err = emailValidator(value)
  if (err) {
    return err.message
  }
  err = maxLengthValidator(value, 55)
  if (err) {
    return err.message
  }
  return ''
}

// MESSAGE VALIDATOR
function validateMessage(value: string): string {
  let err: Error
  err = requiredValidator(value)
  if (err) {
    return err.message
  }
  err = maxLengthValidator(value, 600)
  if (err) {
    return err.message
  }
  return ''
}

