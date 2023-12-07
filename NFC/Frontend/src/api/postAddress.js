import axios from 'axios'
import { API_URL } from '../utils/constants'

async function postAddress(userAddress) {
    try {
      const response = await axios.post(`${API_URL}/users/postAddress`, userAddress);
      console.log('Data sent successfully:', response);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }


export default postAddress