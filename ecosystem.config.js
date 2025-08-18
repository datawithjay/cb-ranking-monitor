module.exports = {
  apps: [{
    name: 'coinbase-scheduler',
    script: 'scripts/scheduler.js',
    cwd: '/Users/jasoncassera/Cursor Projects/Crptools/CB Ranking',
    interpreter: 'node',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/scheduler-error.log',
    out_file: './logs/scheduler-out.log',
    log_file: './logs/scheduler-combined.log',
    time: true
  }]
}
