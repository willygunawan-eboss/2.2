module.exports = {
  apps: [
    {
      name: "ichangeboss-erp",
      script: "dist/server.cjs",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3010
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true
    }
  ]
};
