module.exports = {
  apps: [
    {
      name: 'etf-api',
      cwd: '/opt/etf-agent/current/apps/api',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        API_HOST: '127.0.0.1',
        API_PORT: '8000',
        ALLOW_RUNTIME_MODEL_CONFIG: 'true',
        DEMO_FALLBACK_ENABLED: 'false',
        LLM_REQUEST_TIMEOUT_MS: '180000',
        CORS_ORIGIN: '*',
      },
      max_memory_restart: '512M',
      error_file: '/opt/etf-agent/logs/api-error.log',
      out_file: '/opt/etf-agent/logs/api-out.log',
      time: true,
    },
  ],
};
