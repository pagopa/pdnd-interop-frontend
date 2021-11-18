// Utility to wait some time
export const sleep = async (ms: number) => await new Promise((resolve) => setTimeout(resolve, ms))

export const forceReflow = async () => await sleep(1)
