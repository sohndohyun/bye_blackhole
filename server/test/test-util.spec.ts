import axios from 'axios';
const parseAxios = (v) => {
  const pars = {
    ...v,
    headers: '',
    config: '',
    request: { ClientRequest: '', socket: '', connection: '' },
  };
  if (v.request) console.log(v.request._header);
  console.log(pars);
  return v;
};
const testGetStatus = async (
  url: string,
  para: object,
  expectStatus: number,
) => {
  const result = await axios
    .get(url, para)
    .then((v) => v)
    .catch((reason) => reason.response);
  expect(result.status).toBe(expectStatus);
  if (result.data) return result.data.error;
  return 'OK';
};

const testPostStatus = async (
  url: string,
  body: object,
  expectStatus: number,
) => {
  const result = await axios
    .post(url, body)
    .then((v) => v)
    .catch((reason) => reason.response);
  expect(result.status).toBe(expectStatus);
  if (result.data) return result.data.error;
  return 'OK';
};

const testPutStatus = async (
  url: string,
  body: object,
  expectStatus: number,
) => {
  const result = await axios
    .put(url, body)
    .then((v) => v)
    .catch((reason) => reason.response);
  expect(result.status).toBe(expectStatus);
  if (result.data) return result.data.error;
  return 'OK';
};

const testPatchStatus = async (
  url: string,
  body: object,
  expectStatus: number,
) => {
  const result = await axios
    .patch(url, body)
    .then((v) => v)
    .catch((reason) => reason.response);
  expect(result.status).toBe(expectStatus);
  if (result.data) return result.data.error;
  return 'OK';
};

export { testPostStatus, testPatchStatus, testPutStatus, testGetStatus };
