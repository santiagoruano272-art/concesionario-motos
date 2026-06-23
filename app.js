// App.js  ← Componente raíz
// ─────────────────────────────────────────────
//  Estado FINAL después del cherry-pick de la rama legacy-engine.
//
//  ¿Qué cambió respecto al App.js original?
//  → Se añadió el import de { syncData } desde cloudEngine (rescatado
//    del Commit 1 via cherry-pick). El Commit 3 del cherry-pick trajo
//    este import; tú resolverás el conflicto conservando la lógica
//    completa del concesionario Y el import de syncData juntos.
//
//  El resto del archivo es idéntico al original.
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';

import MotoCard               from './src/components/MotoCard';
import CalculadoraDepreciacion from './src/components/CalculadoraDepreciacion';
import ModalAgregarMoto       from './src/components/ModalAgregarMoto';
import motosIniciales         from './src/data/motos.json';

// ← AÑADIDO por el cherry-pick del Commit 1 (El Órgano Vital)
//   Importamos syncData para que quede disponible en el componente raíz.
//   En el futuro, podrías llamarla en un useEffect al iniciar la app.
import { syncData } from './src/utils/cloudEngine';

export default function App() {
  // ── Estado global ──
  const [motos, setMotos]               = useState(motosIniciales);
  const [motoDetalle, setMotoDetalle]   = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nextId, setNextId]             = useState(motosIniciales.length + 1);

  // ── Añadir moto (viene del modal) ──
  const handleAgregar = (nuevaMoto) => {
    const conId = { ...nuevaMoto, id: String(nextId) };
    setMotos(prev => [...prev, conId]);
    setNextId(prev => prev + 1);
  };

  // ── Eliminar moto ──
  const handleEliminar = (id) => {
    const moto = motos.find(m => m.id === id);
    Alert.alert(
      '🗑 Eliminar Vehículo',
      `¿Deseas eliminar la ${moto.marca} ${moto.modelo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setMotos(prev => prev.filter(m => m.id !== id)),
        },
      ]
    );
  };

  // ── Vista: Detalle de depreciación ──
  if (motoDetalle) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <CalculadoraDepreciacion
          moto={motoDetalle}
          onVolver={() => setMotoDetalle(null)}
        />
      </SafeAreaView>
    );
  }

  // ── Vista: Lista principal ──
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>🏍 Concesionario</Text>
          <Text style={styles.headerSub}>
            {motos.length} moto{motos.length !== 1 ? 's' : ''} en inventario
          </Text>
        </View>
      </View>

      {/* Botón Añadir Vehículo */}
      <TouchableOpacity
        style={styles.btnAñadir}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.btnAñadirTexto}>＋  Añadir Vehículo</Text>
      </TouchableOpacity>

      {/* Lista de motos o estado vacío */}
      {motos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcono}>🚫</Text>
          <Text style={styles.emptyTexto}>Sin motos en inventario</Text>
          <Text style={styles.emptyHint}>Presiona "Añadir Vehículo" para comenzar.</Text>
        </View>
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MotoCard
              moto={item}
              onEliminar={handleEliminar}
              onVerDetalle={setMotoDetalle}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal Agregar */}
      <ModalAgregarMoto
        visible={modalVisible}
        onCerrar={() => setModalVisible(false)}
        onAgregar={handleAgregar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#1A1A1A' },
  lista:          { paddingHorizontal: 16, paddingBottom: 40 },

  header:         { backgroundColor: '#2B2B2B', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 2, borderBottomColor: '#FFD700' },
  headerTitulo:   { fontSize: 26, fontWeight: 'bold', color: '#FFD700', fontFamily: 'monospace' },
  headerSub:      { fontSize: 13, color: '#AAAAAA', marginTop: 2 },

  btnAñadir:      { backgroundColor: '#FFD700', marginHorizontal: 16, marginVertical: 14, paddingVertical: 14, borderRadius: 10, alignItems: 'center', elevation: 6 },
  btnAñadirTexto: { color: '#000000', fontWeight: 'bold', fontSize: 16 },

  emptyState:     { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcono:     { fontSize: 60, marginBottom: 16 },
  emptyTexto:     { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  emptyHint:      { color: '#888888', fontSize: 13, textAlign: 'center', marginTop: 8 },
});