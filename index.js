const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId,} = require('mongodb');

require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();


//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rw41wea.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const usersCollection = client.db('blogsApplications').collection('users');
        const blogsCollection = client.db('blogsApplications').collection('blogs');

        app.post('/users', async(req,res)=>{
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);

        });

        app.get('/blogs', async(req, res) =>{
            const query = {};
            const blogs = await blogsCollection.find(query).toArray();
            res.send(blogs);
        });
        
        app.post('/blogs', async(req,res)=>{
            const blogs = req.body;
            const result = await blogsCollection.insertOne(blogs);
            res.send(result);
        });
        app.get('/blogs/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const blogs = await blogsCollection.findOne(query);
            res.send(blogs);
        });

        app.patch('/blogs/:id', async(req, res)=>{
            const id =req.params.id;
            const status = req.body.status
            const query = {_id: ObjectId(id) }

            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await blogsCollection.updateOne(query, updatedDoc);
            res.send(result);
        });



        app.delete('/blogs/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            console.log(result);
            res.send(result);

        });

       

    }
    finally{

    }
}
run().catch(console.log);
app.get('/', async(req,res) =>{
    res.send('blogs applications server is running');
})

app.listen(port, ()=>console.log(`blogs applications ${port}`))