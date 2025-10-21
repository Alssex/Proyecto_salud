// backend/server.js - API v1 Structure
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a SQLite (usa la ruta correcta de tu BD)
const dbPath = path.join(__dirname, 'database', 'salud_digital_aps.db');
console.log('📊 Base de datos: ', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a SQLite:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

// ==================== API v1 STRUCTURE ====================

// Root endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'API v1 - Salud Digital APS',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/v1/usuarios',
      demandas: '/api/v1/demandas',
      equipos: '/api/v1/equipos',
      bitacoras: '/api/v1/bitacoras',
      familias: '/api/v1/familias',
      pacientes: '/api/v1/pacientes',
      token: '/api/v1/token',
      historias_clinicas: '/api/v1/historias-clinicas',
      reportes: '/api/v1/reportes',
      caracterizaciones: '/api/v1/caracterizaciones',
      planes_cuidado: '/api/v1/planes-cuidado'
    }
  });
});

// API v1 docs (árbol de endpoints)
app.get('/api/v1/docs', (req, res) => {
  res.json({
    base: '/api/v1',
    tree: [
      {
        path: '/usuarios',
        methods: [{ method: 'GET', path: '/' }, { method: 'GET', path: '/me' }]
      },
      {
        path: '/demandas',
        methods: [
          { method: 'GET', path: '/asignadas' },
          { method: 'POST', path: '/:id/historia-clinica' }
        ]
      },
      {
        path: '/equipos',
        methods: [{ method: 'GET', path: '/:id/usuarios' }]
      },
      {
        path: '/bitacoras',
        methods: [{ method: 'POST', path: '/' }, { method: 'GET', path: '/' }]
      },
      {
        path: '/familias',
        methods: [{ method: 'POST', path: '/:id/caracterizacion' }]
      },
      {
        path: '/pacientes',
        methods: [
          { method: 'POST', path: '/' },
          { method: 'POST', path: '/:id/plan-cuidado' },
          { method: 'GET', path: '/:id/historias-clinicas' },
          { method: 'POST', path: '/:id/receta' },
          { method: 'POST', path: '/:id/orden-lab' }
        ]
      },
      { path: '/token', methods: [{ method: 'POST', path: '/' }] },
      {
        path: '/historias-clinicas',
        methods: [{ method: 'GET', path: '/:id/epidemiologico' }]
      },
      {
        path: '/reportes',
        methods: [{ method: 'GET', path: '/productividad' }]
      },
      {
        path: '/caracterizaciones',
        methods: [{ method: 'PUT', path: '/:id' }]
      },
      {
        path: '/planes-cuidado',
        methods: [{ method: 'POST', path: '/:id/demanda' }]
      }
    ]
  });
});

// ==================== ENDPOINTS DE AUTENTICACIÓN ====================

// POST /api/v1/token - Login
app.post('/api/v1/token', (req, res) => {
  const { email, password } = req.body;
  console.log('Token request:', email);
  
  const query = `
    SELECT 
      u.usuario_id, u.nombre_completo, u.email, u.numero_documento,
      r.nombre_rol, r.rol_id,
      e.nombre_equipo, e.equipo_id
    FROM Usuarios u 
    JOIN Roles r ON u.rol_id = r.rol_id 
    LEFT JOIN Equipos_Basicos e ON u.equipo_id = e.equipo_id 
    WHERE u.email = ? AND u.numero_documento = ?
  `;
  
  db.get(query, [email, password], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    console.log('Token generated for:', row.nombre_completo);
    res.json({ 
      token: `token_${row.usuario_id}_${Date.now()}`,
      user: {
        id: row.usuario_id,
        name: row.nombre_completo,
        email: row.email,
        role: row.nombre_rol,
        roleId: row.rol_id,
        team: row.nombre_equipo,
        document: row.numero_documento
      }
    });
  });
});

// ==================== USUARIOS ENDPOINTS ====================

// GET /api/v1/usuarios - List all users
app.get('/api/v1/usuarios', (req, res) => {
  const query = `
    SELECT 
      u.usuario_id, u.nombre_completo, u.email, u.numero_documento, u.telefono,
      r.nombre_rol, r.rol_id,
      e.nombre_equipo, e.equipo_id, e.zona_cobertura
    FROM Usuarios u
    JOIN Roles r ON u.rol_id = r.rol_id
    LEFT JOIN Equipos_Basicos e ON u.equipo_id = e.equipo_id
    WHERE u.activo = 1
    ORDER BY u.nombre_completo
  `;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/v1/usuarios/me - Get current user profile
app.get('/api/v1/usuarios/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const userId = token.split('_')[1];
  
  if (!userId) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const query = `
    SELECT 
      u.usuario_id, u.nombre_completo, u.email, u.numero_documento, u.telefono,
      r.nombre_rol, r.rol_id,
      e.nombre_equipo, e.equipo_id, e.zona_cobertura
    FROM Usuarios u
    JOIN Roles r ON u.rol_id = r.rol_id
    LEFT JOIN Equipos_Basicos e ON u.equipo_id = e.equipo_id
    WHERE u.usuario_id = ? AND u.activo = 1
  `;

  db.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  });
});

// ==================== DEMANDAS ENDPOINTS ====================

// GET /api/v1/demandas/asignadas - View my assigned demands
app.get('/api/v1/demandas/asignadas', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  const query = `
    SELECT 
      d.demanda_id, d.tipo_demanda, d.descripcion, d.fecha_creacion, d.estado,
      f.apellido_principal, f.familia_id,
      p.primer_nombre, p.primer_apellido, p.paciente_id
    FROM Demandas d
    LEFT JOIN Familias f ON d.familia_id = f.familia_id
    LEFT JOIN Pacientes p ON d.paciente_id = p.paciente_id
    WHERE d.activa = 1
    ORDER BY d.fecha_creacion DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/v1/demandas/{id}/historia-clinica - Create medical history for demand
app.post('/api/v1/demandas/:id/historia-clinica', (req, res) => {
  const { id } = req.params;
  const { paciente_id, tipo_consulta, motivo_consulta, sintomas, diagnostico, tratamiento, observaciones } = req.body;
  
  if (!paciente_id || !tipo_consulta || !motivo_consulta) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Historias_Clinicas (paciente_id, demanda_id, tipo_consulta, motivo_consulta, sintomas, diagnostico, tratamiento, observaciones, fecha_consulta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(insert, [paciente_id, id, tipo_consulta, motivo_consulta, sintomas || null, diagnostico || null, tratamiento || null, observaciones || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear la historia clínica' });
    res.status(201).json({ historia_clinica_id: this.lastID });
  });
});

// ==================== EQUIPOS ENDPOINTS ====================

// GET /api/v1/equipos/{id}/usuarios - List users by team
app.get('/api/v1/equipos/:id/usuarios', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      u.usuario_id, u.nombre_completo, u.email, u.numero_documento, u.telefono,
      r.nombre_rol, r.rol_id
    FROM Usuarios u
    JOIN Roles r ON u.rol_id = r.rol_id
    WHERE u.equipo_id = ? AND u.activo = 1
    ORDER BY u.nombre_completo
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ==================== BITÁCORAS ENDPOINTS ====================

// POST /api/v1/bitacoras - Register log entry
app.post('/api/v1/bitacoras', (req, res) => {
  const { usuario_id, tipo_actividad, descripcion, ubicacion, observaciones } = req.body;
  
  if (!usuario_id || !tipo_actividad || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Bitacoras (usuario_id, tipo_actividad, descripcion, ubicacion, observaciones, fecha_registro)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(insert, [usuario_id, tipo_actividad, descripcion, ubicacion || null, observaciones || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo registrar la bitácora' });
    res.status(201).json({ bitacora_id: this.lastID });
  });
});

// GET /api/v1/bitacoras - Search log entries
app.get('/api/v1/bitacoras', (req, res) => {
  const { usuario_id, tipo_actividad, fecha_desde, fecha_hasta } = req.query;
  
  let query = `
    SELECT b.*, u.nombre_completo as usuario_nombre
    FROM Bitacoras b
    JOIN Usuarios u ON b.usuario_id = u.usuario_id
    WHERE 1=1
  `;
  const params = [];
  
  if (usuario_id) {
    query += ' AND b.usuario_id = ?';
    params.push(usuario_id);
  }
  if (tipo_actividad) {
    query += ' AND b.tipo_actividad = ?';
    params.push(tipo_actividad);
  }
  if (fecha_desde) {
    query += ' AND b.fecha_registro >= ?';
    params.push(fecha_desde);
  }
  if (fecha_hasta) {
    query += ' AND b.fecha_registro <= ?';
    params.push(fecha_hasta);
  }
  
  query += ' ORDER BY b.fecha_registro DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ==================== FAMILIAS ENDPOINTS ====================

// POST /api/v1/familias/{id}/caracterizacion - Create family characterization
app.post('/api/v1/familias/:id/caracterizacion', (req, res) => {
  const { id } = req.params;
  const { tipo_vivienda, material_paredes, material_piso, servicios_publicos, numero_habitaciones, numero_personas, ingresos_mensuales, observaciones } = req.body;
  
  const insert = `
    INSERT INTO Caracterizaciones (familia_id, tipo_vivienda, material_paredes, material_piso, servicios_publicos, numero_habitaciones, numero_personas, ingresos_mensuales, observaciones, fecha_caracterizacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(insert, [id, tipo_vivienda || null, material_paredes || null, material_piso || null, servicios_publicos || null, numero_habitaciones || null, numero_personas || null, ingresos_mensuales || null, observaciones || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear la caracterización' });
    res.status(201).json({ caracterizacion_id: this.lastID });
  });
});

// ==================== PACIENTES ENDPOINTS ====================

// POST /api/v1/pacientes - Add new patient
app.post('/api/v1/pacientes', (req, res) => {
  const {
    familia_id,
    numero_documento,
    tipo_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    genero,
    telefono,
    email
  } = req.body || {};

  if (!familia_id || !primer_nombre || !primer_apellido || !tipo_documento || !numero_documento) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: familia_id, tipo_documento, numero_documento, primer_nombre, primer_apellido'
    });
  }

  const insert = `
    INSERT INTO Pacientes (
      familia_id, numero_documento, tipo_documento,
      primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      fecha_nacimiento, genero, telefono, email, activo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  const params = [
    familia_id, numero_documento, tipo_documento,
    primer_nombre, segundo_nombre || null, primer_apellido, segundo_apellido || null,
    fecha_nacimiento || null, genero || null, telefono || null, email || null
  ];

  db.run(insert, params, function(err) {
    if (err) {
      console.error('Error insertando paciente:', err);
      return res.status(500).json({ error: 'No se pudo crear el paciente' });
    }
    const createdId = this.lastID;
    res.status(201).json({ paciente_id: createdId, familia_id });
  });
});

// POST /api/v1/pacientes/{id}/plan-cuidado - Create care plan for patient
app.post('/api/v1/pacientes/:id/plan-cuidado', (req, res) => {
  const { id } = req.params;
  const { objetivo, actividades, responsable, fecha_inicio, fecha_fin, observaciones } = req.body;
  
  if (!objetivo || !actividades) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Planes_Cuidado (paciente_id, objetivo, actividades, responsable, fecha_inicio, fecha_fin, observaciones, fecha_creacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(insert, [id, objetivo, actividades, responsable || null, fecha_inicio || null, fecha_fin || null, observaciones || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear el plan de cuidado' });
    res.status(201).json({ plan_cuidado_id: this.lastID });
  });
});

// GET /api/v1/pacientes/{id}/historias-clinicas - View patient medical history
app.get('/api/v1/pacientes/:id/historias-clinicas', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      hc.historia_clinica_id, hc.tipo_consulta, hc.motivo_consulta, hc.sintomas, 
      hc.diagnostico, hc.tratamiento, hc.observaciones, hc.fecha_consulta,
      u.nombre_completo as profesional_nombre
    FROM Historias_Clinicas hc
    LEFT JOIN Usuarios u ON hc.profesional_id = u.usuario_id
    WHERE hc.paciente_id = ?
    ORDER BY hc.fecha_consulta DESC
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/v1/pacientes/{id}/receta - Create prescription for patient
app.post('/api/v1/pacientes/:id/receta', (req, res) => {
  const { id } = req.params;
  const { medicamentos, instrucciones, fecha_vencimiento, profesional_id } = req.body;
  
  if (!medicamentos || !profesional_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Recetas (paciente_id, profesional_id, medicamentos, instrucciones, fecha_vencimiento, fecha_emision, activa)
    VALUES (?, ?, ?, ?, ?, datetime('now'), 1)
  `;
  
  db.run(insert, [id, profesional_id, JSON.stringify(medicamentos), instrucciones || null, fecha_vencimiento || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear la receta' });
    res.status(201).json({ receta_id: this.lastID });
  });
});

// POST /api/v1/pacientes/{id}/orden-lab - Create lab order for patient
app.post('/api/v1/pacientes/:id/orden-lab', (req, res) => {
  const { id } = req.params;
  const { tipo_examen, descripcion, instrucciones, fecha_requerida } = req.body;
  
  if (!tipo_examen || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Ordenes_Laboratorio (paciente_id, tipo_examen, descripcion, instrucciones, fecha_requerida, fecha_creacion, estado)
    VALUES (?, ?, ?, ?, ?, datetime('now'), 'pendiente')
  `;
  
  db.run(insert, [id, tipo_examen, descripcion, instrucciones || null, fecha_requerida || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear la orden de laboratorio' });
    res.status(201).json({ orden_lab_id: this.lastID });
  });
});

// ==================== HISTORIAS CLÍNICAS ENDPOINTS ====================

// GET /api/v1/historias-clinicas/{id}/epidemiologico - Epidemiological dashboard
app.get('/api/v1/historias-clinicas/:id/epidemiologico', (req, res) => {
  const { id } = req.params;
  const { fecha_desde, fecha_hasta } = req.query;
  
  let query = `
    SELECT 
      COUNT(DISTINCT p.paciente_id) as total_pacientes,
      COUNT(DISTINCT f.familia_id) as total_familias,
      COUNT(DISTINCT hc.historia_clinica_id) as total_consultas,
      COUNT(DISTINCT CASE WHEN hc.tipo_consulta = 'control' THEN hc.historia_clinica_id END) as consultas_control,
      COUNT(DISTINCT CASE WHEN hc.tipo_consulta = 'urgencia' THEN hc.historia_clinica_id END) as consultas_urgencia
    FROM Pacientes p
    LEFT JOIN Familias f ON p.familia_id = f.familia_id
    LEFT JOIN Historias_Clinicas hc ON p.paciente_id = hc.paciente_id
    WHERE p.activo = 1
  `;
  
  const params = [];
  if (fecha_desde) {
    query += ' AND hc.fecha_consulta >= ?';
    params.push(fecha_desde);
  }
  if (fecha_hasta) {
    query += ' AND hc.fecha_consulta <= ?';
    params.push(fecha_hasta);
  }
  
  db.get(query, params, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// ==================== REPORTES ENDPOINTS ====================

// GET /api/v1/reportes/productividad - Productivity report
app.get('/api/v1/reportes/productividad', (req, res) => {
  const { usuario_id, fecha_desde, fecha_hasta } = req.query;
  
  let query = `
    SELECT 
      u.usuario_id, u.nombre_completo, u.nombre_rol,
      COUNT(DISTINCT hc.historia_clinica_id) as total_consultas,
      COUNT(DISTINCT b.bitacora_id) as total_bitacoras,
      COUNT(DISTINCT r.receta_id) as total_recetas
    FROM Usuarios u
    LEFT JOIN Historias_Clinicas hc ON u.usuario_id = hc.profesional_id
    LEFT JOIN Bitacoras b ON u.usuario_id = b.usuario_id
    LEFT JOIN Recetas r ON u.usuario_id = r.profesional_id
    WHERE u.activo = 1
  `;
  
  const params = [];
  if (usuario_id) {
    query += ' AND u.usuario_id = ?';
    params.push(usuario_id);
  }
  if (fecha_desde) {
    query += ' AND (hc.fecha_consulta >= ? OR b.fecha_registro >= ? OR r.fecha_emision >= ?)';
    params.push(fecha_desde, fecha_desde, fecha_desde);
  }
  if (fecha_hasta) {
    query += ' AND (hc.fecha_consulta <= ? OR b.fecha_registro <= ? OR r.fecha_emision <= ?)';
    params.push(fecha_hasta, fecha_hasta, fecha_hasta);
  }
  
  query += ' GROUP BY u.usuario_id, u.nombre_completo, u.nombre_rol ORDER BY total_consultas DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ==================== CARACTERIZACIONES ENDPOINTS ====================

// PUT /api/v1/caracterizaciones/{id} - Update characterization
app.put('/api/v1/caracterizaciones/:id', (req, res) => {
  const { id } = req.params;
  const { tipo_vivienda, material_paredes, material_piso, servicios_publicos, numero_habitaciones, numero_personas, ingresos_mensuales, observaciones } = req.body;
  
  const update = `
    UPDATE Caracterizaciones SET
      tipo_vivienda = COALESCE(?, tipo_vivienda),
      material_paredes = COALESCE(?, material_paredes),
      material_piso = COALESCE(?, material_piso),
      servicios_publicos = COALESCE(?, servicios_publicos),
      numero_habitaciones = COALESCE(?, numero_habitaciones),
      numero_personas = COALESCE(?, numero_personas),
      ingresos_mensuales = COALESCE(?, ingresos_mensuales),
      observaciones = COALESCE(?, observaciones)
    WHERE caracterizacion_id = ?
  `;
  
  const params = [
    tipo_vivienda === undefined ? null : tipo_vivienda,
    material_paredes === undefined ? null : material_paredes,
    material_piso === undefined ? null : material_piso,
    servicios_publicos === undefined ? null : servicios_publicos,
    numero_habitaciones === undefined ? null : numero_habitaciones,
    numero_personas === undefined ? null : numero_personas,
    ingresos_mensuales === undefined ? null : ingresos_mensuales,
    observaciones === undefined ? null : observaciones,
    id
  ];
  
  db.run(update, params, function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo actualizar la caracterización' });
    if (this.changes === 0) return res.status(404).json({ error: 'Caracterización no encontrada' });
    res.json({ caracterizacion_id: id });
  });
});

// ==================== PLANES DE CUIDADO ENDPOINTS ====================

// POST /api/v1/planes-cuidado/{id}/demanda - Create demand for care plan
app.post('/api/v1/planes-cuidado/:id/demanda', (req, res) => {
  const { id } = req.params;
  const { tipo_demanda, descripcion, prioridad, fecha_limite } = req.body;
  
  if (!tipo_demanda || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Demandas (plan_cuidado_id, tipo_demanda, descripcion, prioridad, fecha_limite, fecha_creacion, activa)
    VALUES (?, ?, ?, ?, ?, datetime('now'), 1)
  `;
  
  db.run(insert, [id, tipo_demanda, descripcion, prioridad || 'media', fecha_limite || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear la demanda' });
    res.status(201).json({ demanda_id: this.lastID });
  });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de Salud Digital APS funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint funcionando',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${dbPath}`);
  console.log(`🔗 API v1 disponible en: http://localhost:${PORT}/api/v1`);
});
