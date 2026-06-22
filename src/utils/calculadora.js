// src/utils/calculadora.js
// ─────────────────────────────────────────────
//  Lógica pura de depreciación — sin UI, sin imports de React
// ─────────────────────────────────────────────

/**
 * Calcula el valor depreciado de una moto según su año y kilometraje.
 *
 * Reglas:
 *  - 10% de depreciación por cada año de antigüedad
 *  - 5% adicional si supera los 20.000 km
 *  - El valor nunca baja del 20% del precio original
 *
 * @param {number} precioOriginal  - Precio de lista en COP
 * @param {number} año             - Año de fabricación
 * @param {number} km              - Kilometraje actual
 * @returns {{ valorActual, porcentajeDepreciacion, antiguedad, alertaKm }}
 */
export function calcularDepreciacion(precioOriginal, año, km) {
  const añoActual = new Date().getFullYear();
  const antiguedad = añoActual - año;

  let porcentaje = antiguedad * 0.10;

  const alertaKm = km > 20000;
  if (alertaKm) porcentaje += 0.05;

  // El valor no puede bajar del 20% del original
  const porcentajeFinal = Math.min(porcentaje, 0.80);
  const valorActual = Math.round(precioOriginal * (1 - porcentajeFinal));
  const porcentajeDepreciacion = Math.round(porcentajeFinal * 100);

  return {
    valorActual,
    porcentajeDepreciacion,
    antiguedad,
    alertaKm,
  };
}

/**
 * Formatea un número como precio en pesos colombianos.
 * Ejemplo: 18500000 → "$ 18.500.000 COP"
 *
 * @param {number} valor
 * @returns {string}
 */
export function formatearPrecio(valor) {
  return `$ ${valor.toLocaleString('es-CO')} COP`;
}
