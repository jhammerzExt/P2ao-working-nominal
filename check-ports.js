
import net from 'net';

const ports = [8080, 3000, 3080, 24678, 5173];

async function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve({ port, status: 'in use' });
      } else {
        resolve({ port, status: 'error: ' + err.code });
      }
    });
    server.once('listening', () => {
      server.close();
      resolve({ port, status: 'free' });
    });
    server.listen(port, '0.0.0.0');
  });
}

async function main() {
  console.log('Checking ports...');
  for (const port of ports) {
    const res = await checkPort(port);
    console.log(`Port ${res.port}: ${res.status}`);
  }
}

main();
