export const getBadgeClass = (state: number | string): string => {
  const numState = typeof state === 'string' ? parseInt(state) : state
  
  switch (numState) {
    case 0:
      return 'badge badge--waiting'
    case 1:
      return 'badge badge--paid'
    case 2:
      return 'badge badge--missed'
    default:
      return 'badge badge--default'
  }
}

export const getBadgeText = (state: number | string): string => {
  const numState = typeof state === 'string' ? parseInt(state) : state
  
  switch (numState) {
    case 0:
      return 'ЧАКА ПЛАЩАНЕ'
    case 1:
      return 'ПЛАТЕНА'
    case 2:
      return 'ПРОПУСНАТО ПЛАЩАНЕ'
    default:
      return 'Unknown Status'
  }
}
