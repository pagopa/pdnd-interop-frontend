import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query-client'
import configuredI18n from '../react-i18next'
import { useDialogStore, useToastNotificationStore } from '@/stores'
import { useErrorDataStore } from '@/stores/error-data.store'
import { AxiosError, AxiosHeaders } from 'axios'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { ConfirmationDialogMeta, MutationMeta } from '@tanstack/react-query'
import type * as CommonUtils from '@/utils/common.utils'
import type * as ReactI18next from 'react-i18next'

vi.mock('react-i18next', async () => {
  const mocked = await import('../../../__mocks__/react-i18next')
  const { initReactI18next } = await vi.importActual<typeof ReactI18next>('react-i18next')

  return { ...mocked, initReactI18next }
})

const { mockedSetExponentialInterval, mockedClearExponentialInterval } = vi.hoisted(() => ({
  mockedSetExponentialInterval: vi.fn(() => 'active-queries-polling-interval-id'),
  mockedClearExponentialInterval: vi.fn(),
}))

vi.mock('@/utils/common.utils', async () => {
  const actual = await vi.importActual<typeof CommonUtils>('@/utils/common.utils')

  return {
    ...actual,
    setExponentialInterval: mockedSetExponentialInterval,
    clearExponentialInterval: mockedClearExponentialInterval,
  }
})

const TestMutation = ({
  confirmationDialog,
  mutationFn,
  meta,
}: {
  confirmationDialog?: ConfirmationDialogMeta | Array<ConfirmationDialogMeta>
  mutationFn: () => Promise<void>
  meta?: MutationMeta
}) => {
  const { mutate } = useMutation({
    mutationFn,
    meta: {
      confirmationDialog,
      ...meta,
    },
  })

  return <button onClick={() => mutate()}>submit</button>
}

describe('queryClient confirmation dialogs', () => {
  beforeEach(() => {
    queryClient.clear()
    useDialogStore.setState({ dialog: null })
    useToastNotificationStore.setState({ isShown: false })
    mockedSetExponentialInterval.mockClear()
    mockedClearExponentialInterval.mockClear()
  })

  it('should wait for ordered confirmation dialogs before running the mutation', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(
      <TestMutation
        mutationFn={mutationFn}
        confirmationDialog={[
          {
            title: 'Delegation confirmation',
            description: 'Confirm the delegated request',
          },
          {
            title: 'Async exchange confirmation',
            description: 'Confirm the async exchange integration',
            checkbox: 'I understand that a technical integration is required',
          },
        ]}
      />,
      { withReactQueryContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'submit' }))

    expect(await screen.findByRole('heading', { name: 'Delegation confirmation' })).toBeVisible()
    expect(mutationFn).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'confirm' }))

    expect(
      await screen.findByRole('heading', { name: 'Async exchange confirmation' })
    ).toBeVisible()
    const confirmButton = screen.getByRole('button', { name: 'confirm' })
    expect(confirmButton).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', {
        name: 'I understand that a technical integration is required',
      })
    )
    expect(confirmButton).toBeEnabled()

    await user.click(confirmButton)

    await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1))
  })

  it('should not request active queries polling when the mutation opts out', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(
      <TestMutation mutationFn={mutationFn} meta={{ skipActiveQueriesPolling: true }} />,
      { withReactQueryContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1))
    expect(mockedSetExponentialInterval).not.toHaveBeenCalled()
  })

  it('should request active queries polling when the mutation does not opt out', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(<TestMutation mutationFn={mutationFn} />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1))
    expect(mockedSetExponentialInterval).toHaveBeenCalledWith(expect.any(Function), 20 * 1000)
  })

  it('should not run the mutation when a confirmation dialog is cancelled', async () => {
    const user = userEvent.setup()
    const mutationFn = vi.fn().mockResolvedValue(undefined)

    renderWithApplicationContext(
      <TestMutation
        mutationFn={mutationFn}
        confirmationDialog={[
          {
            title: 'Delegation confirmation',
          },
          {
            title: 'Async exchange confirmation',
            checkbox: 'I understand that a technical integration is required',
          },
        ]}
      />,
      { withReactQueryContext: true }
    )

    await user.click(screen.getByRole('button', { name: 'submit' }))
    await user.click(await screen.findByRole('button', { name: 'confirm' }))

    expect(
      await screen.findByRole('heading', { name: 'Async exchange confirmation' })
    ).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'cancel' }))

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'Async exchange confirmation' })
      ).not.toBeInTheDocument()
    })
    expect(mutationFn).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(queryClient.getMutationCache().getAll()[0].state.status).toBe('error')
    })
    expect(useToastNotificationStore.getState().isShown).toBe(false)
  })
})

describe('queryClient error toasts', () => {
  let previousLanguage: string
  const fallbackLabel = 'Frontend fallback'
  const backendDetail = '  Original backend detail\n'
  const validData = {
    userMessages: { it: 'Italian translation', en: 'English translation' },
    errors: [{ detail: backendDetail, code: 'BACKEND_ERROR' }],
    correlationId: 'correlation-id',
    detail: 'Top-level detail',
    title: 'Top-level title',
    message: 'Top-level message',
  }

  type TestMeta = Omit<MutationMeta, 'errorToastLabel'> &
    Record<string, unknown> & {
      errorToastLabel?:
        | string
        | ((error: unknown, variables: unknown, context: unknown) => string | undefined)
    }

  const axiosError = (data: unknown) =>
    new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
      data,
      status: 400,
      statusText: 'Bad Request',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    })

  const onError = (
    error: Error,
    meta: TestMeta | undefined = { errorToastLabel: fallbackLabel },
    variables?: unknown,
    context?: unknown
  ) => {
    const mutationCache = queryClient.getMutationCache()
    const mutation = mutationCache.build(queryClient, { meta })
    if (!mutationCache.config.onError) throw new Error('Missing mutation cache onError callback')
    return mutationCache.config.onError(error, variables, context, mutation)
  }

  beforeEach(async () => {
    previousLanguage = configuredI18n.language
    await configuredI18n.changeLanguage('it')
    queryClient.clear()
    useToastNotificationStore.setState({
      isShown: false,
      message: '',
      severity: 'success',
      correlationId: undefined,
    })
    useErrorDataStore.getState().clearErrorData()
  })

  afterEach(async () => {
    await configuredI18n.changeLanguage(previousLanguage)
    useToastNotificationStore.setState({
      isShown: false,
      message: '',
      severity: 'success',
      correlationId: undefined,
    })
    useErrorDataStore.getState().clearErrorData()
    queryClient.clear()
  })

  it.each(
    [
      { language: 'it', genericLabel: 'Errore inaspettato' },
      { language: 'en', genericLabel: 'Unexpected error' },
    ].flatMap((locale) =>
      [
        { name: 'ordinary error', error: new Error('Request failed') },
        { name: 'Axios error without response', error: new AxiosError('Network error') },
      ].map((testCase) => ({ ...locale, ...testCase }))
    )
  )('shows the $language generic toast for $name without meta', async (testCase) => {
    const { language, genericLabel, error } = testCase
    const mutationCache = queryClient.getMutationCache()
    const mutation = mutationCache.build(queryClient, {})
    if (!mutationCache.config.onError) throw new Error('Missing mutation cache onError callback')

    await configuredI18n.changeLanguage(language)
    mutationCache.config.onError(error, undefined, undefined, mutation)

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: genericLabel,
      severity: 'error',
      correlationId: undefined,
    })
    expect(useErrorDataStore.getState()).toMatchObject({ correlationId: null, errorCode: null })
  })

  it.each([true, false])(
    'resolves the generic toast after each language switch (diagnostics: %s)',
    async (withDiagnostics) => {
      const error = axiosError({
        userMessages: {},
        correlationId: withDiagnostics ? validData.correlationId : undefined,
        errors: withDiagnostics ? [{ code: validData.errors[0].code }] : [],
      })

      for (const { language, genericLabel } of [
        { language: 'en', genericLabel: 'Unexpected error' },
        { language: 'it', genericLabel: 'Errore inaspettato' },
      ]) {
        await configuredI18n.changeLanguage(language)
        onError(error, { errorToastLabel: '' })

        expect(useToastNotificationStore.getState()).toMatchObject({
          isShown: true,
          message: genericLabel,
          severity: 'error',
          correlationId: withDiagnostics ? validData.correlationId : undefined,
        })
        expect(useErrorDataStore.getState()).toMatchObject({
          correlationId: withDiagnostics ? validData.correlationId : null,
          errorCode: withDiagnostics ? validData.errors[0].code : null,
        })
      }
    }
  )

  it.each([
    { name: 'static label', errorToastLabel: fallbackLabel },
    { name: 'callback label', errorToastLabel: () => fallbackLabel },
  ])('prefers the frontend $name over the localized generic toast', async ({ errorToastLabel }) => {
    await configuredI18n.changeLanguage('en')

    onError(axiosError({ ...validData, userMessages: undefined }), { errorToastLabel })

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: fallbackLabel,
      severity: 'error',
      correlationId: validData.correlationId,
    })
    expect(useErrorDataStore.getState()).toMatchObject({
      correlationId: validData.correlationId,
      errorCode: validData.errors[0].code,
    })
  })

  it.each([
    { name: 'own Italian message', userMessages: { it: 'Italian translation' } },
    { name: 'own English message', userMessages: { en: 'English translation' } },
    { name: 'empty userMessages object', userMessages: {} },
    { name: 'empty language fields', userMessages: { it: '', en: '' } },
    { name: 'whitespace language fields', userMessages: { it: ' \n', en: '\t ' } },
    { name: 'null language fields', userMessages: { it: null, en: null } },
    { name: 'unrelated language fields', userMessages: { fr: 'Translation' } },
    {
      name: 'blank Italian message and valid English message',
      userMessages: { it: ' \n\t', en: 'English translation' },
    },
  ])(
    'uses the original first detail with $name, ignoring translations and top-level text',
    ({ userMessages }) => {
      onError(axiosError({ ...validData, userMessages }))

      expect(useToastNotificationStore.getState()).toMatchObject({
        isShown: true,
        message: backendDetail,
        severity: 'error',
        correlationId: validData.correlationId,
      })
    }
  )

  it.each([
    { name: 'absent userMessages', userMessages: undefined },
    { name: 'null userMessages', userMessages: null },
  ])('falls back for $name', ({ userMessages }) => {
    const data: Record<string, unknown> = { ...validData, userMessages }
    if (userMessages === undefined) delete data.userMessages

    onError(axiosError(data))

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: fallbackLabel,
      severity: 'error',
    })
  })

  it.each([
    { name: 'missing errors', errors: undefined },
    { name: 'null errors', errors: null },
    { name: 'nonarray errors', errors: { detail: backendDetail } },
    { name: 'empty errors', errors: [] },
    { name: 'null first error', errors: [null] },
    { name: 'string first error', errors: [backendDetail] },
    { name: 'number first error', errors: [42] },
    { name: 'boolean first error', errors: [true] },
    { name: 'array first error', errors: [[{ detail: backendDetail }]] },
    { name: 'missing first detail', errors: [{}] },
    { name: 'null first detail', errors: [{ detail: null }] },
    { name: 'valid second detail only', errors: [{}, { detail: backendDetail }] },
  ])('falls back for $name', ({ errors }) => {
    const data: Record<string, unknown> = { ...validData, errors }
    if (errors === undefined) delete data.errors

    onError(axiosError(data))

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: fallbackLabel,
      severity: 'error',
    })
  })

  it.each([
    { name: 'undefined data', data: undefined },
    { name: 'null data', data: null },
    { name: 'empty string data', data: '' },
    { name: 'string data', data: 'error' },
    { name: 'number data', data: 42 },
    { name: 'array data', data: [] },
    { name: 'empty object data', data: {} },
  ])('falls back for $name', ({ data }) => {
    onError(axiosError(data))

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: fallbackLabel,
      severity: 'error',
    })
  })

  it.each([
    {
      name: 'non-Axios error with a valid-looking response',
      error: Object.assign(new Error('Request failed'), { response: { data: validData } }),
    },
    { name: 'ordinary error', error: new Error('Request failed') },
    { name: 'Axios error without response', error: new AxiosError('Network error') },
    {
      name: 'Axios error with null response',
      error: Object.assign(new AxiosError(), { response: null }),
    },
  ])('falls back for $name', ({ error }) => {
    onError(error)

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: fallbackLabel,
      severity: 'error',
    })
  })

  it.each([true, false])(
    'preserves callback arguments and diagnostics (backend label: %s)',
    (valid) => {
      const error = axiosError({
        ...validData,
        userMessages: valid ? validData.userMessages : undefined,
      })
      const variables = { resourceId: 'resource-id' }
      const context = { previousValue: 'previous-value' }
      const errorToastLabel = vi.fn<
        (error: unknown, variables: unknown, context: unknown) => string
      >(() => fallbackLabel)

      onError(error, { errorToastLabel }, variables, context)

      expect(errorToastLabel).toHaveBeenCalledExactlyOnceWith(error, variables, context)
      const [receivedError, receivedVariables, receivedContext] = errorToastLabel.mock.calls[0]
      expect(receivedError).toBe(error)
      expect(receivedVariables).toBe(variables)
      expect(receivedContext).toBe(context)
      expect(useToastNotificationStore.getState()).toMatchObject({
        isShown: true,
        message: valid ? backendDetail : fallbackLabel,
        severity: 'error',
        correlationId: validData.correlationId,
      })
      expect(useErrorDataStore.getState()).toMatchObject({
        correlationId: validData.correlationId,
        errorCode: validData.errors[0].code,
      })
    }
  )

  it.each(
    [
      { name: 'no meta', meta: undefined },
      { name: 'no error label', meta: {} },
      { name: 'undefined static label', meta: { errorToastLabel: undefined } },
      { name: 'empty static label', meta: { errorToastLabel: '' } },
      { name: 'callback returning undefined', meta: { errorToastLabel: () => undefined } },
      { name: 'callback returning empty label', meta: { errorToastLabel: () => '' } },
    ].flatMap((testCase) => [true, false].map((valid) => ({ ...testCase, valid })))
  )('handles $name without a fallback (valid backend: $valid)', ({ meta, valid }) => {
    const mutationCache = queryClient.getMutationCache()
    const mutation = mutationCache.build(queryClient, { meta })
    if (!mutationCache.config.onError) throw new Error('Missing mutation cache onError callback')

    mutationCache.config.onError(
      axiosError({ ...validData, userMessages: valid ? validData.userMessages : undefined }),
      undefined,
      undefined,
      mutation
    )

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: valid ? backendDetail : 'Errore inaspettato',
      severity: 'error',
      correlationId: validData.correlationId,
    })
    expect(useErrorDataStore.getState()).toMatchObject({
      correlationId: validData.correlationId,
      errorCode: validData.errors[0].code,
    })
  })

  it.each([
    { name: 'missing correlation ID', correlationId: undefined, code: 'BACKEND_ERROR' },
    { name: 'missing error code', correlationId: 'correlation-id', code: undefined },
    { name: 'missing both diagnostics', correlationId: undefined, code: undefined },
  ])('still shows the backend toast with $name', ({ correlationId, code }) => {
    onError(axiosError({ ...validData, correlationId, errors: [{ detail: backendDetail, code }] }))

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: backendDetail,
      severity: 'error',
      correlationId,
    })
    expect(useErrorDataStore.getState()).toMatchObject({ correlationId: null, errorCode: null })
  })
})
