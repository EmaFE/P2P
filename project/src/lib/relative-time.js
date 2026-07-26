export function getRelativeTime(date) {
  if (!date) return ""
 
  const now = Date.now()

  let jsDate

//convert firestore timestamp to js Date or use the date directly if already a date
if (date && typeof date.toDate === "function") {
    jsDate = date.toDate()
} else if (date instanceof Date) {
    jsDate = date
} else{
    return "" 
}
  const diff = now - jsDate.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}