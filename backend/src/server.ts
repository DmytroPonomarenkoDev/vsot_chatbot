import app from './index';
import { BACKEND_PORT } from "./config/env";

const port = BACKEND_PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 