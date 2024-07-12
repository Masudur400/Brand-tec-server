const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.nhw8ipw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const usersCollection = client.db('brandTec').collection('users')



        // users post 
        app.post('/users', async (req, res) => {
            const userinfo = req.body
            const query = { email: userinfo?.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return
            }
            const result = await usersCollection.insertOne(userinfo)
            res.send(result)
        })

        // users get 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        // user get by email 
        app.get('/users/:email', async (req, res) =>{
            const email = req.params.email 
            const query = {email:email}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Brand tac is running..........')
})
app.listen(port, () => {
    console.log(`Brand tac server is running on port : ${port}`)
})