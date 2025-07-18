import React from 'react'
import type { DelegationKind } from '@/api/api.generatedTypes'
import type { SxProps } from '@mui/material'
import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type DelegationCreateCardsProps = {
  selectedDelegationKind: DelegationKind | undefined
  changeDelegationKind: (delegationKind: DelegationKind) => void
}

export const DelegationCreateCards: React.FC<DelegationCreateCardsProps> = ({
  selectedDelegationKind,
  changeDelegationKind,
}) => {
  const { t } = useTranslation('party')

  return (
    <>
      <DelegationKindButton
        selected={selectedDelegationKind === 'DELEGATED_CONSUMER'}
        onClick={() => changeDelegationKind('DELEGATED_CONSUMER')}
        label={t('delegations.create.cards.consumer')}
      />

      <DelegationKindButton
        selected={selectedDelegationKind === 'DELEGATED_PRODUCER'}
        onClick={() => changeDelegationKind('DELEGATED_PRODUCER')}
        label={t('delegations.create.cards.provider')}
      />
    </>
  )
}

const svgCardIcon = (
  <svg width="60" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.83 60.73h-8.02c-.596 0-1.082.481-1.082 1.07 0 .59.486 1.071 1.082 1.071h8.02c.596 0 1.082-.48 1.082-1.07 0-.59-.486-1.07-1.083-1.07ZM26.83 64.459h-8.02c-.596 0-1.082.48-1.082 1.07 0 .59.486 1.07 1.082 1.07h8.02c.596 0 1.082-.48 1.082-1.07 0-.59-.486-1.07-1.083-1.07Z"
      fill="#0073E6"
    />
    <path
      d="M57.82 56.584c-1.22 0-2.683-.867-4.376-1.873-1.791-1.062-3.816-2.263-6.043-2.702v-5.876c0-.594-.47-1.091-1.049-1.108a1.089 1.089 0 0 0-.787.303 1.056 1.056 0 0 0-.328.768v7.884c0 1-.823 1.814-1.834 1.814H40.52c-.862 0-1.705.35-2.312.963a3.037 3.037 0 0 0-.903 2.204c.029 1.688 1.44 3.06 3.147 3.06h4.34c.153 0 .302.022.445.065v7.696c0 .895-.736 1.623-1.642 1.623h-27.29a1.634 1.634 0 0 1-1.642-1.623v-15.17c1.368.096 3.972.082 6.083.07 1.644 0 2.981-1.323 2.981-2.949 0-.496-.126-.98-.365-1.413a2.918 2.918 0 0 0 .834-3.713 2.929 2.929 0 0 0 .597-4.21c.47-.534.727-1.212.729-1.935 0-1.626-1.337-2.95-2.982-2.95h-7.245a.629.629 0 0 1-.632-.625V32.58c0-.896.736-1.623 1.642-1.623h20.324v4.746c0 2.076 1.708 3.764 3.806 3.764h4.802v2.42c0 .594.47 1.091 1.049 1.108.295.009.575-.099.787-.302.211-.203.328-.476.328-.768v-2.823c0-.73-.3-1.446-.822-1.962l-7.598-7.513a2.843 2.843 0 0 0-1.984-.813H16.305c-2.099 0-3.807 1.69-3.807 3.765v2.185c-2.268.428-4.282 1.655-6.063 2.741-1.638 1-3.053 1.861-4.255 1.861H2v2.141h.18c2.252 0 4.311-1.276 6.303-2.51 1.386-.858 2.698-1.67 4.018-2.034.04 1.49 1.278 2.69 2.795 2.691h7.247c.445 0 .812.36.816.811v.012a.816.816 0 0 1-.814.8c-.037-.005-.08-.005-1.322-.005h-5.8c-.596 0-1.082.48-1.082 1.07 0 .59.486 1.07 1.082 1.07h2.123c2.04 0 4.834 0 4.944.004.225.01.43.108.577.275.147.166.218.38.197.603-.036.413-.407.735-.845.735h-6.957c-.6 0-1.103.465-1.12 1.037a1.08 1.08 0 0 0 1.083 1.102h6.098c.448 0 .821.331.85.754a.813.813 0 0 1-.816.863h-6.095c-.6 0-1.103.465-1.12 1.037a1.08 1.08 0 0 0 1.083 1.102h5.288c.449 0 .822.331.85.754a.814.814 0 0 1-.817.863l-.837.006c-4.375.03-6.012.042-8.206-.694-2.37-.864-9.2-2.029-9.49-2.078l-.03.175-.03.177.03.004v1.782c.755 0 6.205.986 8.745 1.94l.052.019c.516.173 1.015.314 1.522.427v15.484c0 2.076 1.708 3.764 3.806 3.764h27.29a3.809 3.809 0 0 0 3.322-1.929c1.412-.27 2.248-.615 3.214-1.014.134-.056.272-.112.415-.17.52-.212 1.047-.467 1.615-.777 1.71-.937 5.148-1.168 5.182-1.17l.16-.011.087-1.876-.198.01c-3.716.183-6.548 1.407-6.573 1.419-.023.01-2.173.92-3.416 1.277v-4.949a4.268 4.268 0 0 0 2.564.868h.008c.56 0 1.042-.417 1.1-.953a1.072 1.072 0 0 0-1.075-1.187 2.09 2.09 0 0 1-1.888-1.168c-.612-1.237-1.915-2.037-3.318-2.037h-4.299c-.539 0-.987-.397-1.022-.905a.983.983 0 0 1 .981-1.04h2.95c2.127 0 3.871-1.649 3.994-3.722 1.27.364 2.575 1.15 3.953 1.982 2.066 1.244 4.202 2.532 6.472 2.532h.18v-2.141h-.18l-.006-.002Zm-19.026-20.88v-3.235l4.912 4.858h-3.27a1.634 1.634 0 0 1-1.642-1.624ZM29.952 12.961l5.295 4.871H22.195c-.657 0-1.195.535-1.195 1.188 0 .654.538 1.189 1.195 1.189h13.052l-5.295 4.93c-.25.238-.382.57-.382.88 0 .284.107.581.322.819a1.196 1.196 0 0 0 1.686.06l7.518-6.951c.239-.226.383-.534.383-.867 0-.333-.144-.642-.383-.868l-7.518-6.962c-.478-.451-1.243-.44-1.686.048a1.165 1.165 0 0 0 .06 1.663Z"
      fill="#0073E6"
    />
    <path
      d="m30.526 25.177-5.295-4.87h13.052c.658 0 1.196-.535 1.196-1.189 0-.653-.538-1.188-1.196-1.188H25.231L30.526 13c.25-.238.383-.57.383-.88 0-.284-.108-.581-.323-.819a1.196 1.196 0 0 0-1.685-.06l-7.518 6.95a1.192 1.192 0 0 0-.383.868c0 .333.144.641.383.867l7.518 6.962c.477.452 1.243.44 1.685-.047a1.165 1.165 0 0 0-.06-1.664Z"
      fill="#0073E6"
    />
  </svg>
)

const getButtonSx = (selected: boolean): SxProps => ({
  width: '100%',
  minHeight: 97,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: 2,
  gap: 2,
  borderRadius: 1,
  border: 2,
  boxShadow: 2,
  borderColor: 'primary.main',
  backgroundColor: selected ? 'primary.dark' : 'white',
  textAlign: 'left',
  '& .MuiTypography-root': {
    color: selected ? 'white' : 'primary.main',
  },
  '& svg path': {
    fill: selected ? 'white' : 'primary.main',
  },
  '&:hover': {
    backgroundColor: 'primary.dark',
    '& .MuiTypography-root': {
      color: 'white',
      transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '& svg path': {
      fill: 'white',
      transition: 'fill 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
})

const DelegationKindButton: React.FC<{
  selected: boolean
  onClick: () => void
  label: string
}> = ({ selected, onClick, label }) => {
  const sx = getButtonSx(selected)
  const { t } = useTranslation('party')

  return (
    <Button onClick={onClick} sx={sx} variant="outlined" disableRipple>
      {svgCardIcon}
      <div>
        <Typography variant="body1">{t('delegations.create.cards.common')}</Typography>
        <Typography variant="body1" fontWeight={700}>
          {label}
        </Typography>
      </div>
    </Button>
  )
}
