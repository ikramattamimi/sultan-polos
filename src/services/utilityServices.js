
// ===========================================
// UTILITY FUNCTIONS
// ===========================================
export const utilityService = {
  // Generate order number
  generateOrderNumber() {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    
    return `ORD${year}${month}${day}${random}`
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  },

  // Format date
  formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  // Format time
  formatTime(date) {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  // Calculate total price with print cost
  calculateItemPrice(basePrice, printTypePrice = 0, isPrinted = false) {
    return isPrinted ? basePrice + printTypePrice : basePrice
  }
}

export default utilityService