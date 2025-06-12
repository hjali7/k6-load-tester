# Web Load Tester

A modular, production-grade load testing tool for Kubernetes, packed as a Helm Chart.

## K6 Script

- Supports GET and POST out of the box (others easily addable)
- All config passed via environment variables for Helm/Docker/CI
- Configurable: TARGET_URL, VUS, DURATION, METHOD, HEADERS, BODY, SLEEP
- Easily extensible for future needs

#### Example run (local):

```bash
docker run --rm \
  -e TARGET_URL=https://httpbin.org/post \
  -e VUS=20 \
  -e DURATION=1m \
  -e METHOD=POST \
  -e HEADERS='{"Content-Type":"application/json"}' \
  -e BODY='{"user":"test"}' \
  -e SLEEP=0.5 \
  web-load-tester:latest
