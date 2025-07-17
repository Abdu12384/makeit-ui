export interface Attendee {
  userId: string
  name: string
  email: string
  phone?: string
  ticketId: string
  profileImage?: string
  address?: string
  purchaseDate?: string
  ticketType: string
  ticket?: {
    checkedIn?: string
    checkedInTime?: string
    checkedInBy?: string
    totalAmount?: number
    ticketCount?: number
  }
  status?: string
}
