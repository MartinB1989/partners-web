/**
 * Composable para formatear valores monetarios a pesos argentinos
 */
export const useCurrency = () => {
  /**
   * Formatea un número a formato de pesos argentinos
   * @param amount - El valor numérico a formatear
   * @param options - Opciones adicionales para el formato
   * @returns El valor formateado como string
   */
  const formatToCurrency = (
    amount: number,
    options: {
      includeSymbol?: boolean;
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
    } = {}
  ): string => {
    const {
      includeSymbol = true,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2
    } = options;

    // Formatear el número usando el locale de Argentina
    const formattedAmount = amount.toLocaleString('es-AR', {
      minimumFractionDigits,
      maximumFractionDigits
    });

    // Devolver el valor con o sin el símbolo de peso según la opción
    return includeSymbol ? `$${formattedAmount}` : formattedAmount;
  };

  /**
   * Formatea un número a formato compacto de pesos argentinos (ej: $1K, $1M)
   * @param amount - El valor numérico a formatear
   * @returns El valor formateado en formato compacto
   */
  const formatToCompactCurrency = (amount: number): string => {
    if (amount < 1000) {
      return `$${amount.toLocaleString('es-AR')}`;
    } else if (amount < 1000000) {
      return `$${(amount / 1000).toLocaleString('es-AR', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 1 
      })}K`;
    } else {
      return `$${(amount / 1000000).toLocaleString('es-AR', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 1 
      })}M`;
    }
  };

  return {
    formatToCurrency,
    formatToCompactCurrency
  };
}; 