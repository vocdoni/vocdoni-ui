import styled from "styled-components"
import Link from "next/link"
import { ColumnProps } from "./grid"
import { Tag } from "./tag"
import { ReactNode } from "react"
import i18n from "../i18n"
import { SHOW_PROCESS_PATH } from "../const/routes"
import { FlexAlignItem, FlexContainer } from "./flex"

export enum VoteStatusType {
  Active = 'active',
  Paused = 'paused',
  Ended = 'ended'
}

type VoteListItemProps = ColumnProps & {
  icon: ReactNode,
  entityName: string,
  processId: string,
  title: string,
  description: string,
  status: VoteStatusType,
  dateText: string
}

export const VoteListItem = ({ icon, entityName, processId, title, description, status, dateText }: VoteListItemProps) => (
  <Link href={SHOW_PROCESS_PATH + "#/" + processId}>
    <a>
      <ListItemDiv>
        <TopDiv>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            {icon}<EntityName>{entityName}</EntityName>
          </FlexContainer>
          <VoteStatus>
            <Tag>{(() => {
              switch (status) {
                case VoteStatusType.Active: return i18n.t("vote.active_vote")
                case VoteStatusType.Paused: return i18n.t("vote.paused_vote")
                case VoteStatusType.Ended: return i18n.t("vote.ended_vote")
                default: return ""
              }
            })()}
            </Tag>
          </VoteStatus>
        </TopDiv>

        <VoteListItemTitle>{title}</VoteListItemTitle>
        <VoteListItemDescription><span dangerouslySetInnerHTML={{ __html: description }} /></VoteListItemDescription>
        <VoteListItemDate>{dateText}</VoteListItemDate>
      </ListItemDiv>
    </a>
  </Link>
)

// Styles

const ListItemDiv = styled.div`
  width: 100%;
  padding: 20px 20px 10px;
  background: ${props => props.theme.white};
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
  box-sizing: border-box;

  &:hover {
    background-color: ${props => props.theme.lightBg};
  }
  &:active {
    background-color: ${props => props.theme.lightBg2};
  }
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