import styled from "styled-components"
import { ColumnProps } from "./grid"
import { Label } from "./label"
import { ReactNode } from "react"
import i18n from "../i18n"

type VoteListItemProps = ColumnProps & {
  icon: ReactNode,
  entityName: string,
  entityId: string,
  processId: string,
  title: string,
  description: string,
  status: "active" | "paused" | "ended",
  dateText: string
}

export const VoteListItem = ({ icon, entityId, entityName, processId, title, description, status, dateText }: VoteListItemProps) => <ListItemDiv>
  <TopDiv>
    <EntityNameDiv>
      {icon}<EntityName>{entityName}</EntityName>
    </EntityNameDiv>
    <VoteStatus>
      <Label>{(() => {
        switch (status) {
          case "active": return i18n.t("vote.active_vote")
          case "paused": return i18n.t("vote.paused_vote")
          case "ended": return i18n.t("vote.ended_vote")
          default: return ""
        }
      })()}
      </Label>
    </VoteStatus>
  </TopDiv>

  <VoteListItemTitle>{title}</VoteListItemTitle>
  <VoteListItemDescription>{description}</VoteListItemDescription>
  <VoteListItemDate>{dateText}</VoteListItemDate>
</ListItemDiv>

// Styles

const ListItemDiv = styled.div`
  width: 100%;
  padding: 20px 20px 10px;
  background: ${props => props.theme.white};
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
  box-sizing: border-box;
`

const TopDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const EntityNameDiv = styled.div``
const EntityName = styled.h5`
  display: inline-block;
  margin: 0 6px 10px;
  font-weight: normal;
  font-size: 90%;
  color: ${props => props.theme.text};
`

const VoteListItemTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: ${props => props.theme.text};
  font-weight: normal;
`
const VoteListItemDescription = styled.p`
  color: ${props => props.theme.darkLightFg};
`
const VoteListItemDate = styled.p`
  color: ${props => props.theme.lightText};
  font-size: 80%;
`
const VoteStatus = styled.div``