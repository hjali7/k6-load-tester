import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'result.json': JSON.stringify(data, null, 2),
    'result.html': textSummary(data, { indent: ' ', enableColors: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  }
}
