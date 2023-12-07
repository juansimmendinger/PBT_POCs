import axios from 'axios'
import { API_URL } from '../utils/constants.js'

async function postPublicKeyRaw(data) {
    try {
      const response = await axios.post(`${API_URL}/users/postPublicKeyRaw`, data);
      console.log('Data sent successfully:', response);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }


export default postPublicKeyRaw