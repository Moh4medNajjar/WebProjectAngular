const express = require('express');
const cors = require('cors');
require('./db/dbConnect')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); 
const port = 3000;
const userApi = require('./routes/user');
const taskApi = require('./routes/task')
const commentApi = require('./routes/comment')
const projectApi = require('./routes/project'); 

app.use('/user', userApi) 
app.use('/task', taskApi) 
app.use('/comment', commentApi) 
app.use('/project', projectApi);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});