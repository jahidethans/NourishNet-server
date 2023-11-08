const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app =  express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8allbd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('nourishNet').collection('allfoods');
    const requestCollection = client.db('nourishNet').collection('requests')

    // show all available foods
    app.get('/allfoods', async(req, res)=>{
        const cursor = foodCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

   // show user-based requested foods
app.get('/requests', async (req, res) => {
  let query = {};
  if (req.query?.userEmail) {
    query = { userEmail: req.query.userEmail };
  }
  const result = await requestCollection.find(query).toArray();
  res.send(result);
});


    // show specific food detail
    app.get('/allfoods/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await foodCollection.findOne(query);
      res.send(result);
    })

    // get user based food for manage my food page
    app.get('/managefoods', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await foodCollection.find(query).toArray();
      res.send(result)
    })

    // add one food
    app.post('/allfoods', async(req, res)=>{
      const newFood = req.body;
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    })
    
    // add one request
    app.post('/requests', async(req, res)=>{
      const newFood = req.body;
      const result = await requestCollection.insertOne(newFood);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('food is running')
})

app.listen(port, ()=>{
    console.log(`nourish server is running on ${port}` );
})