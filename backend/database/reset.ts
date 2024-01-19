import axios from 'axios';

function reset() {
    console.log('Resetting database...');
    let baseURI: string;
    baseURI = process.env['environment'] === 'production' ? 'http://combinations-server:3000' : 'http://localhost:3000';

    axios
        .get(`${baseURI}/database/reset`, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 2147483647,
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.log(error));
}

export default reset;
