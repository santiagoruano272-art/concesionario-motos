import { syncData } from './src/utils/cloudEngine';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  const [resultado, setResultado] = useState('Presiona para sincronizar');

  // Al presionar el botón, llama a syncData y muestra el resultado
  const handleSync = async () => {
    setResultado('Sincronizando...');
    const data = await syncData();
    if (data.length === 0) {
      setResultado('Sin datos o error de conexión (ver consola)');
    } else {
      setResultado(`✅ ${data.length} registro(s) recibidos`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.botonEnorme} onPress={handleSync} activeOpacity={0.8}>
        <Text style={styles.botonTexto}>☁️ SINCRONIZAR DATOS</Text>
      </TouchableOpacity>
      <Text style={styles.resultado}>{resultado}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  botonEnorme: { width: '100%', paddingVertical: 30, backgroundColor: '#FFD700', borderRadius: 16, alignItems: 'center', elevation: 10 },
  botonTexto:  { fontSize: 22, fontWeight: 'bold', color: '#000' },
  resultado:   { marginTop: 24, color: '#AAAAAA', fontSize: 15, textAlign: 'center' },
});