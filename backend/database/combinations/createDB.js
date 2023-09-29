fetch('http://localhost:3000/database/reset', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(r => r.json()).then(r => console.log(r)).catch(e => console.log(e));



