const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'salud_digital_aps.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando:', err.message);
    return;
  }
  console.log('✅ Conectado a la base de datos correcta');
});

console.log('\n🎯 CREANDO PLAN Y DEMANDA INDUCIDA');

async function createPlanAndDemanda() {
  try {
    // Usar la familia y paciente que ya creamos
    const familiaId = 8;
    const pacienteId = 6;
    
    // 1. Crear un plan de cuidado familiar
    const insertPlan = `
      INSERT INTO Planes_Cuidado_Familiar (
        familia_id, paciente_principal_id, fecha_entrega, plan_asociado,
        condicion_identificada, logro_salud, cuidados_salud, 
        demandas_inducidas_desc, educacion_salud, estado, creado_por_uid, fecha_aceptacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const planId = await new Promise((resolve, reject) => {
      db.run(insertPlan, [
        familiaId,
        pacienteId,
        new Date().toISOString().split('T')[0], // fecha_entrega
        JSON.stringify(['Hábitos saludables', 'Planificación familiar']), // plan_asociado
        'Riesgo cardiovascular y salud mental', // condicion_identificada
        'Mejorar calidad de vida y control de factores de riesgo', // logro_salud
        'Monitoreo de presión arterial y seguimiento psicológico', // cuidados_salud
        'Consulta médica integral', // demandas_inducidas_desc
        'Educación sobre dieta saludable y manejo del estrés', // educacion_salud
        'Activo', // estado
        1, // creado_por_uid
        new Date().toISOString().split('T')[0] // fecha_aceptacion
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    console.log(`✅ Plan de cuidado familiar creado (ID: ${planId})`);
    
    // 2. Crear demanda inducida
    const insertDemanda = `
      INSERT INTO Demandas_Inducidas (
        plan_id, tipo_demanda, descripcion, prioridad, fecha_creacion, 
        fecha_limite, estado, paciente_id, fecha_asignacion, creado_por_uid, 
        fecha_creacion_timestamp, profesional_asignado, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const demandaId = await new Promise((resolve, reject) => {
      db.run(insertDemanda, [
        planId, // plan_id
        'Consulta', // tipo_demanda
        'Consulta médica integral para María Elena Martinez López - Control prenatal, salud mental y enfermedades crónicas', // descripcion
        'Alta', // prioridad
        new Date().toISOString(), // fecha_creacion
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // fecha_limite (7 días)
        'Asignada', // estado
        pacienteId, // paciente_id
        new Date().toISOString().split('T')[0], // fecha_asignacion
        1, // creado_por_uid (Dr. Carlos Mendoza)
        new Date().toISOString(), // fecha_creacion_timestamp
        1, // profesional_asignado (Dr. Carlos Mendoza)
        'Demanda inducida para seguimiento integral de salud - incluye control prenatal, evaluación de salud mental y manejo de enfermedades crónicas'
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    
    console.log('✅ Demanda inducida creada exitosamente');
    console.log(`📋 ID de la demanda: ${demandaId}`);
    console.log(`👤 Paciente: María Elena Martinez López (ID: ${pacienteId})`);
    console.log(`👨‍⚕️ Asignada a: Dr. Carlos Mendoza (ID: 1)`);
    console.log(`📅 Estado: Asignada`);
    console.log(`📋 Plan asociado: ${planId}`);
    
    console.log('\n🎯 ¡LISTO PARA PROBAR!');
    console.log('1. Reinicia el backend');
    console.log('2. Inicia sesión con: medico1@saludigital.edu.co / 1000000001');
    console.log('3. Ve a "Consultas Asignadas" → "Demandas Inducidas"');
    console.log('4. Deberías ver la demanda de María Elena Martinez López');
    
  } catch (error) {
    console.error('Error creando plan y demanda:', error);
  } finally {
    db.close();
  }
}

createPlanAndDemanda();
