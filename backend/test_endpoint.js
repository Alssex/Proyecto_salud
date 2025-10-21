const http = require('http');

console.log('🧪 Probando endpoint de demandas asignadas...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/usuarios/5/demandas-asignadas',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);
  console.log(`📡 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📋 Respuesta del servidor:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('Respuesta raw:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error en la petición:', e.message);
  console.log('💡 Asegúrate de que el servidor esté corriendo en el puerto 3001');
});

req.setTimeout(5000, () => {
  console.error('❌ Timeout - el servidor no responde');
  req.destroy();
});

req.end();
