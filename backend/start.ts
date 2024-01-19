import app from './app';
import {CLEANUP_SCRIPT_PATH, RESET_SCRIPT_PATH} from './globalConstants';
import DatabaseService from './services/databaseService';

const databaseService = new DatabaseService();
const PORT = 3000;

const initialiseDatabase = async () => {
    try {
        const reset = await import(RESET_SCRIPT_PATH);
        const cleanup = await import(CLEANUP_SCRIPT_PATH);
        reset.default();
        cleanup.default();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
databaseService.databaseIsInitialised().then(initialised => {
    if (!initialised) {
        initialiseDatabase().then(_ => console.log('Database initialised'));
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.on('error', err => console.error(`Server error: ${err}`));
