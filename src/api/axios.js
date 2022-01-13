/** @format */

import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080/api_treso_app/sources/',
})

export default instance
