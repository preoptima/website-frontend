// Step, list and point numbers come from array order: 01, 02, …
export const listNumber = (index: number) => String(index + 1).padStart(2, '0')

export const aspectRatio = (aspect?: string, fallback = '4 / 3') =>
  aspect ? aspect.replace(':', ' / ') : fallback
