// backend/src/index.ts
import app from './app';
import { AppDataSource } from './config/data-source';

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        app.listen(PORT, () => {
            console.log(`Backend server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });