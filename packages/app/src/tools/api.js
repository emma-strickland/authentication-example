// TODO: token logic should be centralized.
import config from '../config';
import { TOKEN } from './constants';

const DEFAULT_ERROR_MESSAGE = "Internal error.";

export const post = (endpoint, params, onError, onSuccess) => {
  let headers = { 'Content-Type': 'application/json' };
  let token = localStorage.getItem(TOKEN)
  if (token) {
    headers["Authorization"] = `Bearer${token}`
  }
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
          .catch((error) => {
            console.log("error: ", error)
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