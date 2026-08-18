const https = require('https');
const data = JSON.stringify({
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  password: 'Password1!',
  rePassword: 'Password1!'
});
const options = {
  hostname: 'route-posts.routemisr.com',
  path: '/users/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('body', body);
  });
});
req.on('error', e => console.error('error', e.message));
req.write(data);
req.end();
