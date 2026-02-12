import { SectionContainer } from '@/components/layout/containers'
import { AddAttributesToForm } from '@/components/shared/AddAttributesToForm'
import { useActiveTab } from '@/hooks/useActiveTab'
import { type AttributeKey } from '@/types/attribute.types'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'

type AttributesSectionProps = {
  version?: string
  isEServiceCreatedFromTemplate: boolean
  handleOpenAttributeCreateDrawerFactory: (
    attributeKey: Exclude<AttributeKey, 'certified'>
  ) => () => void
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({
  version,
  isEServiceCreatedFromTemplate,
  handleOpenAttributeCreateDrawerFactory,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })

  const { activeTab, updateActiveTab } = useActiveTab('certified')

  return (
    <SectionContainer
      title={t('step3.attributesTitle', { versionNumber: version ?? '1' })}
      description={t('step3.attributesDescription')}
      sx={{ mt: 3 }}
    >
      <TabContext value={activeTab}>
        <TabList onChange={updateActiveTab} aria-label={t('step2.attributes.tabs.ariaLabel')}>
          <Tab label={t('step2.attributes.tabs.certified')} value="certified" />
          <Tab label={t('step2.attributes.tabs.verified')} value="verified" />
          <Tab label={t('step2.attributes.tabs.declared')} value="declared" />
        </TabList>
        <TabPanel value="certified">
          <AddAttributesToForm
            attributeKey="certified"
            readOnly={isEServiceCreatedFromTemplate}
            withThreshold
          />
        </TabPanel>
        <TabPanel value="verified">
          <AddAttributesToForm
            attributeKey="verified"
            readOnly={isEServiceCreatedFromTemplate}
            openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('verified')}
          />
        </TabPanel>
        <TabPanel value="declared">
          <AddAttributesToForm
            attributeKey="declared"
            readOnly={isEServiceCreatedFromTemplate}
            openCreateAttributeDrawer={handleOpenAttributeCreateDrawerFactory('declared')}
          />
        </TabPanel>
      </TabContext>
    </SectionContainer>
  )
}
