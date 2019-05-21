import express from 'express';
const app = express();

app.use(express.static(path.join(__dirname, './src/public')));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Node.js & Express' });
});
app.listen(process.env.PORT || 3000, () => console.log("Listening to port 3000"));