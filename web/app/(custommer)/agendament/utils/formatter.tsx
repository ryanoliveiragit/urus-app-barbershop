// Format date to DD/MM/YYYY
export function formatDateMask(dateStr: string): string {
    try {
      // Check if the date is already in the correct format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        return dateStr
      }
  
      // Handle ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const [year, month, day] = dateStr.split("T")[0].split("-")
        return `${day}/${month}/${year}`
      }
  
      // Try to parse the date
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date")
      }
  
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
  
      return `${day}/${month}/${year}`
    } catch (e) {
      console.error("Error formatting date:", e)
      return dateStr
    }
  }
  
  // Format currency to BRL
  export function formatCurrency(value: string | number): string {
    try {
      const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numValue)
    } catch (e) {
      console.error("Error formatting currency:", e)
      return `R$ ${value}`
    }
  }
  
  