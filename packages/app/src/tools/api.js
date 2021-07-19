import config from '../config';

const DEFAULT_ERROR_MESSAGE = "Internal error.";

export const post = (endpoint, params, onError, onSuccess) => {
  let headers = { 'Content-Type': 'application/json' };
  /* Add authorization token if it exists
     - check local storage and add to headers object with key Authorization
  */
  fetch(`${config.API_BASE_URL}/${endpoint}`,
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params)
    })
    .then(res => {
      if (res.status === 200) {
        res.json()
          .then(result => {
            onSuccess(result)
          })
          .catch((_) => {
            onError(DEFAULT_ERROR_MESSAGE)
          })
      } else {
        res.json()
          .then(result => {
            if (res.status < 500) {
              onError(result.message)
            } else {
              onError(DEFAULT_ERROR_MESSAGE)
            }
          })
          .catch((_) => {
            onError(DEFAULT_ERROR_MESSAGE)
          })
      }
    })
    .catch((_) => {
      onError(DEFAULT_ERROR_MESSAGE)
    });
}