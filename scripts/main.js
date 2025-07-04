import { getConfig } from './config.js';
import { runScenario } from './runner.js';
import { handleSummary as reportSummary } from './report.js';

let results = [];
let config = getConfig();

export let options = {
  vus: config.vus,
  duration: config.duration,
};

export default function () {
  runScenario(config, results);
}

export function handleSummary(data) {
  return reportSummary(data);
}
