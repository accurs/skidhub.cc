module.exports = {
  apps: [{
    name: 'skidhub',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    node_args: '--experimental-specifier-resolution=node'
  }]
} 