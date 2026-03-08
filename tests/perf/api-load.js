import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.API_URL || 'http://localhost:3000/api';

export const options = {
  scenarios: {
    normal_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      exec: 'normalLoad'
    },
    spike_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 40 },
        { duration: '10s', target: 10 }
      ],
      exec: 'spikeLoad'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<500']
  }
};

export function normalLoad() {
  const list = http.get(`${baseUrl}/parcels`);
  check(list, {
    'list parcels status is 200': (r) => r.status === 200
  });

  const details = http.get(`${baseUrl}/parcels/1`);
  check(details, {
    'parcel details status is 200': (r) => r.status === 200
  });

  sleep(1);
}

export function spikeLoad() {
  const payload = JSON.stringify({
    name: `Perf Parcel ${Math.random().toString(36).slice(2, 8)}`,
    areaHectares: 1.2,
    location: 'Perf Zone'
  });

  const create = http.post(`${baseUrl}/parcels`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });

  check(create, {
    'create parcel status is 201': (r) => r.status === 201
  });

  sleep(0.5);
}
