import axios from 'axios'

function reset() {
  console.log('Resetting database...')
  let baseURI: string
  if (process.env['environment'] === 'production') {
    baseURI = 'http://combinations-server:3000'
  } else {
    baseURI = 'http://localhost:3000'
  }

  axios
    .get(`${baseURI}/database/reset`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 2147483647,
    })
    .then(response => {
      console.log(response.data)
    })
    .catch(error => console.log(error))
}

export default reset
