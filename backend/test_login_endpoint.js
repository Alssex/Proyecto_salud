const http = require('http');

console.log('🧪 Probando endpoint de login...');

const postData = JSON.stringify({
  email: 'medico1@saludigital.edu.co',
  password: '1000000001'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
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

req.write(postData);
req.end();
