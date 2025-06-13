import http from 'k6/http';
import { check, sleep } from 'k6';

export function runScenario(config, results) {
  let req = config.requests[Math.floor(Math.random() * config.requests.length)];
  let params = { headers: req.headers || {} };
  let res = http.request(req.method, req.url, req.body, params);

  check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'no error': (r) => !r.error,
  });

  results.push({
    url: req.url,
    method: req.method,
    status: res.status,
    duration: res.timings.duration,
    timestamp: Date.now()
  });

  sleep(config.sleep);
}
