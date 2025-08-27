module.exports = {
  apps: [
    {
      name: 'resume-rank-ai-web',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 9002,
      },
    },
    {
      name: 'resume-rank-ai-genkit',
      script: 'npm',
      args: 'run genkit:start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
