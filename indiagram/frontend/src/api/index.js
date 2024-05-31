import axios from 'axios'

const API =axios.create({baseURL: 'http://localhost:5500/api/v1'});

export default API;