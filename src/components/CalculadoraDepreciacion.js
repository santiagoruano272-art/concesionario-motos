// src/components/CalculadoraDepreciacion.js
// ─────────────────────────────────────────────
//  Vista detalle con cálculo de depreciación — Fase 3
//  Se muestra cuando el usuario presiona "Ver Detalle" en una MotoCard
// ─────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { calcularDepreciacion, formatearPrecio } from '../utils/calculadora';

export default function CalculadoraDepreciacion({ moto, onVolver }) {
  const { valorActual, porcentajeDepreciacion, antiguedad, alertaKm } =
    calcularDepreciacion(moto.precio, moto.año, moto.km);

  const perdida = moto.precio - valorActual;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Botón volver ── */}
      <TouchableOpacity style={styles.btnVolver} onPress={onVolver} activeOpacity={0.8}>
        <Text style={styles.btnVolverTexto}>← Volver</Text>
      </TouchableOpacity>

      {/* ── Título ── */}
      <Text style={styles.titulo}>🏍 {moto.marca} {moto.modelo}</Text>
      <Text style={styles.subtitulo}>Análisis de Depreciación</Text>

      {/* ── Tarjeta principal ── */}
      <View style={styles.tarjeta}>
        <Text style={styles.seccionLabel}>PRECIO ORIGINAL</Text>
        <Text style={styles.precioOriginal}>{formatearPrecio(moto.precio)}</Text>

        <View style={styles.separador} />

        {/* Barra de depreciación */}
        <Text style={styles.seccionLabel}>DEPRECIACIÓN ACUMULADA</Text>
        <View style={styles.barraContenedor}>
          <View style={[styles.barraRelleno, { width: `${porcentajeDepreciacion}%` }]} />
        </View>
        <Text style={styles.porcentajeTexto}>{porcentajeDepreciacion}% depreciadx</Text>

        <View style={styles.separador} />

        {/* Valor actual */}
        <Text style={styles.seccionLabel}>VALOR ACTUAL ESTIMADO</Text>
        <Text style={styles.valorActual}>{formatearPrecio(valorActual)}</Text>

        <Text style={styles.perdidaTexto}>
          Pérdida estimada: {formatearPrecio(perdida)}
        </Text>
      </View>

      {/* ── Detalle de factores ── */}
      <View style={styles.tarjeta}>
        <Text style={styles.seccionLabel}>FACTORES APLICADOS</Text>

        <View style={styles.factor}>
          <Text style={styles.factorIcono}>📅</Text>
          <View>
            <Text style={styles.factorTitulo}>Antigüedad</Text>
            <Text style={styles.factorValor}>{antiguedad} año{antiguedad !== 1 ? 's' : ''} → -{antiguedad * 10}%</Text>
          </View>
        </View>

        <View style={styles.factor}>
          <Text style={styles.factorIcono}>{alertaKm ? '⚠️' : '✅'}</Text>
          <View>
            <Text style={styles.factorTitulo}>Kilometraje</Text>
            <Text style={[styles.factorValor, alertaKm && styles.alertaTexto]}>
              {moto.km.toLocaleString('es-CO')} km
              {alertaKm ? ' → -5% adicional' : ' → Sin penalización'}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Alerta si km alto ── */}
      {alertaKm && (
        <View style={styles.alerta}>
          <Text style={styles.alertaIcono}>⚠️</Text>
          <Text style={styles.alertaMensaje}>
            Esta moto supera los 20.000 km. Se aplica un 5% de depreciación adicional.
          </Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#1A1A1A' },
  content:           { padding: 16, paddingBottom: 40 },

  btnVolver:         { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#3A3A3A', borderRadius: 8, marginBottom: 20 },
  btnVolverTexto:    { color: '#FFD700', fontWeight: 'bold', fontSize: 14 },

  titulo:            { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  subtitulo:         { fontSize: 13, color: '#888888', marginBottom: 20, letterSpacing: 1 },

  tarjeta:           { backgroundColor: '#2B2B2B', borderRadius: 14, padding: 16, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#FFD700' },
  seccionLabel:      { fontSize: 10, color: '#888888', letterSpacing: 1.5, marginBottom: 6 },
  separador:         { height: 1, backgroundColor: '#3A3A3A', marginVertical: 14 },

  precioOriginal:    { fontSize: 22, color: '#AAAAAA', fontFamily: 'monospace', textDecorationLine: 'line-through' },
  valorActual:       { fontSize: 26, color: '#FFD700', fontFamily: 'monospace', fontWeight: 'bold' },
  perdidaTexto:      { fontSize: 12, color: '#E57373', marginTop: 4, fontFamily: 'monospace' },

  // Barra
  barraContenedor:   { height: 12, backgroundColor: '#3A3A3A', borderRadius: 6, overflow: 'hidden', marginVertical: 8 },
  barraRelleno:      { height: '100%', backgroundColor: '#E53935', borderRadius: 6 },
  porcentajeTexto:   { fontSize: 13, color: '#E57373', fontFamily: 'monospace' },

  // Factores
  factor:            { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 12 },
  factorIcono:       { fontSize: 22 },
  factorTitulo:      { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  factorValor:       { color: '#AAAAAA', fontSize: 13, fontFamily: 'monospace', marginTop: 2 },
  alertaTexto:       { color: '#E57373' },

  // Alerta
  alerta:            { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#3E1A1A', borderRadius: 10, padding: 14, borderLeftWidth: 3, borderLeftColor: '#E53935' },
  alertaIcono:       { fontSize: 20 },
  alertaMensaje:     { color: '#FFCDD2', fontSize: 13, flex: 1, lineHeight: 20 },
});
