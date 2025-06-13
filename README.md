```markdown
# Web Load Tester Helm Chart

A modular, production-grade load testing tool for Kubernetes, powered by [k6](https://k6.io/) and packaged as a Helm chart.

This chart allows you to easily deploy and manage k6 load testing jobs in your Kubernetes cluster.

## Features

- **Declarative Load Tests:** Define your load tests as Kubernetes resources.
- **Configurable:** Easily configure test parameters like target URL, virtual users (VUs), duration, HTTP method, headers, and body.
- **Multiple URL Inputs:** Provide a single target URL, a list of URLs, or paths to CSV/JSON files containing URLs.
- **Resource Management:** Define Kubernetes resource requests and limits for your test pods.
- **Persistence:** Optionally persist k6 test results using a PersistentVolumeClaim.
- **Thresholds:** Define performance thresholds for your tests directly in the configuration.
- **Extensible:** Based on k6, allowing for custom scripting if needed (though this chart focuses on declarative configuration).

## Prerequisites

- Kubernetes cluster (version 1.19+ recommended)
- Helm (version 3.0+) installed and configured to manage your cluster.
- (Optional) A provisioner for PersistentVolumeClaims if you want to store test results.

## Installation

1.  **Add Helm Repository (if applicable)**

    If the chart is hosted in a Helm repository, add it first:
    ```bash
    helm repo add <repo_name> <repo_url>
    helm repo update
    ```
    *(Note: Replace `<repo_name>` and `<repo_url>` with actual values once the chart is published. For now, you can install from a local path.)*

2.  **Install the Chart**

    To install the chart with the release name `my-load-test`:

    From a local path (e.g., if you've cloned this repository):
    ```bash
    helm install my-load-test ./charts/web-load-tester
    ```

    From a repository (once published):
    ```bash
    helm install my-load-test <repo_name>/web-load-tester
    ```

    You can customize the installation by providing your own `values.yaml` file or by specifying values on the command line:
    ```bash
    helm install my-load-test ./charts/web-load-tester -f my-custom-values.yaml --set config.targetUrl="https://my.api.com/test"
    ```

## Usage

Once the chart is installed, a Kubernetes Job will be created (if `replicaCount` > 0 or if not using a Deployment model directly - the current chart uses a Deployment, so this will create a Deployment running k6). The k6 load test will start executing based on the provided configuration.

### Viewing Logs

You can view the logs of the k6 test pod to see the progress and results in real-time:

```bash
kubectl logs -f $(kubectl get pods -l app.kubernetes.io/name=web-load-tester,app.kubernetes.io/instance=my-load-test -o jsonpath='{.items[0].metadata.name}')
```
*(Adjust `my-load-test` if you used a different release name)*

### Test Results

If persistence is enabled (`persistence.enabled: true`), k6 will write its output to a file (e.g., `result.html`, `result.json` depending on k6 script configuration) in the PersistentVolume. You can then access this volume to retrieve the full results.

The k6 script within this chart is typically configured to output a summary to stdout (viewable in logs) and may also be configured for other outputs like JSON or a report file if persistence is used.

## Configuration

The following table lists the configurable parameters of the `web-load-tester` chart and their default values. These are found in `values.yaml`.

| Parameter                      | Description                                                                 | Default Value                               |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------- |
| `replicaCount`                 | Number of k6 test pods (currently configured as a Deployment)               | `1`                                         |
| `image.repository`             | Docker image repository for the k6 load tester                              | `k6-load-tester`                            |
| `image.tag`                    | Docker image tag                                                            | `latest`                                    |
| `image.pullPolicy`             | Image pull policy                                                           | `IfNotPresent`                              |
| `config.targetUrl`             | Single target URL for the load test if not using `urls`, `csvPath`, or `jsonPath`. | `"https://httpbin.org/post"`                |
| `config.urls`                  | Array of URLs to test.                                                      | `[]`                                        |
| `config.csvPath`               | Path inside the container to a CSV file containing URLs to test.            | `""`                                        |
| `config.jsonPath`              | Path inside the container to a JSON file containing URLs to test.           | `""`                                        |
| `config.virtualUsers`          | Number of virtual users (VUs) to simulate.                                  | `20`                                        |
| `config.duration`              | Duration of the test (e.g., "1m", "30s", "1h30m").                          | `"1m"`                                      |
| `config.method`                | HTTP method for the requests.                                               | `"POST"`                                    |
| `config.headers`               | JSON string of HTTP headers to include in requests.                         | `'{"Content-Type":"application/json"}'`     |
| `config.body`                  | JSON string of the HTTP request body.                                       | `'{"user":"test"}'`                         |
| `config.sleep`                 | Time in seconds to sleep between iterations for a VU.                       | `0.5`                                       |
| `config.thresholds.http_req_duration` | k6 thresholds for request duration (e.g., `["p(95)<500"]`).           | `["p(95)<500"]`                             |
| `config.thresholds.http_req_failed`   | k6 thresholds for failed request rate (e.g., `["rate<0.01"]`).        | `["rate<0.01"]`                             |
| `resources.limits.cpu`         | CPU resource limit for the k6 pod.                                          | `1000m`                                     |
| `resources.limits.memory`      | Memory resource limit for the k6 pod.                                       | `1Gi`                                       |
| `resources.requests.cpu`       | CPU resource request for the k6 pod.                                        | `500m`                                      |
| `resources.requests.memory`    | Memory resource request for the k6 pod.                                     | `512Mi`                                     |
| `nodeSelector`                 | Node selector constraints for pod assignment.                               | `{}`                                        |
| `tolerations`                  | Tolerations for pod assignment.                                             | `[]`                                        |
| `affinity`                     | Affinity constraints for pod assignment.                                    | `{}`                                        |
| `persistence.enabled`          | Enable persistence for test results using a PVC.                            | `false`                                     |
| `persistence.storageClass`     | StorageClass for the PVC. If empty or `""`, default provisioner is used.  | `""`                                        |
| `persistence.size`             | Size of the PVC (e.g., "1Gi", "100Mi").                                     | `1Gi`                                       |
| `persistence.accessMode`       | Access mode for the PVC (e.g., `ReadWriteOnce`).                            | `ReadWriteOnce`                             |

Refer to the `values.yaml` file for the most up-to-date list of configurable options.

### Example: Running a GET test for 10 VUs for 30 seconds

```bash
helm install my-get-test ./charts/web-load-tester \
  --set config.targetUrl="https://httpbin.org/get" \
  --set config.method="GET" \
  --set config.virtualUsers=10 \
  --set config.duration="30s" \
  --set config.body="{}" # Empty body for GET
```

## Contributing

Contributions are welcome! If you have improvements, new features, or bug fixes, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/my-awesome-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add some awesome feature'`).
5.  Push to the branch (`git push origin feature/my-awesome-feature`).
6.  Create a new Pull Request.

Please ensure your code adheres to existing styles and that any new features are appropriately documented.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
