import axios from 'axios'
import { API_URL } from '../utils/constants.js'


async function getMintAndTransferInfo(data) {
    try {
      const response = await axios.post(`${API_URL}/users/getMintAndTransferInfo`, data);
      console.log(response)
      return response
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }


export default getMintAndTransferInfo