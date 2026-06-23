// src/utils/cloudEngine.js
// ─────────────────────────────────────────────
//  Motor de sincronización con Supabase
//  Fase 1 → Este archivo es "El Órgano Vital" (Commit 1) que rescatamos
//  Fase 2 → Se expandió para enviar telemetría a la tabla telemetry_logs
// ─────────────────────────────────────────────

// ── Configuración de Supabase ──────────────────────────────────────────────
// Reemplaza estos valores con los de tu proyecto en https://supabase.com
const SUPABASE_URL     = 'https://TU_PROYECTO.supabase.co';   // ← cambia esto
const SUPABASE_API_KEY = 'TU_ANON_KEY_AQUI';                  // ← cambia esto

// Nombre de la tabla que creamos en Supabase (Fase 2)
const TABLE = 'telemetry_logs';

// ─────────────────────────────────────────────────────────────────────────────
//  syncData()
//  Función original del Commit 1 (El Órgano Vital).
//  Hace un fetch genérico al endpoint REST de Supabase para leer registros
//  de telemetría. Si el servidor responde con un error HTTP (ej: 401 por
//  token vencido), captura el error y devuelve un array vacío [] en vez de
//  romper la app (esto es lo que verifica la Prueba 2 de Jest).
//
//  Parámetros opcionales (para tests):
//    - customUrl    → permite inyectar una URL diferente desde los tests
//    - customApiKey → permite inyectar una API key falsa desde los tests
// ─────────────────────────────────────────────────────────────────────────────
export async function syncData(customUrl = null, customApiKey = null) {
  // Si los tests inyectan valores alternativos los usamos; si no, usamos los globales
  const url    = customUrl    ?? `${SUPABASE_URL}/rest/v1/${TABLE}?select=*`;
  const apiKey = customApiKey ?? SUPABASE_API_KEY;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // apikey   → identifica el proyecto en Supabase (requerido siempre)
        // Authorization → Bearer token para autenticación RLS
        'apikey':        apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
    });

    // PostgREST (el servidor de Supabase) devuelve HTTP 401 cuando la apikey
    // es inválida o el token expiró. En vez de lanzar una excepción que
    // crashea la app, devolvemos [] para que la UI pueda manejar el caso.
    if (!response.ok) {
      console.warn(`[cloudEngine] HTTP ${response.status} — devolviendo []`);
      return [];
    }

    // Convertimos la respuesta a JSON y la devolvemos
    const data = await response.json();
    return data;

  } catch (error) {
    // Error de red (sin conexión, timeout, etc.) → también devolvemos []
    console.error('[cloudEngine] Error de red:', error.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  sendTelemetry(payload)
//  Nueva función añadida en Fase 2.
//  Inserta un registro en la tabla telemetry_logs con:
//    - device_os   → sistema operativo del dispositivo (texto)
//    - payload     → objeto JSON anidado con datos de rendimiento
//    - status_code → código de estado de la operación (entero)
//
//  El campo "payload" es de tipo JSONB en Supabase, lo que permite guardar
//  objetos anidados como { "bateria": 80, "red": "4G" }.
// ─────────────────────────────────────────────────────────────────────────────
export async function sendTelemetry(payloadData) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        'apikey':        SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type':  'application/json',
        // Prefer: return=representation → hace que Supabase devuelva la fila
        // recién insertada (útil para confirmar que se guardó con el id UUID)
        'Prefer':        'return=representation',
      },
      body: JSON.stringify({
        device_os:   'Android',          // texto plano con el OS del dispositivo
        payload:     payloadData,        // objeto anidado → se guarda como JSONB
        status_code: 200,                // entero que indica éxito de la operación
      }),
    });

    if (!response.ok) {
      console.warn(`[cloudEngine] sendTelemetry HTTP ${response.status}`);
      return null;
    }

    const inserted = await response.json();
    return inserted;

  } catch (error) {
    console.error('[cloudEngine] sendTelemetry error:', error.message);
    return null;
  }
}