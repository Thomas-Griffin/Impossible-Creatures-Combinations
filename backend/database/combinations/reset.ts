console.log('Resetting database...');
fetch('http://express-server:3000/database/reset', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(r => r.json()).then(r => console.log(r)).catch(e => console.log(e));



