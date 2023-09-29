const {exec} = require('child_process');


exec(`node decompressor.js`, {cwd: './combinations'}, (error, stdout) => {
    if (error) {
        console.error(`Error setting up database: ${error}`);
        return;
    }
    console.log(`Database setup output: ${stdout}`);
});

exec(`node createDB.js`, {cwd: './combinations'}, (error, stdout) => {
    if (error) {
        console.error(`Error creating database: ${error}`);
        return;
    }
    console.log(`Database creation output: ${stdout}`);
});

exec(`node cleanup.js`, {cwd: './combinations'}, (error, stdout) => {
    if (error) {
        console.error(`Error cleaning up database files: ${error}`);
        return;
    }
    console.log(`Database cleanup output: ${stdout}`);
});