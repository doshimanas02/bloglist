import axios from 'axios'

const getRandomImage = async () => {
  const response = await axios.get('https://dog.ceo/api/breeds/image/random')
  return response.data
}

export default { getRandomImage }
