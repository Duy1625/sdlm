/**
 * Format a date to relative time in Vietnamese
 * Examples: "Hôm nay", "4 ngày trước", "2 tháng trước"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return 'Vừa xong'
  }

  // Less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`
  }

  // Less than 1 day
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    // Check if it's today
    if (
      past.getDate() === now.getDate() &&
      past.getMonth() === now.getMonth() &&
      past.getFullYear() === now.getFullYear()
    ) {
      return 'Hôm nay'
    }
    return `${diffInHours} giờ trước`
  }

  // Less than 1 week
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    // Check if it was yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (
      past.getDate() === yesterday.getDate() &&
      past.getMonth() === yesterday.getMonth() &&
      past.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Hôm qua'
    }
    return `${diffInDays} ngày trước`
  }

  // Less than 1 month
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`
  }

  // Less than 1 year
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`
  }

  // More than 1 year
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} năm trước`
}
