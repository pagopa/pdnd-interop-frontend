import { SectionContainer } from '@/components/layout/containers'
import { AddAttributesToForm } from '@/components/shared/AddAttributesToForm'
import { useActiveTab } from '@/hooks/useActiveTab'
import { type AttributeKey } from '@/types/attribute.types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Link, Tab, Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'

import { attributesHelpLink } from '@/config/constants'

type EServiceAttributesSectionProps = {
  isEServiceCreatedFromTemplate: boolean
  handleOpenAttributeCreateDrawerFactory: (
    attributeKey: Exclude<AttributeKey, 'certified'>
  ) => () => void
}

export const EServiceAttributesSection: React.FC<EServiceAttributesSectionProps> = ({
  isEServiceCreatedFromTemplate,
  handleOpenAttributeCreateDrawerFactory,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { activeTab, updateActiveTab } = useActiveTab('certified')

  return (
    <SectionContainer
      title={t('step3.attributesTitle')}
      description={
        <Trans
          ns="eservice"
          i18nKey="create.step3.attributesDescription"
          components={{
            1: <Link underline="hover" href={attributesHelpLink} target="_blank" />,
          }}
        />
      }
      sx={{ mt: 3 }}
    >
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 2, borderColor: 'divider', width: 'fit-content' }}>
          <TabList
            onChange={updateActiveTab}
            aria-label={t('step2.attributes.tabs.ariaLabel')}
            sx={{ mb: '-2px' }}
          >
            <Tab label={t('step2.attributes.tabs.certified')} value="certified" />
            <Tab label={t('step2.attributes.tabs.verified')} value="verified" />
            <Tab label={t('step2.attributes.tabs.declared')} value="declared" />
          </TabList>
        </Box>
        <TabPanel value="certified" sx={{ px: 0, pb: 0 }}>
          <Typography variant="body2" sx={{ mb: 3 }}>
            <Trans
              ns="eservice"
              i18nKey="create.step3.certifiedDescription"
              components={{
                1: <Link underline="hover" href={attributesHelpLink} target="_blank" />,
              }}
            />
          </Typography>
          <AddAttributesToForm
            attributeKey="certified"
            readOnly={isEServiceCreatedFromTemplate}
            hideTitle
            addGroupLabel={t('step3.attributesAddBtn')}
            withThreshold
          />
        </TabPanel>
        <TabPanel value="verified" sx={{ px: 0, pb: 0 }}>
          <Typography variant="body2" sx={{ mb: 3 }}>
            <Trans
              ns="eservice"
              i18nKey="create.step3.verifiedDescription"
              components={{
                1: <Link underline="hover" href={attributesHelpLink} target="_blank" />,
              }}
            />
          </Typography>
          <AddAttributesToForm
            attributeKey="verified"
            readOnly={isEServiceCreatedFromTemplate}
            hideTitle
            addGroupLabel={t('step3.attributesAddBtn')}
            createAttributeAction={{
              label: t('step3.attributesCreateBtn'),
              openDrawer: handleOpenAttributeCreateDrawerFactory('verified'),
            }}
          />
        </TabPanel>
        <TabPanel value="declared" sx={{ px: 0, pb: 0 }}>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {t('step3.declaredDescription')}
          </Typography>
          <AddAttributesToForm
            attributeKey="declared"
            readOnly={isEServiceCreatedFromTemplate}
            hideTitle
            addGroupLabel={t('step3.attributesAddBtn')}
            createAttributeAction={{
              label: t('step3.attributesCreateBtn'),
              openDrawer: handleOpenAttributeCreateDrawerFactory('declared'),
            }}
          />
        </TabPanel>
      </TabContext>
    </SectionContainer>
  )
}
