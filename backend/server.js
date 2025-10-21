// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a SQLite (usa la ruta correcta de tu BD)
const dbPath = path.join(__dirname, 'database', 'salud_digital_aps.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a SQLite:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

// ==================== ENDPOINTS DE AUTENTICACIÓN ====================

// Login de usuarios (mantener compatibilidad con /api/auth/login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  
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
    
    console.log('Login successful for:', row.nombre_completo);
    res.json({ 
      success: true, 
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

// Token/Login endpoint (nuevo formato)
app.post('/api/token', (req, res) => {
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

// ==================== ENDPOINTS DE DATOS ====================

// Obtener todas las familias (con conteo de integrantes)
app.get('/api/familias', (req, res) => {
  const query = `
    SELECT 
      f.familia_id, f.apellido_principal, f.direccion, 
      f.barrio_vereda, f.municipio, f.telefono_contacto,
      u.nombre_completo as creado_por,
      (
        SELECT COUNT(1) FROM Pacientes p
        WHERE p.familia_id = f.familia_id AND p.activo = 1
      ) AS integrantes_count
    FROM Familias f 
    JOIN Usuarios u ON f.creado_por_uid = u.usuario_id
    ORDER BY f.apellido_principal
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener una familia por id (con conteo de integrantes)
app.get('/api/familias/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      f.*, (
        SELECT COUNT(1) FROM Pacientes p
        WHERE p.familia_id = f.familia_id AND p.activo = 1
      ) AS integrantes_count
    FROM Familias f
    WHERE f.familia_id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) return res.status(404).json({ error: 'Familia no encontrada' });
    res.json(row);
  });
});

// Obtener pacientes por familia
app.get('/api/familias/:id/pacientes', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      paciente_id, numero_documento, tipo_documento,
      primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      fecha_nacimiento, genero, telefono, email
    FROM Pacientes 
    WHERE familia_id = ? AND activo = 1
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener un paciente por id
app.get('/api/pacientes/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      paciente_id, familia_id, numero_documento, tipo_documento,
      primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      fecha_nacimiento, genero, telefono, email, activo
    FROM Pacientes
    WHERE paciente_id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(row);
  });
});

// Crear un nuevo paciente vinculado a una familia
app.post('/api/pacientes', (req, res) => {
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
    db.get(
      `SELECT paciente_id, familia_id, numero_documento, tipo_documento,
              primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
              fecha_nacimiento, genero, telefono, email
       FROM Pacientes WHERE paciente_id = ?`,
      [createdId],
      (err2, row) => {
        if (err2) return res.status(201).json({ paciente_id: createdId, familia_id });
        res.status(201).json(row);
      }
    );
  });
});

// Actualizar un paciente por id
app.put('/api/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const {
    numero_documento,
    tipo_documento,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    fecha_nacimiento,
    genero,
    telefono,
    email,
    familia_id,
    activo
  } = req.body || {};

  const update = `
    UPDATE Pacientes SET
      familia_id = COALESCE(?, familia_id),
      numero_documento = COALESCE(?, numero_documento),
      tipo_documento = COALESCE(?, tipo_documento),
      primer_nombre = COALESCE(?, primer_nombre),
      segundo_nombre = COALESCE(?, segundo_nombre),
      primer_apellido = COALESCE(?, primer_apellido),
      segundo_apellido = COALESCE(?, segundo_apellido),
      fecha_nacimiento = COALESCE(?, fecha_nacimiento),
      genero = COALESCE(?, genero),
      telefono = COALESCE(?, telefono),
      email = COALESCE(?, email),
      activo = COALESCE(?, activo)
    WHERE paciente_id = ?
  `;

  const params = [
    familia_id ?? null,
    numero_documento ?? null,
    tipo_documento ?? null,
    primer_nombre ?? null,
    (segundo_nombre === undefined ? null : segundo_nombre),
    primer_apellido ?? null,
    (segundo_apellido === undefined ? null : segundo_apellido),
    (fecha_nacimiento === undefined ? null : fecha_nacimiento),
    (genero === undefined ? null : genero),
    (telefono === undefined ? null : telefono),
    (email === undefined ? null : email),
    (activo === undefined ? null : activo),
    id
  ];

  db.run(update, params, function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo actualizar el paciente' });
    if (this.changes === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
    db.get(
      `SELECT paciente_id, familia_id, numero_documento, tipo_documento,
              primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
              fecha_nacimiento, genero, telefono, email, activo
       FROM Pacientes WHERE paciente_id = ?`,
      [id],
      (err2, row) => {
        if (err2) return res.json({ paciente_id: Number(id) });
        res.json(row);
      }
    );
  });
});

// Eliminar (baja lógica) un paciente por id
app.delete('/api/pacientes/:id', (req, res) => {
  const { id } = req.params;

  const update = `UPDATE Pacientes SET activo = 0 WHERE paciente_id = ?`;

  db.run(update, [id], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo eliminar el paciente' });
    if (this.changes === 0) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.status(204).send();
  });
});

// Crear una nueva familia
app.post('/api/familias', (req, res) => {
  const {
    apellido_principal,
    direccion,
    barrio_vereda,
    municipio,
    telefono_contacto,
    creado_por_uid
  } = req.body || {};

  if (!apellido_principal || !direccion || !municipio || !creado_por_uid) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: apellido_principal, direccion, municipio, creado_por_uid'
    });
  }

  const insert = `
    INSERT INTO Familias (apellido_principal, direccion, barrio_vereda, municipio, telefono_contacto, creado_por_uid)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insert,
    [apellido_principal, direccion, barrio_vereda || null, municipio, telefono_contacto || null, creado_por_uid],
    function (err) {
      if (err) {
        console.error('Error insertando familia:', err);
        return res.status(500).json({ error: 'No se pudo crear la familia' });
      }
      const createdId = this.lastID;
      db.get(
        `SELECT f.*, (
            SELECT COUNT(1) FROM Pacientes p WHERE p.familia_id = f.familia_id AND p.activo = 1
          ) AS integrantes_count
         FROM Familias f WHERE f.familia_id = ?`,
        [createdId],
        (err2, row) => {
          if (err2) {
            return res.status(201).json({ familia_id: createdId });
          }
          res.status(201).json(row);
        }
      );
    }
  );
});

// Actualizar una familia por id
app.put('/api/familias/:id', (req, res) => {
  const { id } = req.params;
  const {
    apellido_principal,
    direccion,
    barrio_vereda,
    municipio,
    telefono_contacto
  } = req.body || {};

  const update = `
    UPDATE Familias SET
      apellido_principal = COALESCE(?, apellido_principal),
      direccion = COALESCE(?, direccion),
      barrio_vereda = COALESCE(?, barrio_vereda),
      municipio = COALESCE(?, municipio),
      telefono_contacto = COALESCE(?, telefono_contacto)
    WHERE familia_id = ?
  `;

  const params = [
    (apellido_principal === undefined ? null : apellido_principal),
    (direccion === undefined ? null : direccion),
    (barrio_vereda === undefined ? null : barrio_vereda),
    (municipio === undefined ? null : municipio),
    (telefono_contacto === undefined ? null : telefono_contacto),
    id
  ];

  db.run(update, params, function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo actualizar la familia' });
    if (this.changes === 0) return res.status(404).json({ error: 'Familia no encontrada' });
    db.get(
      `SELECT f.*, (
          SELECT COUNT(1) FROM Pacientes p WHERE p.familia_id = f.familia_id AND p.activo = 1
        ) AS integrantes_count
       FROM Familias f WHERE f.familia_id = ?`,
      [id],
      (err2, row) => {
        if (err2) return res.json({ familia_id: Number(id) });
        res.json(row);
      }
    );
  });
});

// Eliminar una familia por id (solo si no tiene pacientes activos)
app.delete('/api/familias/:id', (req, res) => {
  const { id } = req.params;

  const countPacientes = `SELECT COUNT(1) AS cnt FROM Pacientes WHERE familia_id = ? AND activo = 1`;
  db.get(countPacientes, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'No se pudo validar dependencias' });
    if (row && row.cnt > 0) return res.status(400).json({ error: 'No se puede eliminar: la familia tiene pacientes activos' });

    db.run(`DELETE FROM Familias WHERE familia_id = ?`, [id], function(err2) {
      if (err2) return res.status(500).json({ error: 'No se pudo eliminar la familia' });
      if (this.changes === 0) return res.status(404).json({ error: 'Familia no encontrada' });
      res.status(204).send();
    });
  });
});

// Obtener usuarios por rol
app.get('/api/usuarios/rol/:rol', (req, res) => {
  const { rol } = req.params;
  
  const query = `
    SELECT u.usuario_id, u.nombre_completo, u.email, u.telefono,
           e.nombre_equipo, e.zona_cobertura
    FROM Usuarios u
    JOIN Roles r ON u.rol_id = r.rol_id
    LEFT JOIN Equipos_Basicos e ON u.equipo_id = e.equipo_id
    WHERE r.nombre_rol = ? AND u.activo = 1
  `;
  
  db.all(query, [rol], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener usuario por id (con rol y equipo)
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      u.usuario_id, u.nombre_completo, u.email, u.numero_documento, u.telefono,
      r.nombre_rol, r.rol_id,
      e.nombre_equipo, e.equipo_id, e.zona_cobertura
    FROM Usuarios u
    JOIN Roles r ON u.rol_id = r.rol_id
    LEFT JOIN Equipos_Basicos e ON u.equipo_id = e.equipo_id
    WHERE u.usuario_id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(row);
  });
});

// Listar todos los usuarios
app.get('/api/usuarios', (req, res) => {
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

// Perfil del usuario actual (requiere autenticación)
app.get('/api/usuarios/me', (req, res) => {
  // En una implementación real, aquí validarías el token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  // Por simplicidad, asumimos que el token contiene el ID del usuario
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

// Listado de roles
app.get('/api/roles', (req, res) => {
  db.all(`SELECT rol_id, nombre_rol FROM Roles ORDER BY nombre_rol`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listado de equipos básicos
app.get('/api/equipos', (req, res) => {
  db.all(`SELECT equipo_id, nombre_equipo, zona_cobertura FROM Equipos_Basicos ORDER BY nombre_equipo`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar usuarios por equipo
app.get('/api/equipos/:id/usuarios', (req, res) => {
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

// ==================== ENDPOINTS DE DEMANDAS ====================

// Ver mis demandas asignadas
app.get('/api/demandas/asignadas', (req, res) => {
  // En una implementación real, aquí validarías el token y obtendrías el usuario actual
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

// Crear historia clínica para una demanda
app.post('/api/demandas/:id/historia-clinica', (req, res) => {
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

// ==================== ENDPOINTS DE BITÁCORAS ====================

// Registrar entrada en bitácora
app.post('/api/bitacoras', (req, res) => {
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

// Buscar entradas de bitácora
app.get('/api/bitacoras', (req, res) => {
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

// ==================== ENDPOINTS DE CARACTERIZACIONES ====================

// Crear caracterización para una familia
app.post('/api/familias/:id/caracterizacion', (req, res) => {
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

// Actualizar caracterización
app.put('/api/caracterizaciones/:id', (req, res) => {
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

// ==================== ENDPOINTS DE PLANES DE CUIDADO ====================

// Crear plan de cuidado para una familia
app.post('/api/familias/:id/plan-cuidado', (req, res) => {
  const { id } = req.params;
  const { objetivo, actividades, responsable, fecha_inicio, fecha_fin, observaciones } = req.body;
  
  if (!objetivo || !actividades) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Planes_Cuidado (familia_id, objetivo, actividades, responsable, fecha_inicio, fecha_fin, observaciones, fecha_creacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;
  
  db.run(insert, [id, objetivo, actividades, responsable || null, fecha_inicio || null, fecha_fin || null, observaciones || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear el plan de cuidado' });
    res.status(201).json({ plan_cuidado_id: this.lastID });
  });
});

// Crear demanda para un plan de cuidado
app.post('/api/planes-cuidado/:id/demanda', (req, res) => {
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

// ==================== ENDPOINTS DE HISTORIAS CLÍNICAS ====================

// Ver historial de historias clínicas de un paciente
app.get('/api/pacientes/:id/historias-clinicas', (req, res) => {
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

// Crear orden de laboratorio para una historia clínica
app.post('/api/historias-clinicas/:id/orden-lab', (req, res) => {
  const { id } = req.params;
  const { tipo_examen, descripcion, instrucciones, fecha_requerida } = req.body;
  
  if (!tipo_examen || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  
  const insert = `
    INSERT INTO Ordenes_Laboratorio (historia_clinica_id, tipo_examen, descripcion, instrucciones, fecha_requerida, fecha_creacion, estado)
    VALUES (?, ?, ?, ?, ?, datetime('now'), 'pendiente')
  `;
  
  db.run(insert, [id, tipo_examen, descripcion, instrucciones || null, fecha_requerida || null], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear la orden de laboratorio' });
    res.status(201).json({ orden_lab_id: this.lastID });
  });
});

// ==================== ENDPOINTS DE RECETAS ====================

// Crear receta para un paciente
app.post('/api/pacientes/:id/receta', (req, res) => {
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

// ==================== ENDPOINTS DE REPORTES ====================

// Dashboard epidemiológico
app.get('/api/reportes/epidemiologico', (req, res) => {
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

// Reporte de productividad
app.get('/api/reportes/productividad', (req, res) => {
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor de Salud Digital APS funcionando',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${dbPath}`);
});