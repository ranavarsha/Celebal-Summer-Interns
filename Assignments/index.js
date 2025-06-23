const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/crud_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true }
});
const User = mongoose.model('User', userSchema);

// Create
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Read All
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Read One
app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'Not found' });
    res.send(user);
});

// Update
app.put('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send({ message: 'Not found' });
    res.send(user);
});

// Delete
app.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ message: 'Not found' });
    res.send({ message: 'Deleted successfully' });
});

// Start server
app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
