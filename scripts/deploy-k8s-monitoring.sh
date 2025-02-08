#!/usr/bin/env bash

helm repo add grafana https://grafana.github.io/helm-charts &&
  helm repo update &&
  helm upgrade --install --version ^2 --atomic --timeout 300s grafana-k8s-monitoring grafana/k8s-monitoring \
    --namespace "default" --create-namespace --values - <<EOF
cluster:
  name: ""
destinations:
  - name: cc2304509i-prom
    type: prometheus
    url: https://prometheus-prod-37-prod-ap-southeast-1.grafana.net/api/prom/push
    auth:
      type: basic
      username: "2255843"
      password: <GRAFANA_CLOUD_TOKEN>
  - name: cc2304509i-logs
    type: loki
    url: https://logs-prod-020.grafana.net/loki/api/v1/push
    auth:
      type: basic
      username: "1123599"
      password: <GRAFANA_CLOUD_TOKEN>
  - name: cc2304509i-traces
    type: otlp
    url: https://tempo-prod-14-prod-ap-southeast-1.grafana.net:443
    protocol: grpc
    auth:
      type: basic
      username: "1117914"
      password: <GRAFANA_CLOUD_TOKEN>
    metrics:
      enabled: false
    logs:
      enabled: false
    traces:
      enabled: true
clusterMetrics:
  enabled: true
  opencost:
    enabled: true
    metricsSource: cc2304509i-prom
    opencost:
      exporter:
        defaultClusterId: ""
      prometheus:
        existingSecretName: cc2304509i-prom-grafana-k8s-monitoring
        external:
          url: https://prometheus-prod-37-prod-ap-southeast-1.grafana.net/api/prom
  node-exporter:
    deploy: false
    enabled: false
clusterEvents:
  enabled: true
podLogs:
  enabled: true
applicationObservability:
  enabled: true
  receivers:
    otlp:
      grpc:
        enabled: true
        port: 4317
      http:
        enabled: true
        port: 4318
    zipkin:
      enabled: true
      port: 9411
integrations:
  alloy:
    instances:
      - name: alloy
        labelSelectors:
          app.kubernetes.io/name:
            - alloy-metrics
            - alloy-singleton
            - alloy-logs
            - alloy-receiver
alloy-metrics:
  enabled: true
alloy-singleton:
  enabled: true
alloy-logs:
  enabled: true
  alloy:
    mounts:
      dockercontainers: false
alloy-receiver:
  enabled: true
  alloy:
    extraPorts:
      - name: otlp-grpc
        port: 4317
        targetPort: 4317
        protocol: TCP
      - name: otlp-http
        port: 4318
        targetPort: 4318
        protocol: TCP
      - name: zipkin
        port: 9411
        targetPort: 9411
        protocol: TCP
EOF
