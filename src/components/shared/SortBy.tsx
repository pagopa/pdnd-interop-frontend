import React, { useCallback, useId, useMemo, useState } from 'react'
import { MIMenu as Menu, MIButton as Button } from '@pagopa/mui-italia'
import { SortSharp } from '@mui/icons-material'

type SortByProps = {
  options: { label: string; value: string }[]
  sortBy: string
  onSortingChange: (value: string) => void
}

export const SortBy: React.FC<SortByProps> = ({ options, sortBy, onSortingChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()
  const triggerId = `${id}-trigger`
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const selected = useMemo(
    () => options.find((option) => option.value === sortBy),
    [options, sortBy]
  )

  const onOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onSorting = useCallback(
    (optionValue: string) => {
      onSortingChange(optionValue)
      setIsOpen(false)
    },
    [onSortingChange]
  )

  return (
    <>
      <Button
        id={triggerId}
        variant="text"
        aria-controls={isOpen ? id : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={onOpen}
        startIcon={<SortSharp />}
      >
        {selected?.label ?? ''}
      </Button>
      <Menu
        id={id}
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorEl}
        items={options.map((option) => ({
          label: option.label,
          id: option.value,
          onClick: () => onSorting(option.value),
        }))}
        MenuListProps={{
          'aria-labelledby': triggerId,
        }}
      />
    </>
  )
}
