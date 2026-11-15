const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatMoney(value: number): string {
  return money.format(value)
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString()
}