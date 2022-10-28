import { SectionContainer } from '@/components/layout/containers'
import {
  AttributeContainerRow,
  AttributeContainerRowSkeleton,
} from '@/components/layout/containers'
import { PartyAttribute } from '@/types/attribute.types'
import { Alert, Box } from '@mui/material'
import React from 'react'

interface PartyAttributesListProps {
  title: string
  description: string
  noAttributesLabel: string
  attributes: Array<PartyAttribute>
  actions?: Array<{ label: string; action: (id: string) => void }>
  showRedBorder?: boolean
}

const redBorderSx = { border: 1, borderColor: 'error.main' }

export const PartyAttributesList: React.FC<PartyAttributesListProps> = ({
  title,
  description,
  noAttributesLabel,
  attributes,
  actions = [],
  showRedBorder,
}) => {
  return (
    <SectionContainer sx={showRedBorder ? redBorderSx : {}}>
      <SectionContainer.Title>{title}</SectionContainer.Title>
      <SectionContainer.Subtitle>{description}</SectionContainer.Subtitle>
      <SectionContainer.Content>
        <Box sx={{ listStyle: 'none', pl: 0, my: 0 }} component="ul">
          {attributes.map((attribute) => {
            return (
              <Box component="li" key={attribute.id}>
                <AttributeContainerRow attribute={attribute} buttons={actions} />
              </Box>
            )
          })}
          {attributes.length <= 0 && <Alert severity="info">{noAttributesLabel}</Alert>}
        </Box>
      </SectionContainer.Content>
    </SectionContainer>
  )
}

interface PartyAttributesListSkeletonProps {
  title: string
  description: string
  showRedBorder?: boolean
}

export const PartyAttributesListSkeleton: React.FC<PartyAttributesListSkeletonProps> = ({
  title,
  description,
  showRedBorder,
}) => {
  return (
    <SectionContainer sx={showRedBorder ? redBorderSx : {}}>
      <SectionContainer.Title>{title}</SectionContainer.Title>
      <SectionContainer.Subtitle>{description}</SectionContainer.Subtitle>
      <SectionContainer.Content>
        <Box sx={{ pl: 0, my: 0 }}>
          <AttributeContainerRowSkeleton />
          <AttributeContainerRowSkeleton />
          <AttributeContainerRowSkeleton />
        </Box>
      </SectionContainer.Content>
    </SectionContainer>
  )
}
