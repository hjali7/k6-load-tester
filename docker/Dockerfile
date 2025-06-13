FROM grafana/k6:0.45.0

# Add metadata labels
LABEL maintainer="Your Name <your.email@example.com>"
LABEL description="K6 load testing container"
LABEL version="1.0"

# Copy scripts
COPY scripts /scripts
WORKDIR /scripts

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD k6 version || exit 1

ENTRYPOINT ["k6", "run", "main.js"]
