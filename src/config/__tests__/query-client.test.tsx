import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useMutation } from '@tanstack/react-query'
import { CancellationError, queryClient, queryClientConfig } from '../query-client'
import configuredI18n from '../react-i18next'
import { useDialogStore, useLoadingOverlayStore, useToastNotificationStore } from '@/stores'
import { useErrorDataStore } from '@/stores/error-data.store'
import { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosResponse } from 'axios'
import { NotFoundError } from '@/utils/errors.utils'
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

describe('queryClient mutation cache lifecycle', () => {
  const cache = queryClient.getMutationCache()

  beforeEach(() => {
    queryClient.clear()
    mockedSetExponentialInterval.mockClear()
    mockedClearExponentialInterval.mockClear()
  })

  afterEach(() => vi.restoreAllMocks())

  function mutation(meta?: MutationMeta) {
    return cache.build<unknown, unknown, unknown, unknown>(queryClient, {
      mutationFn: async (variables) => variables,
      meta: meta ? { ...meta } : undefined,
    })
  }

  it('caps retry delay and retries only eventual-consistency NotFound errors four times', () => {
    const retry = queryClientConfig.defaultOptions!.mutations!.retry
    const delay = queryClientConfig.defaultOptions!.mutations!.retryDelay
    const queryDelay = queryClientConfig.defaultOptions!.queries!.retryDelay
    if (
      typeof retry !== 'function' ||
      typeof delay !== 'function' ||
      typeof queryDelay !== 'function'
    ) {
      throw new Error('Expected callable retry policies')
    }
    const error = new NotFoundError()
    expect(retry(0, error)).toBe(true)
    expect(retry(3, error)).toBe(true)
    expect(retry(4, error)).toBe(false)
    expect(retry(0, new Error('other failure'))).toBe(false)
    expect(delay(0, error)).toBe(1000)
    expect(delay(5, error)).toBe(30000)
    expect(queryDelay(2, error)).toBe(4000)
  })

  it('resolves functional labels with callback arguments and pairs overlay show/hide', async () => {
    const show = vi
      .spyOn(useLoadingOverlayStore.getState(), 'showOverlay')
      .mockImplementation(() => undefined)
    const hide = vi
      .spyOn(useLoadingOverlayStore.getState(), 'hideOverlay')
      .mockImplementation(() => undefined)
    const toast = vi
      .spyOn(useToastNotificationStore.getState(), 'showToast')
      .mockImplementation(() => undefined)
    const loadingLabel = vi.fn(() => 'saving')
    const successToastLabel = vi.fn(() => 'saved')
    const errorToastLabel = vi.fn(() => 'failed')
    const current = mutation({
      loadingLabel,
      successToastLabel,
      errorToastLabel,
      skipActiveQueriesPolling: true,
    })
    const variables = { id: 'item' }
    const data = { id: 'created' }
    const context = { previous: 'old' }
    await cache.config.onMutate!(variables, current)
    expect(show).toHaveBeenCalledWith('saving')
    cache.config.onSuccess!(data, variables, context, current)
    expect(successToastLabel).toHaveBeenLastCalledWith(data, variables, context)
    expect(toast).toHaveBeenCalledWith('saved', 'success')
    const error = new Error('failure')
    cache.config.onError!(error, variables, context, current)
    expect(errorToastLabel).toHaveBeenLastCalledWith(error, variables, context)
    expect(toast).toHaveBeenCalledWith('failed', 'error', undefined)
    cache.config.onSettled!(data, error, variables, context, current)
    expect(loadingLabel).toHaveBeenCalledWith(variables)
    expect(hide).toHaveBeenCalledTimes(1)
    expect(mockedSetExponentialInterval).not.toHaveBeenCalled()
  })

  it.each([
    {
      data: { correlationId: 'correlation', errors: [{ code: 'ERR' }] },
      storesError: true,
      correlation: 'correlation',
    },
    {
      data: { correlationId: 'correlation', errors: [] },
      storesError: false,
      correlation: 'correlation',
    },
    { data: { errors: [{ code: 'ERR' }] }, storesError: false, correlation: undefined },
    { data: {}, storesError: false, correlation: undefined },
    { data: undefined, storesError: false, correlation: undefined },
  ])('handles Axios error metadata: $data', ({ data, storesError, correlation }) => {
    const toast = vi
      .spyOn(useToastNotificationStore.getState(), 'showToast')
      .mockImplementation(() => undefined)
    const setError = vi
      .spyOn(useErrorDataStore.getState(), 'setErrorData')
      .mockImplementation(() => undefined)
    const response = data === undefined ? undefined : ({ data } as AxiosResponse)
    const error = new AxiosError('request failed', undefined, undefined, undefined, response)
    cache.config.onError!(error, {}, undefined, mutation({ errorToastLabel: 'failed' }))
    expect(toast).toHaveBeenCalledWith('failed', 'error', correlation)
    if (storesError) expect(setError).toHaveBeenCalledWith('correlation', 'ERR')
    else expect(setError).not.toHaveBeenCalled()
  })

  it('does not show error feedback for cancellation or absent metadata', async () => {
    const toast = vi
      .spyOn(useToastNotificationStore.getState(), 'showToast')
      .mockImplementation(() => undefined)
    const hide = vi
      .spyOn(useLoadingOverlayStore.getState(), 'hideOverlay')
      .mockImplementation(() => undefined)
    cache.config.onError!(
      new CancellationError(),
      {},
      undefined,
      mutation({ errorToastLabel: 'failed' })
    )
    const current = mutation()
    await cache.config.onMutate!({}, current)
    cache.config.onError!(new Error('silent'), {}, undefined, current)
    cache.config.onSettled!(undefined, null, {}, undefined, current)
    expect(toast).not.toHaveBeenCalled()
    expect(hide).not.toHaveBeenCalled()
  })

  it('resolves a single functional confirmation before loading and polls only stale active queries', async () => {
    const open = vi
      .spyOn(useDialogStore.getState(), 'openDialog')
      .mockImplementation(() => undefined)
    const show = vi
      .spyOn(useLoadingOverlayStore.getState(), 'showOverlay')
      .mockImplementation(() => undefined)
    const refetch = vi.spyOn(queryClient, 'refetchQueries').mockResolvedValue(undefined)
    const current = mutation({
      confirmationDialog: {
        title: (variables) => `Confirm ${(variables as { id: string }).id}`,
        description: (variables) => `Save ${(variables as { id: string }).id}`,
        proceedLabel: 'Save',
        checkbox: 'Accepted',
      },
      loadingLabel: 'saving',
    })
    const pending = cache.config.onMutate!({ id: 'item' }, current)
    expect(open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Confirm item',
        description: 'Save item',
        proceedLabel: 'Save',
        checkbox: 'Accepted',
      })
    )
    expect(show).not.toHaveBeenCalled()
    const dialog = open.mock.calls[0][0]
    if (dialog.type !== 'basic') throw new Error('Expected basic confirmation')
    dialog.onProceed?.()
    await pending
    expect(show).toHaveBeenCalledWith('saving')
    cache.config.onSuccess!({}, {}, undefined, current)
    const poll = mockedSetExponentialInterval.mock.calls[0] as unknown as [VoidFunction, number]
    poll[0]()
    expect(refetch).toHaveBeenCalledWith({ type: 'active', stale: true })
    expect(mockedClearExponentialInterval).toHaveBeenCalledTimes(1)
  })
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
  const backendUserMessage = '  Backend user message\n'
  const backendDetail = '  Original backend detail\n'
  const validData = {
    userMessage: backendUserMessage,
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
    const mutation = mutationCache.build(queryClient, {
      meta: meta as (MutationMeta & Record<string, unknown>) | undefined,
    })
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

    onError(axiosError({ ...validData, userMessage: undefined }), { errorToastLabel })

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
    { name: 'a valid errors array', errors: validData.errors },
    { name: 'missing errors', errors: undefined },
    { name: 'null errors', errors: null },
    { name: 'nonarray errors', errors: { detail: backendDetail } },
    { name: 'empty errors', errors: [] },
    { name: 'missing first detail', errors: [{}] },
    { name: 'null first detail', errors: [{ detail: null }] },
  ])(
    'uses the backend userMessage verbatim with $name, ignoring errors detail and top-level text',
    ({ errors }) => {
      const data: Record<string, unknown> = { ...validData, errors }
      if (errors === undefined) delete data.errors
      const errorToastLabel = vi.fn(() => fallbackLabel)

      onError(axiosError(data), { errorToastLabel })

      expect(errorToastLabel).toHaveBeenCalledOnce()
      expect(useToastNotificationStore.getState()).toMatchObject({
        isShown: true,
        message: backendUserMessage,
        severity: 'error',
        correlationId: validData.correlationId,
      })
    }
  )

  it.each([
    { name: 'absent userMessage', userMessage: undefined },
    { name: 'null userMessage', userMessage: null },
  ])('falls back for $name', ({ userMessage }) => {
    const data: Record<string, unknown> = { ...validData, userMessage }
    if (userMessage === undefined) delete data.userMessage

    onError(axiosError(data))

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: fallbackLabel,
      severity: 'error',
    })
  })

  it('ignores the legacy userMessages discriminator and errors detail', () => {
    const data: Record<string, unknown> = {
      ...validData,
      userMessages: { it: 'Italian translation', en: 'English translation' },
    }
    delete data.userMessage

    onError(axiosError(data))

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

  it('prefers userMessage when the legacy userMessages field is also present', () => {
    onError(
      axiosError({
        ...validData,
        userMessages: { it: 'Italian translation', en: 'English translation' },
      })
    )

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: backendUserMessage,
      severity: 'error',
    })
  })

  it.each([
    { language: 'it', genericLabel: 'Errore inaspettato' },
    { language: 'en', genericLabel: 'Unexpected error' },
  ])(
    'keeps the $language generic toast for an empty-string userMessage, even with a frontend label',
    async ({ language, genericLabel }) => {
      await configuredI18n.changeLanguage(language)

      onError(axiosError({ ...validData, userMessage: '' }))

      expect(useToastNotificationStore.getState()).toMatchObject({
        isShown: true,
        message: genericLabel,
        severity: 'error',
        correlationId: validData.correlationId,
      })
    }
  )

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
  ])('falls back without userMessage for $name', ({ errors }) => {
    const data: Record<string, unknown> = { ...validData, userMessage: undefined, errors }
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
        userMessage: valid ? validData.userMessage : undefined,
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
        message: valid ? backendUserMessage : fallbackLabel,
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
    const mutation = mutationCache.build(queryClient, {
      meta: meta as (MutationMeta & Record<string, unknown>) | undefined,
    })
    if (!mutationCache.config.onError) throw new Error('Missing mutation cache onError callback')

    mutationCache.config.onError(
      axiosError({ ...validData, userMessage: valid ? validData.userMessage : undefined }),
      undefined,
      undefined,
      mutation
    )

    expect(useToastNotificationStore.getState()).toMatchObject({
      isShown: true,
      message: valid ? backendUserMessage : 'Errore inaspettato',
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
      message: backendUserMessage,
      severity: 'error',
      correlationId,
    })
    expect(useErrorDataStore.getState()).toMatchObject({ correlationId: null, errorCode: null })
  })
})
