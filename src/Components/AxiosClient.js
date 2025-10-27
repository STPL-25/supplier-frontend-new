import axios from 'axios';

import {INSTANCEAPI} from "../config/configData"

const axiosInstance = axios.create({
    baseURL: INSTANCEAPI, 
  });
  
  export default axiosInstance;