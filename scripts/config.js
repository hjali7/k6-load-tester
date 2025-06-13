import { SharedArray } from 'k6/data';

export function getConfig() {
  let requests = [];
  if (__ENV.REQUESTS_JSON) {
    requests = JSON.parse(__ENV.REQUESTS_JSON);
  } else if (__ENV.REQUESTS_PATH) {
    requests = new SharedArray('requests', function() {
      return JSON.parse(open(__ENV.REQUESTS_PATH));
    });
  } else {
    requests = [{
      url: __ENV.TARGET_URL || 'https://httpbin.org/get',
      method: __ENV.METHOD || 'GET',
      headers: __ENV.HEADERS ? JSON.parse(__ENV.HEADERS) : {},
      body: __ENV.BODY || null
    }];
  }

  return {
    vus: Number(__ENV.VUS) || 10,
    duration: __ENV.DURATION || '30s',
    sleep: Number(__ENV.SLEEP) || 1,
    requests: requests
  }
}
