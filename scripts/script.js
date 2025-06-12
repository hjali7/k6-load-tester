import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET_URL = __ENV.TARGET_URL || 'https://httpbin.org/get';
const VUS = Number(__ENV.VUS) || 10;
const DURATION = __ENV.DURATION || '30s';
const METHOD = __ENV.METHOD || 'GET';
const HEADERS = __ENV.HEADERS ? JSON.parse(__ENV.HEADERS) : {};
const BODY = __ENV.BODY || null;
const SLEEP = Number(__ENV.SLEEP) || 1;

export let options = {
  vus: VUS,
  duration: DURATION,
};

export default function () {
  let params = { headers: HEADERS };
  let res;

  if (METHOD === 'GET') {
    res = http.get(TARGET_URL, params);
  } else if (METHOD === 'POST') {
    res = http.post(TARGET_URL, BODY, params);
  } else {
    res = http.request(METHOD, TARGET_URL, BODY, params);
  }

  check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'no error': (r) => !r.error,
  });

  sleep(SLEEP);
}
