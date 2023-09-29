const os = require('os');
const {exec} = require('child_process');
const path = require('path');
const currentDirectory = __dirname;
const shell = os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh';

const SERVER_PATH = path.join(currentDirectory, 'backend');
const CLIENT_PATH = path.join(currentDirectory, 'frontend');
exec(`npm install`, {cwd: SERVER_PATH, shell}, (error, stdout) => {
    if (error) {
        console.error(`Error installing server dependencies: ${error}`);
        return;
    }
    console.log(`Server output: ${stdout}`);
});

exec(`npm install`, {cwd: CLIENT_PATH, shell}, (error, stdout) => {
    if (error) {
        console.error(`Error installing client dependencies: ${error}`);
        return;
    }
    console.log(`Client output: ${stdout}`);
});

exec(`NODE_ENV=production node ./bin/www`, {cwd: SERVER_PATH, shell}, (error, stdout) => {
    if (error) {
        console.error(`Error starting server: ${error}`);
        return;
    }
    console.log(`Server output: ${stdout}`);
});

exec('node database/setup.js', {cwd: SERVER_PATH, shell}, (error, stdout) => {
    if (error) {
        console.error(`Error setting up database: ${error}`);
        return;
    }
    console.log(`Database setup output: ${stdout}`);
})
exec(`quasar dev`, {cwd: CLIENT_PATH, shell}, (error, stdout) => {
    if (error) {
        console.error(`Error starting client: ${error}`);
        return;
    }
    console.log(`Client output: ${stdout}`);
});

