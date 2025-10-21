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
console.log('📊 Base de datos: ', dbPath);
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
      r.nombre_rol, r.rol_id
    FROM Usuarios u 
    JOIN Roles r ON u.rol_id = r.rol_id 
    WHERE u.email = ?
  `;
  
  db.get(query, [email], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
    
    // Verificar contraseña simple (temporal)
    if (password !== row.numero_documento) {
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
        team: null,
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

// ==================== ENDPOINTS DE CARACTERIZACIÓN ====================

// Crear/actualizar caracterización completa de familia
app.post('/api/caracterizaciones', (req, res) => {
  const { familia_id, datos_familia, integrantes } = req.body;
  
  if (!familia_id || !datos_familia) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: familia_id, datos_familia'
    });
  }

  console.log('Creando caracterización para familia:', familia_id);

  // Iniciar transacción
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // 1. Actualizar tabla Familias con datos de caracterización
    const updateFamilia = `
      UPDATE Familias SET
        numero_ficha = ?,
        zona = ?,
        territorio = ?,
        estrato = ?,
        tipo_familia = ?,
        riesgo_familiar = ?,
        fecha_caracterizacion = ?,
        info_vivienda = ?,
        situaciones_proteccion = ?,
        condiciones_salud_publica = ?,
        practicas_cuidado = ?
      WHERE familia_id = ?
    `;
    
    const paramsFamilia = [
      datos_familia.numero_ficha || null,
      datos_familia.zona || null,
      datos_familia.territorio || null,
      datos_familia.estrato || null,
      datos_familia.tipo_familia || null,
      datos_familia.riesgo_familiar || null,
      datos_familia.fecha_caracterizacion || null,
      JSON.stringify(datos_familia.info_vivienda || {}),
      JSON.stringify(datos_familia.situaciones_proteccion || []),
      JSON.stringify(datos_familia.condiciones_salud_publica || []),
      JSON.stringify(datos_familia.practicas_cuidado || {}),
      familia_id
    ];
    
    db.run(updateFamilia, paramsFamilia, function(err) {
      if (err) {
        console.error('Error actualizando familia:', err);
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Error actualizando datos de familia' });
      }
      
      console.log('Familia actualizada, filas afectadas:', this.changes);
      
      // 2. Eliminar caracterizaciones existentes de pacientes de esta familia
      db.run('DELETE FROM Caracterizacion_Paciente WHERE paciente_id IN (SELECT paciente_id FROM Pacientes WHERE familia_id = ?)', 
        [familia_id], function(err) {
        if (err) {
          console.error('Error eliminando caracterizaciones existentes:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Error limpiando caracterizaciones previas' });
        }
        
        console.log('Caracterizaciones previas eliminadas:', this.changes);
        
        // 3. Insertar nuevas caracterizaciones de pacientes
        if (integrantes && integrantes.length > 0) {
          const insertPaciente = `
            INSERT INTO Caracterizacion_Paciente (
              paciente_id, fecha_caracterizacion, rol_familiar, ocupacion,
              nivel_educativo, grupo_poblacional, regimen_afiliacion,
              pertenencia_etnica, discapacidad, victima_violencia,
              datos_pyp, datos_salud, creado_por_uid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          let completed = 0;
          let errors = 0;
          
          integrantes.forEach((integrante, index) => {
            const paramsPaciente = [
              integrante.paciente_id,
              integrante.fecha_caracterizacion || datos_familia.fecha_caracterizacion || new Date().toISOString().split('T')[0],
              integrante.rol_familiar || null,
              integrante.ocupacion || null,
              integrante.nivel_educativo || null,
              integrante.grupo_poblacional || null,
              integrante.regimen_afiliacion || null,
              integrante.pertenencia_etnica || null,
              JSON.stringify(integrante.discapacidad || []),
              integrante.victima_violencia || false,
              JSON.stringify(integrante.datos_pyp || {}),
              JSON.stringify(integrante.datos_salud || {}),
              integrante.creado_por_uid || null
            ];
            
            db.run(insertPaciente, paramsPaciente, function(err) {
              if (err) {
                console.error(`Error insertando caracterización paciente ${index}:`, err);
                errors++;
              } else {
                console.log(`Caracterización paciente ${index} insertada:`, this.lastID);
              }
              
              completed++;
              
              if (completed === integrantes.length) {
                if (errors > 0) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: `Error en ${errors} caracterizaciones de pacientes` });
                }
                
                // Commit transacción
                db.run('COMMIT', (err) => {
                  if (err) {
                    console.error('Error en commit:', err);
                    return res.status(500).json({ error: 'Error confirmando transacción' });
                  }
                  
                  console.log('✅ Caracterización completada exitosamente');
                  res.status(201).json({
                    success: true,
                    message: 'Caracterización creada exitosamente',
                    familia_id: familia_id,
                    integrantes_procesados: integrantes.length
                  });
                });
              }
            });
          });
        } else {
          // No hay integrantes, solo commit
          db.run('COMMIT', (err) => {
            if (err) {
              console.error('Error en commit:', err);
              return res.status(500).json({ error: 'Error confirmando transacción' });
            }
            
            console.log('✅ Caracterización de familia completada exitosamente');
            res.status(201).json({
              success: true,
              message: 'Caracterización de familia creada exitosamente',
              familia_id: familia_id
            });
          });
        }
      });
    });
  });
});

// Obtener caracterización de una familia
app.get('/api/familias/:id/caracterizacion', (req, res) => {
  const { id } = req.params;
  
  // 1. Obtener datos de caracterización de la familia
  const queryFamilia = `
    SELECT 
      f.*,
      u.nombre_completo as creado_por_nombre
    FROM Familias f
    LEFT JOIN Usuarios u ON f.creado_por_uid = u.usuario_id
    WHERE f.familia_id = ?
  `;
  
  db.get(queryFamilia, [id], (err, familia) => {
    if (err) {
      console.error('Error obteniendo familia:', err);
      return res.status(500).json({ error: 'Error obteniendo datos de familia' });
    }
    
    if (!familia) {
      return res.status(404).json({ error: 'Familia no encontrada' });
    }
    
    // 2. Obtener caracterizaciones de los pacientes
    const queryPacientes = `
      SELECT 
        p.paciente_id,
        p.numero_documento,
        p.tipo_documento,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        p.fecha_nacimiento,
        p.genero,
        cp.*
      FROM Pacientes p
      LEFT JOIN Caracterizacion_Paciente cp ON p.paciente_id = cp.paciente_id
      WHERE p.familia_id = ? AND p.activo = 1
      ORDER BY p.primer_nombre
    `;
    
    db.all(queryPacientes, [id], (err, pacientes) => {
      if (err) {
        console.error('Error obteniendo pacientes:', err);
        return res.status(500).json({ error: 'Error obteniendo datos de pacientes' });
      }
      
      // Procesar datos JSON
      const familiaProcesada = {
        ...familia,
        info_vivienda: familia.info_vivienda ? JSON.parse(familia.info_vivienda) : {},
        situaciones_proteccion: familia.situaciones_proteccion ? JSON.parse(familia.situaciones_proteccion) : [],
        condiciones_salud_publica: familia.condiciones_salud_publica ? JSON.parse(familia.condiciones_salud_publica) : [],
        practicas_cuidado: familia.practicas_cuidado ? JSON.parse(familia.practicas_cuidado) : {}
      };
      
      const pacientesProcesados = pacientes.map(p => ({
        ...p,
        discapacidad: p.discapacidad ? JSON.parse(p.discapacidad) : [],
        datos_pyp: p.datos_pyp ? JSON.parse(p.datos_pyp) : {},
        datos_salud: p.datos_salud ? JSON.parse(p.datos_salud) : {}
      }));
      
      res.json({
        familia: familiaProcesada,
        integrantes: pacientesProcesados,
        tiene_caracterizacion: !!familia.fecha_caracterizacion
      });
    });
  });
});

// ==================== ENDPOINTS DE PLANES DE CUIDADO ====================

// Obtener planes de cuidado por paciente
app.get('/api/pacientes/:id/planes-cuidado', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      pcf.*,
      u1.nombre_completo as creado_por_nombre,
      f.apellido_principal,
      p.primer_nombre,
      p.primer_apellido
    FROM Planes_Cuidado_Familiar pcf
    LEFT JOIN Usuarios u1 ON pcf.creado_por_uid = u1.usuario_id
    LEFT JOIN Familias f ON pcf.familia_id = f.familia_id
    LEFT JOIN Pacientes p ON pcf.paciente_principal_id = p.paciente_id
    WHERE pcf.paciente_principal_id = ?
    ORDER BY pcf.fecha_entrega DESC
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error('Error obteniendo planes de cuidado:', err);
      return res.status(500).json({ error: 'Error obteniendo planes de cuidado' });
    }
    
    // Procesar campos JSON
    const planesProcesados = rows.map(plan => ({
      ...plan,
      plan_asociado: plan.plan_asociado ? JSON.parse(plan.plan_asociado) : []
    }));
    
    res.json(planesProcesados);
  });
});

// Crear nuevo plan de cuidado
app.post('/api/planes-cuidado', (req, res) => {
  const {
    familia_id,
    paciente_principal_id,
    fecha_entrega,
    plan_asociado,
    condicion_identificada,
    logro_salud,
    cuidados_salud,
    demandas_inducidas_desc,
    educacion_salud,
    estado,
    creado_por_uid,
    fecha_aceptacion
  } = req.body;
  
  if (!familia_id || !paciente_principal_id || !fecha_entrega || !creado_por_uid) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: familia_id, paciente_principal_id, fecha_entrega, creado_por_uid'
    });
  }
  
  const insert = `
    INSERT INTO Planes_Cuidado_Familiar (
      familia_id, paciente_principal_id, fecha_entrega, plan_asociado,
      condicion_identificada, logro_salud, cuidados_salud, demandas_inducidas_desc,
      educacion_salud, estado, creado_por_uid, fecha_aceptacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    familia_id,
    paciente_principal_id,
    fecha_entrega,
    JSON.stringify(plan_asociado || []),
    condicion_identificada || null,
    logro_salud || null,
    cuidados_salud || null,
    demandas_inducidas_desc || null,
    educacion_salud || null,
    estado || 'Activo',
    creado_por_uid,
    fecha_aceptacion || null
  ];
  
  db.run(insert, params, function(err) {
    if (err) {
      console.error('Error creando plan de cuidado:', err);
      return res.status(500).json({ error: 'Error creando plan de cuidado' });
    }
    
    res.status(201).json({
      success: true,
      plan_id: this.lastID,
      message: 'Plan de cuidado creado exitosamente'
    });
  });
});

// ==================== ENDPOINTS DE DEMANDAS INDUCIDAS ====================

// Obtener demandas por paciente
app.get('/api/pacientes/:id/demandas-inducidas', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      di.*,
      pcf.condicion_identificada,
      u1.nombre_completo as solicitado_por_nombre,
      u2.nombre_completo as asignado_a_nombre
    FROM Demandas_Inducidas di
    LEFT JOIN Planes_Cuidado_Familiar pcf ON di.plan_id = pcf.plan_id
    LEFT JOIN Usuarios u1 ON di.solicitado_por_uid = u1.usuario_id
    LEFT JOIN Usuarios u2 ON di.asignado_a_uid = u2.usuario_id
    WHERE di.paciente_id = ?
    ORDER BY di.fecha_demanda DESC
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error('Error obteniendo demandas inducidas:', err);
      return res.status(500).json({ error: 'Error obteniendo demandas inducidas' });
    }
    
    // Procesar campos JSON
    const demandasProcesadas = rows.map(demanda => ({
      ...demanda,
      diligenciamiento: demanda.diligenciamiento ? JSON.parse(demanda.diligenciamiento) : [],
      remision_a: demanda.remision_a ? JSON.parse(demanda.remision_a) : [],
      seguimiento: demanda.seguimiento ? JSON.parse(demanda.seguimiento) : {}
    }));
    
    res.json(demandasProcesadas);
  });
});

// Crear nueva demanda inducida
app.post('/api/demandas-inducidas', (req, res) => {
  const {
    numero_formulario,
    paciente_id,
    plan_id,
    fecha_demanda,
    diligenciamiento,
    remision_a,
    estado,
    asignado_a_uid,
    solicitado_por_uid,
    seguimiento
  } = req.body;
  
  if (!paciente_id || !fecha_demanda || !solicitado_por_uid) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: paciente_id, fecha_demanda, solicitado_por_uid'
    });
  }
  
  const insert = `
    INSERT INTO Demandas_Inducidas (
      numero_formulario, paciente_id, plan_id, fecha_demanda, diligenciamiento,
      remision_a, estado, asignado_a_uid, solicitado_por_uid, seguimiento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    numero_formulario || null,
    paciente_id,
    plan_id || null,
    fecha_demanda,
    JSON.stringify(diligenciamiento || []),
    JSON.stringify(remision_a || []),
    estado || 'Pendiente',
    asignado_a_uid || null,
    solicitado_por_uid,
    JSON.stringify(seguimiento || {})
  ];
  
  db.run(insert, params, function(err) {
    if (err) {
      console.error('Error creando demanda inducida:', err);
      return res.status(500).json({ error: 'Error creando demanda inducida' });
    }
    
    res.status(201).json({
      success: true,
      demanda_id: this.lastID,
      message: 'Demanda inducida creada exitosamente'
    });
  });
});

// Obtener demandas asignadas a un profesional - ENDPOINT TEMPORAL
app.get('/api/usuarios/:id/demandas-asignadas', (req, res) => {
  const { id } = req.params;
  
  console.log(`🔍 Obteniendo demandas para usuario ID: ${id}`);
  
  // Query para la estructura correcta de la base de datos
  const query = `
    SELECT 
      di.demanda_id,
      di.plan_id,
      di.tipo_demanda,
      di.descripcion,
      di.prioridad,
      di.fecha_creacion,
      di.fecha_limite,
      di.estado,
      di.paciente_id,
      di.fecha_asignacion,
      di.creado_por_uid,
      di.profesional_asignado,
      di.observaciones,
      p.primer_nombre,
      p.primer_apellido,
      p.numero_documento,
      f.apellido_principal
    FROM Demandas_Inducidas di
    JOIN Pacientes p ON di.paciente_id = p.paciente_id
    JOIN Familias f ON p.familia_id = f.familia_id
    WHERE di.profesional_asignado = ? AND di.estado IN ('Pendiente', 'Asignada')
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error('❌ Error en query:', err.message);
      return res.status(500).json({ error: 'Error obteniendo demandas asignadas', details: err.message });
    }
    
    console.log(`✅ Query exitoso: ${rows.length} demandas encontradas`);
    
    // Procesar campos JSON de forma segura
    const demandasProcesadas = rows.map(demanda => {
      try {
        return {
          ...demanda,
          diligenciamiento: demanda.diligenciamiento ? 
            (typeof demanda.diligenciamiento === 'string' ? JSON.parse(demanda.diligenciamiento) : demanda.diligenciamiento) : [],
          remision_a: demanda.remision_a ? 
            (typeof demanda.remision_a === 'string' ? JSON.parse(demanda.remision_a) : demanda.remision_a) : [],
          seguimiento: demanda.seguimiento ? 
            (typeof demanda.seguimiento === 'string' ? JSON.parse(demanda.seguimiento) : demanda.seguimiento) : {}
        };
      } catch (jsonErr) {
        console.error('Error parseando JSON:', jsonErr);
        return {
          ...demanda,
          diligenciamiento: [],
          remision_a: [],
          seguimiento: {}
        };
      }
    });
    
    console.log(`🎯 Devolviendo ${demandasProcesadas.length} demandas procesadas`);
    res.json(demandasProcesadas);
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

// Test endpoint simple
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint funcionando',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para verificar usuarios en la BD del servidor
app.get('/api/debug/users', (req, res) => {
  console.log('🔍 [DEBUG] Verificando usuarios en la BD del servidor...');
  
  db.all("SELECT * FROM Usuarios ORDER BY usuario_id", (err, usuarios) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Error consultando usuarios' });
    }
    
    console.log(`📋 [DEBUG] Usuarios encontrados: ${usuarios.length}`);
    usuarios.forEach(user => {
      console.log(`   - ID: ${user.usuario_id}, Nombre: ${user.nombre_completo}, Email: ${user.email}`);
    });
    
    res.json({
      message: 'Usuarios en la BD del servidor',
      count: usuarios.length,
      users: usuarios,
      dbPath: dbPath
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${dbPath}`);
});
