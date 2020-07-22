import axios from 'axios';
import baseUrl from 'shared/config/baseUrl';

export default axios.create({
  baseURL: baseUrl,
});