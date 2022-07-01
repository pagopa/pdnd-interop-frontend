import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledLink } from '../components/Shared/StyledLink'

type NotFoundProps = {
  errorType?: 'notFound' | 'serverError'
}

export function NotFound({ errorType = 'notFound' }: NotFoundProps) {
  const { t } = useTranslation('common', { keyPrefix: 'notFound' })

  return (
    <StyledIntro>
      {{
        title: t('title'),
        description: (
          <>
            {t(`description.${errorType}`)}.{' '}
            <StyledLink to="/">{t('description.goHomeLink.label')}</StyledLink>.
          </>
        ),
      }}
    </StyledIntro>
  )
}
