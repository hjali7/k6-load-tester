import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

let urls = [];

if (__ENV.URLS) {
  urls = JSON.parse(__ENV.URLS);
} else if (__ENV.CSV_PATH) {
  urls = new SharedArray('urls', function() {
    return open(__ENV.CSV_PATH).split('\n').map(row => row.trim()).filter(Boolean);
  });
} else if (__ENV.JSON_PATH) {
  urls = new SharedArray('urls', function() {
    return JSON.parse(open(__ENV.JSON_PATH));
  });
} else if (__ENV.TARGET_URL) {
  urls = [__ENV.TARGET_URL];
} else {
  urls = ['https://httpbin.org/get'];
}

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
  let url = urls[Math.floor(Math.random() * urls.length)];

  let params = { headers: HEADERS };
  let res;
  if (METHOD === 'GET') {
    res = http.get(url, params);
  } else if (METHOD === 'POST') {
    res = http.post(url, BODY, params);
  } else {
    res = http.request(METHOD, url, BODY, params);
  }

  check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    'no error': (r) => !r.error,
  });

  sleep(SLEEP);
}
