import userEvent from '@testing-library/user-event'
import { NewPageContainer, type PageContainerProps } from '../NewPageContainer'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { ActionItemButton } from '@/types/common.types'

const renderComponent = ({
  children,
  title,
  backToAction,
  statusChip,
  primaryAction,
  secondaryAction,
  menuActions,
  description,
  infoSection,
}: PageContainerProps) => {
  return renderWithApplicationContext(
    <NewPageContainer
      title={title}
      backToAction={backToAction}
      statusChip={statusChip}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      menuActions={menuActions}
      description={description}
      infoSection={infoSection}
    >
      {children}
    </NewPageContainer>,
    { withRouterContext: true }
  )
}

describe('NewPageContainer', () => {
  it('should correctly render title and children', () => {
    const screen = renderComponent({ children: 'Test children', title: 'Test title' })
    const title = screen.getByText('Test title')
    const children = screen.getByText('Test children')

    expect(title).toBeInTheDocument()
    expect(children).toBeInTheDocument()
  })

  it('should correctly render the statusChip when passed PUBLISHED for e-service', () => {
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      statusChip: { for: 'eservice', state: 'PUBLISHED' },
    })

    const statusChip = screen.getByText('status.eservice.PUBLISHED')

    expect(statusChip).toBeInTheDocument()
  })

  it('should correctly render the statusChip when passed SUSPENDED for e-service', () => {
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      statusChip: { for: 'eservice', state: 'SUSPENDED' },
    })

    const statusChip = screen.getByText('status.eservice.SUSPENDED')

    expect(statusChip).toBeInTheDocument()
  })

  it('should correctly render the backToAction link that navigate to the DEFAULT route passed', async () => {
    const { history, ...screen } = renderComponent({
      children: 'Test children',
      title: 'Test title',
      backToAction: {
        label: 'test backToAction',
        to: 'DEFAULT',
      },
    })

    const user = userEvent.setup()

    const backToActionButton = screen.getByRole('link', { name: 'test backToAction' })

    expect(backToActionButton).toBeInTheDocument()

    await user.click(backToActionButton)

    expect(history.location.pathname).toEqual('/it/')
  })

  it('should correctly render the description', () => {
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      description: 'Test description',
    })

    const description = screen.getByText('Test description')

    expect(description).toBeInTheDocument()
  })

  it('should correctly render primary and secondary action when passed', () => {
    const primaryAction = vi.fn()
    const primaryActionMock: ActionItemButton = {
      action: primaryAction,
      label: 'test primary action',
      variant: 'contained',
    }
    const secondaryAction = vi.fn()
    const secondaryActionMock: ActionItemButton = {
      action: secondaryAction,
      label: 'test secondary action',
      variant: 'outlined',
    }

    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      primaryAction: primaryActionMock,
      secondaryAction: secondaryActionMock,
    })

    const primaryActionButton = screen.getByRole('button', { name: 'test primary action' })
    const secondaryActionButton = screen.getByRole('button', { name: 'test secondary action' })

    expect(primaryActionButton).toBeInTheDocument()
    expect(secondaryActionButton).toBeInTheDocument()
  })

  it('should correctly render the menuAction that contains the actions passed', async () => {
    const menuAction1Mock: ActionItemButton = {
      action: vi.fn(),
      label: 'test menu action 1',
    }
    const menuAction2Mock: ActionItemButton = {
      action: vi.fn(),
      label: 'test menu action 2',
    }
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      menuActions: [menuAction1Mock, menuAction2Mock],
    })

    const user = userEvent.setup()

    const actionMenuIcon = screen.getByTestId('MoreVertIcon')

    expect(actionMenuIcon).toBeInTheDocument()

    await user.click(actionMenuIcon)

    const menuAction1 = screen.getByRole('menuitem', { name: 'test menu action 1' })
    const menuAction2 = screen.getByRole('menuitem', { name: 'test menu action 2' })

    expect(menuAction1).toBeInTheDocument()
    expect(menuAction2).toBeInTheDocument()
  })

  it('should correctly render the infoSection with the label and the shortcut passed. That shortcut should be a link and navigate to the DEFAULT route passed', async () => {
    const { history, ...screen } = renderComponent({
      children: 'Test children',
      title: 'Test title',
      infoSection: {
        label: 'Test label',
        shortcut: { type: 'link', label: 'Test link', to: 'DEFAULT' },
      },
    })

    const user = userEvent.setup()

    const infoSectionLabel = screen.getByText('Test label')
    const infoSectionShortcut = screen.getByRole('link', { name: 'Test link' })

    expect(infoSectionLabel).toBeInTheDocument()
    expect(infoSectionShortcut).toBeInTheDocument()

    await user.click(infoSectionShortcut)

    expect(history.location.pathname).toEqual('/it/')
  })

  it('should correctly render the infoSection with the label and the shortcut passed. That shortcut should be a button', () => {
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      infoSection: {
        label: 'Test label',
        shortcut: { type: 'button', label: 'Test button', onClick: vi.fn() },
      },
    })

    const infoSectionShortcut = screen.getByRole('button', { name: 'Test button' })

    expect(infoSectionShortcut).toBeInTheDocument()
  })

  it('should correctly render the infoSection with the statusChip with state PUBLISHED for e-service passed', () => {
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      infoSection: {
        label: 'Test label',
        shortcut: { type: 'link', label: 'Test link', to: 'DEFAULT' },
        statusChip: { for: 'eservice', state: 'PUBLISHED' },
      },
    })

    const statusChip = screen.getByText('status.eservice.PUBLISHED')

    expect(statusChip).toBeInTheDocument()
  })

  it('should correctly render the infoSection with the label and the shortcut passed. That shortcut should be a button', () => {
    const primaryAction = vi.fn()
    const action1Mock: ActionItemButton = {
      action: primaryAction,
      label: 'Test action 1',
    }
    const secondaryAction = vi.fn()
    const action2Mock: ActionItemButton = {
      action: secondaryAction,
      label: 'Test action 2',
    }
    const screen = renderComponent({
      children: 'Test children',
      title: 'Test title',
      infoSection: {
        label: 'Test label',
        shortcut: { type: 'link', label: 'Test link', to: 'DEFAULT' },
        actions: [action1Mock, action2Mock],
      },
    })

    const infoSectionAction1 = screen.getByRole('button', { name: 'Test action 1' })
    const infoSectionAction2 = screen.getByRole('button', { name: 'Test action 2' })

    expect(infoSectionAction1).toBeInTheDocument()
    expect(infoSectionAction2).toBeInTheDocument()
  })
})
