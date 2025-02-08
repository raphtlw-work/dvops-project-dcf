import winston from "winston"
import LokiTransport from "winston-loki"

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new LokiTransport({
      host: "https://logs-prod-020.grafana.net",
      labels: { app: "dvops" },
      json: true,
      basicAuth: `1123599:${process.env.GRAFANA_LOKI_TOKEN}`,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
      level: "debug",
    }),
  ],
})
