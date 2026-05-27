import type {
  AttributeCertifiedDiscreteComparator,
  DescriptorAttribute,
} from '@/api/api.generatedTypes'
import React from 'react'
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form'
import { create } from 'zustand'
import { Drawer } from '../Drawer'
import { Stack } from '@mui/material'
import { RHFAutocompleteSingle, RHFTextField } from '../react-hook-form-inputs'
import isEmpty from 'lodash/isEmpty'
import { match } from 'ts-pattern'

type ConfigureDiscreteAttributeDrawerProps = {
  onSubmit: (comparator: AttributeCertifiedDiscreteComparator, threshold: number) => void
  submitButtonLabel: string
}

type ConfigureDiscreteAttributeDrawerStore = {
  isOpen: boolean
  open: (attribute: DescriptorAttribute) => void
  close: VoidFunction
  attribute?: DescriptorAttribute
}

// TODO check if is more simple to add this in autocomplete directly and in attributeContainer directly
// because AttributeGroup is used only in creation eservice and not in updateAttributesDrawer

export const useConfigureDiscreteAttributeDrawer = create<ConfigureDiscreteAttributeDrawerStore>(
  (set) => ({
    isOpen: false,
    open: (attribute) => set({ attribute, isOpen: true }),
    close: () => set({ isOpen: false, attribute: undefined }),
  })
)

type ConfigureDiscreteAttributeFormValues = {
  comparator: AttributeCertifiedDiscreteComparator
  threshold: number
}

export const ConfigureDiscreteAttributeDrawer: React.FC<ConfigureDiscreteAttributeDrawerProps> = ({
  onSubmit,
  submitButtonLabel,
}) => {
  const { isOpen, close, attribute } = useConfigureDiscreteAttributeDrawer()
  const formMethods = useForm<ConfigureDiscreteAttributeFormValues>({
    defaultValues: {
      comparator: attribute?.discreteConfig?.comparator ?? 'GT', // TODO operator
      threshold: attribute?.discreteConfig?.threshold ?? undefined, // TODO value
    },
  })

  const handleFormSubmit: SubmitHandler<ConfigureDiscreteAttributeFormValues> = ({
    comparator,
    threshold,
  }) => {
    onSubmit(comparator, threshold)
  }

  React.useEffect(() => {
    if (isOpen) {
      formMethods.reset({
        comparator: 'GT', // operator
        threshold: 1, // TODO value
      })
    }
  }, [isOpen, formMethods, attribute])

  const ALL_COMPARATORS: AttributeCertifiedDiscreteComparator[] = [
    'GT',
    'GTE',
    'EQ',
    'NE',
    'LTE',
    'LT',
  ]

  const getComparatorOptions = () => {
    return ALL_COMPARATORS.map((comparator) => {
      const label = match(comparator)
        .with('GT', () => 'TODO Maggiore di')
        .with('LT', () => 'TODO Minore di')
        .with('GTE', () => 'TODO Maggiore o uguale a')
        .with('LTE', () => 'TODO')
        .with('EQ', () => 'TODO')
        .with('NE', () => 'TODO')
        .exhaustive()

      return { label, value: comparator }
    })
  }

  const comparatorOptions = getComparatorOptions()

  return (
    <FormProvider {...formMethods}>
      <Drawer
        isOpen={isOpen}
        title="TODO titolo"
        subtitle="TODO subtitle"
        onTransitionExited={formMethods.reset}
        onClose={close}
        buttonAction={{
          label: submitButtonLabel,
          action: formMethods.handleSubmit(handleFormSubmit),
          form: 'discrete-attribute-form',
          type: 'submit',
          color: isEmpty(formMethods.formState.errors) ? 'primary' : 'error',
          fontColor: 'white',
        }}
      >
        <Stack component={'form'} noValidate id="discrete-attribute-form">
          <RHFAutocompleteSingle
            name="comparator"
            label="TODO Criterio"
            placeholder="TODO"
            options={comparatorOptions}
            focusOnMount
            size="small"
            rules={{ required: true }}
          />
          <RHFTextField
            name="threshold"
            label={'TODO Valore numerico'}
            type="number"
            rules={{
              required: true,
              min: 1,
              max: 1000000000,
              validate: (value) =>
                Number.isInteger(Number(value)) || 'TODO error not integer message',
            }}
            required
            sx={{ mt: 2 }}
          />
        </Stack>
      </Drawer>
    </FormProvider>
  )
}
