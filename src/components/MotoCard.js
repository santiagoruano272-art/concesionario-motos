// src/components/MotoCard.js
// ─────────────────────────────────────────────
//  Card tipo concesionario — Fase 2
//  Muestra info básica de la moto y dos botones:
//    · Ver detalle (abre CalculadoraDepreciacion)
//    · Eliminar
// ─────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatearPrecio } from '../utils/calculadora';

export default function MotoCard({ moto, onEliminar, onVerDetalle }) {
  return (
    <View style={styles.card}>

      {/* ── Encabezado ── */}
      <View style={styles.header}>
        <Text style={styles.icono}>{moto.imagen}</Text>
        <View style={styles.headerTexto}>
          <Text style={styles.marca}>{moto.marca}</Text>
          <Text style={styles.modelo}>{moto.modelo}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>{moto.año}</Text>
        </View>
      </View>

      {/* ── Separador ── */}
      <View style={styles.separador} />

      {/* ── Datos ── */}
      <View style={styles.datos}>
        <View style={styles.dato}>
          <Text style={styles.datoLabel}>PRECIO</Text>
          <Text style={styles.datoValor}>{formatearPrecio(moto.precio)}</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.datoLabel}>KM</Text>
          <Text style={styles.datoValor}>{moto.km.toLocaleString('es-CO')} km</Text>
        </View>
        <View style={styles.dato}>
          <Text style={styles.datoLabel}>COLOR</Text>
          <Text style={styles.datoValor}>{moto.color}</Text>
        </View>
      </View>

      {/* ── Botones ── */}
      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.btnDetalle}
          onPress={() => onVerDetalle(moto)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnDetalleTexto}>🔍 Ver Detalle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnEliminar}
          onPress={() => onEliminar(moto.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnEliminarTexto}>🗑 Eliminar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card:            { backgroundColor: '#2B2B2B', borderRadius: 14, padding: 16, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#FFD700', elevation: 4 },

  // Header
  header:          { flexDirection: 'row', alignItems: 'center' },
  icono:           { fontSize: 34, marginRight: 10 },
  headerTexto:     { flex: 1 },
  marca:           { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  modelo:          { fontSize: 13, color: '#AAAAAA', marginTop: 2 },
  badge:           { backgroundColor: '#3A3A3A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#FFD700' },
  badgeTexto:      { color: '#FFD700', fontWeight: 'bold', fontFamily: 'monospace' },

  separador:       { height: 1, backgroundColor: '#3A3A3A', marginVertical: 12 },

  // Datos
  datos:           { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  dato:            { flex: 1 },
  datoLabel:       { fontSize: 10, color: '#888888', letterSpacing: 1 },
  datoValor:       { fontSize: 13, color: '#FFFFFF', fontFamily: 'monospace', marginTop: 2, fontWeight: 'bold' },

  // Botones
  botones:         { flexDirection: 'row', gap: 10 },
  btnDetalle:      { flex: 1, backgroundColor: '#FFD700', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnDetalleTexto: { color: '#000000', fontWeight: 'bold', fontSize: 13 },
  btnEliminar:     { flex: 1, backgroundColor: '#C62828', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnEliminarTexto:{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
});
