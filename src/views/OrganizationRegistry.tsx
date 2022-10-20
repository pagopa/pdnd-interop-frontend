import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import { AxiosResponse } from 'axios'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { mixed, object, string } from 'yup'
import {
  AgreementSummary,
  CertifiedTenantAttribute,
  ConsumerAttribute,
  DeclaredTenantAttribute,
  EServiceDocumentRead,
  EServiceReadType,
  FrontendAttributes,
  RequestOutcome,
  VerifiedTenantAttribute,
} from '../../types'
import { AttributeSection } from '../components/AttributeSection'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import PageBottomActionsCard from '../components/Shared/PageBottomActionsCard'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledDeleteableDocument } from '../components/Shared/StyledDeleteableDocument'
import { StyledForm } from '../components/Shared/StyledForm'
import StyledInputControlledFileNew from '../components/Shared/StyledInputControlledFileNew'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledLink } from '../components/Shared/StyledLink'
import StyledSection from '../components/Shared/StyledSection'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { RunAction, RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { useJwt } from '../hooks/useJwt'
import { useRoute } from '../hooks/useRoute'
import {
  checkOwnershipFrontendAttributes,
  remapBackendAttributesToFrontend,
  remapTenantBackendAttributeToFrontend,
} from '../lib/attributes'
import { CHIP_COLORS_AGREEMENT, MAX_WIDTH } from '../lib/constants'
import { getDownloadDocumentName } from '../lib/eservice-utils'
import { downloadFile } from '../lib/file-utils'
import { buildDynamicPath } from '../lib/router-utils'
import { NotFound } from './NotFound'

export function OrganizationRegistry() {
  const { runAction, forceRerenderCounter } = useFeedback()
  const { jwt } = useJwt()

  const {
    data: ownedCertifiedAttributes,
    isLoading: isLoadingOwnedCertifiedAttributes,
    error: ownedCertifiedAttributesError,
  } = useAsyncFetch<{ attributes: Array<CertifiedTenantAttribute> }, Array<ConsumerAttribute>>(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_CERTIFIED_LIST',
        endpointParams: { institutionId: jwt?.organizationId },
      },
    },
    {
      disabled: !jwt?.organizationId,
      mapFn: (data) =>
        remapTenantBackendAttributeToFrontend(data.attributes, 'certified', jwt!.organizationId),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  const {
    data: ownedVerifiedAttributes,
    isLoading: isLoadingOwnedVerifiedAttributes,
    error: ownedVerifiedAttributesError,
  } = useAsyncFetch<{ attributes: Array<VerifiedTenantAttribute> }, Array<ConsumerAttribute>>(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_VERIFIED_LIST',
        endpointParams: { institutionId: jwt?.organizationId },
      },
    },
    {
      disabled: !jwt?.organizationId,
      mapFn: (data) =>
        remapTenantBackendAttributeToFrontend(data.attributes, 'verified', jwt!.organizationId),
    }
  )

  const {
    data: ownedDeclaredAttributes,
    isLoading: isLoadingOwnedDeclaredAttributes,
    error: ownedDeclaredAttributesError,
  } = useAsyncFetch<{ attributes: Array<DeclaredTenantAttribute> }, Array<ConsumerAttribute>>(
    {
      path: {
        endpoint: 'ATTRIBUTE_GET_DECLARED_LIST',
        endpointParams: { institutionId: jwt?.organizationId },
      },
    },
    {
      disabled: !jwt?.organizationId,
      mapFn: (data) =>
        remapTenantBackendAttributeToFrontend(data.attributes, 'declared', jwt!.organizationId),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  async function handleConfirmDeclaredAttribute(attributeId: string) {
    await runAction(
      {
        path: {
          endpoint: 'ATTRIBUTE_CONFIRM_DECLARED',
        },
        config: {
          data: { id: attributeId },
        },
      },
      { showConfirmDialog: true }
    )
  }

  if (
    ownedCertifiedAttributesError ||
    ownedVerifiedAttributesError ||
    ownedDeclaredAttributesError
  ) {
    return <NotFound errorType="serverError" />
  }

  const isLoading =
    isLoadingOwnedCertifiedAttributes ||
    isLoadingOwnedDeclaredAttributes ||
    isLoadingOwnedVerifiedAttributes

  // Non c'è il servizio, adesso prendo info da JWT. Quindi mostro solo name.

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <StyledIntro isLoading={isLoading}>{{ title: 'COMUNE' }}</StyledIntro>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          {/* <GeneralInfoSection data={data} agreement={agreement} /> */}
        </Grid>
        <Grid item xs={5}></Grid>
      </Grid>
    </Box>
  )
}
