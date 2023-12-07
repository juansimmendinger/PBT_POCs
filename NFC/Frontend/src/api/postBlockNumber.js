import axios from 'axios'
import { API_URL } from '../utils/constants.js'

async function postBlockNumber(data) {
    try {
      const response = await axios.post(`${API_URL}/users/postBlockNumber`, data);
      console.log('Data sent successfully:', response);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }


export default postBlockNumber