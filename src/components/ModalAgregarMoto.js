// src/components/ModalAgregarMoto.js
// ─────────────────────────────────────────────
//  Formulario modal para agregar una nueva moto
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';

const CAMPOS_INICIALES = {
  marca: '',
  modelo: '',
  año: '',
  precio: '',
  km: '',
  color: '',
};

export default function ModalAgregarMoto({ visible, onCerrar, onAgregar }) {
  const [form, setForm] = useState(CAMPOS_INICIALES);

  const actualizar = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }));

  const validarYGuardar = () => {
    const { marca, modelo, año, precio, km, color } = form;

    if (!marca || !modelo || !año || !precio || !km || !color) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }
    if (isNaN(año) || Number(año) < 1990 || Number(año) > new Date().getFullYear()) {
      Alert.alert('Año inválido', `El año debe estar entre 1990 y ${new Date().getFullYear()}.`);
      return;
    }
    if (isNaN(precio) || Number(precio) <= 0) {
      Alert.alert('Precio inválido', 'El precio debe ser un número mayor a 0.');
      return;
    }
    if (isNaN(km) || Number(km) < 0) {
      Alert.alert('Kilometraje inválido', 'El km debe ser un número mayor o igual a 0.');
      return;
    }

    onAgregar({
      marca:  marca.trim(),
      modelo: modelo.trim(),
      año:    Number(año),
      precio: Number(precio),
      km:     Number(km),
      color:  color.trim(),
      imagen: '🏍',
    });

    setForm(CAMPOS_INICIALES);
    onCerrar();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* ── Encabezado ── */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>➕ Añadir Vehículo</Text>
              <TouchableOpacity onPress={onCerrar}>
                <Text style={styles.btnCerrar}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ── Campos ── */}
            {[
              { campo: 'marca',   label: 'Marca',        placeholder: 'Ej: Yamaha',     teclado: 'default' },
              { campo: 'modelo',  label: 'Modelo',       placeholder: 'Ej: MT-07',      teclado: 'default' },
              { campo: 'año',     label: 'Año',          placeholder: 'Ej: 2022',       teclado: 'numeric' },
              { campo: 'precio',  label: 'Precio (COP)', placeholder: 'Ej: 18500000',   teclado: 'numeric' },
              { campo: 'km',      label: 'Kilometraje',  placeholder: 'Ej: 5000',       teclado: 'numeric' },
              { campo: 'color',   label: 'Color',        placeholder: 'Ej: Negro',      teclado: 'default' },
            ].map(({ campo, label, placeholder, teclado }) => (
              <View key={campo} style={styles.campoContenedor}>
                <Text style={styles.campoLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor="#666666"
                  keyboardType={teclado}
                  value={form[campo]}
                  onChangeText={val => actualizar(campo, val)}
                />
              </View>
            ))}

            {/* ── Botones ── */}
            <View style={styles.botones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={onCerrar} activeOpacity={0.8}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={validarYGuardar} activeOpacity={0.8}>
                <Text style={styles.btnGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:           { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modal:             { backgroundColor: '#2B2B2B', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },

  modalHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitulo:       { fontSize: 20, fontWeight: 'bold', color: '#FFD700' },
  btnCerrar:         { fontSize: 20, color: '#AAAAAA', paddingHorizontal: 6 },

  campoContenedor:   { marginBottom: 14 },
  campoLabel:        { fontSize: 11, color: '#888888', letterSpacing: 1, marginBottom: 6 },
  input:             { backgroundColor: '#3A3A3A', color: '#FFFFFF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1, borderColor: '#444444' },

  botones:           { flexDirection: 'row', gap: 10, marginTop: 10, paddingBottom: 10 },
  btnCancelar:       { flex: 1, backgroundColor: '#3A3A3A', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnCancelarTexto:  { color: '#AAAAAA', fontWeight: 'bold', fontSize: 15 },
  btnGuardar:        { flex: 1, backgroundColor: '#FFD700', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnGuardarTexto:   { color: '#000000', fontWeight: 'bold', fontSize: 15 },
});
