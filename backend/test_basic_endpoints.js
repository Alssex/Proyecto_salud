const http = require('http');

console.log('🧪 Probando endpoints básicos...');

// Probar endpoint de test
const testReq = http.get('http://localhost:3001/api/test', (res) => {
  console.log(`📡 Test endpoint - Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📋 Respuesta test:', data);
    
    // Si el test funciona, probar health
    const healthReq = http.get('http://localhost:3001/api/health', (res) => {
      console.log(`📡 Health endpoint - Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📋 Respuesta health:', data);
      });
    });
    
    healthReq.on('error', (e) => {
      console.error('❌ Error en health endpoint:', e.message);
    });
  });
});

testReq.on('error', (e) => {
  console.error('❌ Error en test endpoint:', e.message);
  console.log('💡 El servidor no está corriendo o no responde');
});
