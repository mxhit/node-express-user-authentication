const port = 3000;
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');


app.use(express.json());

const users = [];

app.get('/getUsers', (req, res) => {
    res.json(users);
});

app.post('/addUser', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // The second argument is the default value for generating salt. Password will be hashed using this salt
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        
        res.status(201).send();

    } catch (error) {
        res.status(500).send();
    }

});

app.post('/user/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);

    if (user == null) {
        return res.status(400).send('User not found');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Logged In');
        } else {
            res.send('Please check your credentials');
        }
    } catch (error) {
        res.status(500).send();
    }

});



app.listen(port);