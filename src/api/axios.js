import axios from 'axios';

const baseDomain = 'http://localhost:8000';
const baseUrl = `${baseDomain}/api/v1`;

export default axios.create({baseUrl});