import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReadOnlyDescriptorAttributes } from '../ReadOnlyDescriptorAttributes'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import { mockUseCurrentRoute } from '@/utils/testing.utils'

mockUseCurrentRoute({ mode: 'consumer' })

const emptyAttributes: DescriptorAttributes = {
  certified: [],
  verified: [],
  declared: [],
}

describe('ReadOnlyDescriptorAttributes', () => {
  it('should show a single generic banner when there are no attributes', () => {
    render(<ReadOnlyDescriptorAttributes descriptorAttributes={emptyAttributes} />)

    expect(screen.getByText('attributesGenericLabel')).toBeInTheDocument()
    expect(screen.getByText('noAttributesRequiredGenericAlert')).toBeInTheDocument()
  })

  it('should not show the three attribute sections when there are no attributes', () => {
    render(<ReadOnlyDescriptorAttributes descriptorAttributes={emptyAttributes} />)

    expect(screen.queryByText('certified.label')).not.toBeInTheDocument()
    expect(screen.queryByText('verified.label')).not.toBeInTheDocument()
    expect(screen.queryByText('declared.label')).not.toBeInTheDocument()
  })
})
