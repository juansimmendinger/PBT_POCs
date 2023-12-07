import axios from 'axios'
import { API_URL } from '../utils/constants'

async function getStatus(userAddress) {
    try {
      const response = await axios.post(`${API_URL}/users/getStatus`, userAddress);
      console.log('Data sent successfully:', response);
      return response
    } catch (error) {
      console.error('Error sending data:', error);
    }
}

export default getStatus