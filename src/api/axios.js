/** @format */

import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://WIN-E9496CJUVAT:8099/api_treso_app/sources/',
})

export default instance
