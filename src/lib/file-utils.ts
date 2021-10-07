export function downloadFile(responseData: any) {
  const blob = new Blob([responseData], { type: 'application/octetstream' })
  const href = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('download', 'true')
  link.setAttribute('href', href)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
