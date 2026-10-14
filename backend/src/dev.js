// Local development entry: forces NODE_ENV=development
process.env.NODE_ENV = 'development';
await import('./server.js');
