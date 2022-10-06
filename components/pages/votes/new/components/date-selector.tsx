import { DateTimePicker } from "@components/blocks-v2"
import { Card, Col, Row, Text } from "@components/elements-v2"
import { addOffsetToDate } from "@lib/date"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { PreregisterTimeline } from "./preregister-timeline"
import { RadioButtonGroup } from "./radio-buttons"
import { Application } from 'react-rainbow-components'

export enum StartOptions {
  Inmediatly = 'inmediatly',
  Date = 'date'
}
export enum EndOptions {
  Manually = 'manually',
  Date = 'date'
}
export interface IDateSelectorProps {
  anonymousVoting?: boolean
  onChangeDate: (processDate: IProcessPeriod, invalidDate: boolean) => void
}
const MIN_DELAY_TIME = 10
export interface IProcessPeriod {
  start: Date
  end: Date
  startOption: StartOptions
  endOption: EndOptions
}


const getStartDate = (anonymous: boolean): Date => {
  if (anonymous) {
    return addOffsetToDate(new Date(), 7)
  }
  return addOffsetToDate(new Date(), 0, 1)
}
const getEndDate = (anonymous: boolean): Date => {
  if (anonymous) {
    return addOffsetToDate(new Date(), 14)
  }
  return addOffsetToDate(new Date(), 7)
}
export const DateSelector = (props: IDateSelectorProps) => {
  const { i18n } = useTranslation()
  const [startOption, setStartOption] = useState(StartOptions.Date)
  const [endOption, setEndOption] = useState(EndOptions.Date)
  const [invalidStartDate, setInvalidStartDate] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date>(getStartDate(props.anonymousVoting))
  const [endDate, setEndDate] = useState<Date>(getEndDate(props.anonymousVoting))
  // When date changes
  useEffect(() => {
    const invalidDate =
      startDate.getTime() <
      addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME - 1).getTime()

    setInvalidStartDate(invalidDate)

    if (endDate < startDate) {
      setEndDate(addOffsetToDate(new Date(startDate), 7))
    }

    props.onChangeDate({ start: startDate, end: endDate, startOption, endOption }, invalidDate)
  }, [startDate, endDate, startOption, endOption])
  const startOptions = [
    {
      label: i18n.t('votes.new.start_on_a_specific_date'),
      value: StartOptions.Date
    },
    {
      label: i18n.t('votes.new.start_inmediatly'),
      value: StartOptions.Inmediatly
    },
  ]
  const endOptions = [
    {
      label: i18n.t('votes.new.end_on_a_specific_date'),
      value: EndOptions.Date
    },
    // {
    //   label: i18n.t('votes.new.end_manually'),
    //   value: EndOptions.Manually
    // },
  ]
  const handleChangeStartOption = (e) => {
    setStartOption(e)
  }
  const handleChangeEndOption = (e) => {
    setEndOption(e)
  }

  const theme = {
    rainbow: {
      palette: {
        brand: '#46C4C2',
      },
    },
  }

  return (
    <Card variant='outlined' padding='24px 40px'>
      <Row gutter="xl">
        <Col xs={12}>
          <Row>
            <Col xs={6}>
              <Row gutter='md'>
                {/* TITILE */}
                <Col xs={12}>
                  <Text size='lg' weight='bold' color='dark-blue'>
                    {i18n.t('votes.new.start')}
                  </Text>
                </Col>
                {/* BUTTONS */}
                {!props.anonymousVoting &&
                  <Col xs={12}>
                    <RadioButtonGroup
                      value={startOption}
                      options={startOptions}
                      onChange={handleChangeStartOption}
                    />
                  </Col>
                }
                {/* INPUT */}
                <Col xs={11} disableFlex>
                  <Application theme={theme}>
                    <DateTimePicker
                      value={startDate}
                      placeholder={i18n.t("votes.new.select_date_and_time")}
                      cardError={invalidStartDate}
                      minDate={addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME)}
                      onChange={(value) => setStartDate(value)}
                      disabled={startOption === StartOptions.Inmediatly}
                    />
                  </Application>
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <Row gutter='md'>
                {/* TITILE */}
                <Col xs={12}>
                  <Text size='lg' weight='bold' color='dark-blue'>
                    {i18n.t('votes.new.end')}
                  </Text>
                </Col>
                {/* BUTTONS */}

                {!props.anonymousVoting &&
                  <Col xs={12}>
                    <RadioButtonGroup
                      value={endOption}
                      options={endOptions}
                      onChange={handleChangeEndOption}
                    />
                  </Col>
                }
                {/* INPUT */}
                <Col xs={11} disableFlex>
                  <Application theme={theme}>
                    <DateTimePicker
                      value={endDate}
                      placeholder={i18n.t("votes.new.select_date_and_time")}
                      error={invalidStartDate}
                      onChange={(value) => setEndDate(value)}
                    />
                  </Application>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {props.anonymousVoting &&
          <>
            <Col xs={12}>
              <Text size='xs' color='light-gray'>
                {i18n.t('votes.new.calendar.subtitleAnonymous')}
              </Text>
            </Col>
            <Col xs={12}>
              <PreregisterTimeline
                startDate={startDate}
                endDate={endDate}
              />
            </Col>
          </>
        }
      </Row>
    </Card>
  )
}

      // <Row>
      //   <Col xs={6}>
      //     <Row gutter='md'>
      //       {/* TITILE */}
      //       <Col xs={12}>
      //         <Text size='lg' weight='bold' color='dark-blue'>
      //           Start
      //         </Text>
      //       </Col>
      //       {/* BUTTONS */}
      //       {!anonymousVoting &&
      //         <Col xs={12}>
      //           <RadioButtonGroup
      //             value={startOption}
      //             options={startOptions}
      //             onChange={handleChangeStartOption}
      //           />
      //         </Col>
      //       }
      //       {/* INPUT */}
      //       <Col xs={11} disableFlex>
      //         <DateTimePicker
      //           error={invalidStartDate}
      //           minDate={addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME)}
      //           onChange={(value) => setStartDate(value)}
      //           disabled={startOption === RadioOptions.StartNow}
      //         />
      //         {/* <InputContainer onFocus={}>
      //           <StyledInput
      //             placeholder='aaaaaaaa'
      //           />
      //           <StyledIcon name='eye' />
      //         </InputContainer> */}

      //         {/* // error={invalidStartDate}
      //         // minDate={addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME)}
      //         // onChange={(value) => setStartDate(value)}
      //         // disabled={startOption === RadioOptions.StartNow}
      //         /> */}
      //       </Col>

      //     </Row>
      //   </Col>
      //   <Col xs={6}>
      //     <Row gutter='md'>
      //       {/* TITILE */}
      //       <Col xs={12}>
      //         <Text size='lg' weight='bold' color='dark-blue'>
      //           End
      //         </Text>
      //       </Col>
      //       {/* BUTTONS */}

      //       {!anonymousVoting &&
      //         <Col xs={12}>
      //           <RadioButtonGroup
      //             value={endOption}
      //             options={endOptions}
      //             onChange={handleChangeEndOption}
      //           />
      //         </Col>
      //       }
      //       {/* INPUT */}
      //       <Col xs={11} disableFlex>
      //         <DateTimePicker />
      //       </Col>

      //     </Row>
      //   </Col>

      //   {anonymousVoting &&
      //         <Col xs={12}>
      //           <PreregisterTimeline>
      //           </PreregisterTimeline>
      //         </Col>
      //       }
      // </Row>
