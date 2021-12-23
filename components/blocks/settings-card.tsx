import { FlexContainer } from "@components/elements/flex"
import { useIsMobile } from "@hooks/use-window-size"
import { useTranslation } from "react-i18next"
import { If, Then, Else, When } from "react-if"
import { Column } from "react-rainbow-components"
import styled from "styled-components"
import { Card } from "./card"
import { Tag } from "./tag"

type ISettingsCardProps = {
  isWeigthed?: boolean | false
  isAnonymous?: boolean | false
}
export const SettingsCard = (props: ISettingsCardProps) => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  const settingsIcon = (
    <img
      src="/images/vote/settings.svg"
      // alt={i18n.t('vote.calendar_image_alt')}
    />
  )
  return (
    <Card icon={settingsIcon} title={i18n.t('vote.settings')} matchHeight>
      <Grid isMobile={isMobile}>
      <If condition={props.isWeigthed}>
        <Then>
          <Tag variant="neutral" large>
            {i18n.t("vote.tag_is_weighted")}
          </Tag>
        </Then>
        <Else>
          <Tag variant="neutral" large>
            {i18n.t("vote.tag_is_normal")}
          </Tag>
        </Else>
      </If>
      <When condition={props.isAnonymous}>
        <Tag variant="neutral" large>
          {i18n.t("vote.tag_is_anonymous")}
        </Tag>
      </When>
      </Grid>
    </Card>
  )
}

const Grid = styled.div<{isMobile?:boolean}>`
  display: flex;
  flex-wrap: wrap;
  grid-gap: 8px 8px;
  margin-top: ${({isMobile})=> isMobile? '16px': '24px'};
`
