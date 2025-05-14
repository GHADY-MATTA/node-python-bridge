const express = require('express');
const app = express();
app.listen(3000, () => {
    console.log('Server is running');
});
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
