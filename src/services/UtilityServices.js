
// ===========================================
// UTILITY FUNCTIONS
// ===========================================
export const UtilityService = {
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
  },

  // Handle price input with formatting - for text inputs only
  handlePriceInputChange(event, setValue) {
    const input = event.target;

    // Check if it's a text input type that supports selection range
    if (input.type === 'text') {
      const position = input.selectionStart;
      const originalLength = input.value.length;

      // Extract only numeric values
      const numericValue = input.value.replace(/[^\d]/g, "");

      // Update state with numeric value
      setValue(numericValue);

      // Format for display
      const formatted = new Intl.NumberFormat("id-ID").format(numericValue);
      input.value = formatted;

      // Maintain cursor position
      const newLength = formatted.length;
      input.setSelectionRange(
        position + (newLength - originalLength),
        position + (newLength - originalLength)
      );
    } else {
      // For number inputs, just extract numeric value
      const numericValue = input.value.replace(/[^\d]/g, "");
      setValue(numericValue);
    }
  },

  // Format number to Indonesian format for display
  formatNumber(value) {
    if (!value || value === '') return '';
    return new Intl.NumberFormat("id-ID").format(value);
  },

  // Extract numeric value from formatted string
  extractNumericValue(value) {
    if (!value) return '';
    return value.toString().replace(/[^\d]/g, "");
  }
}

export default UtilityService