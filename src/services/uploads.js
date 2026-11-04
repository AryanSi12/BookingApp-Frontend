import axios from "axios";

/**
 * Multipart POST used by signup and organizer create calls.
 * Public signup omits withCredentials. Organizer creates send it.
 * Header and body match the previous inline axios calls.
 */
export function postMultipart(url, formData, { withCredentials = false } = {}) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  if (withCredentials) {
    config.withCredentials = true;
  }
  return axios.post(url, formData, config);
}
