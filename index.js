const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    withCredentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcfrddp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const sportsCollection = client.db("dbBlog").collection("blog");
    const commentsCollection = client.db("dbBlog").collection("comment");
    const wishlistCollection = client.db("dbBlog").collection("wishlist");

    app.get("/blogs", async (req, res) => {
      const result = await sportsCollection.find().toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.findOne(query);
      res.send(result);
    });

    app.get("/update", async (req, res) => {
      const result = await sportsCollection.find().toArray();
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateBlogsData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBlogs = {
        $set: {
          title: updateBlogsData.title,
          image: updateBlogsData.image,
          category: updateBlogsData.category,
          short_description: updateBlogsData.short_description,
          long_description: updateBlogsData.long_description,
        },
      };
      const result = await sportsCollection.updateOne(
        filter,
        updatedBlogs,
        options
      );
      res.send(result);
    });

    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      console.log(blog);
      const result = await sportsCollection.insertOne(blog);
      res.send(result);
    });

    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { blogId: id };
      const result = await commentsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/comments", async (req, res) => {
      const comments = req.body;
      console.log(comments);
      const result = await commentsCollection.insertOne(comments);
      res.send(result);
    });

    app.get("/featured", async (req, res) => {
      const sort = { long_description: 1 };
      const result = await sportsCollection.find().sort(sort).toArray();
      res.send(result);
    });

    app.get("/wishlist", async (req, res) => {
      const result = await wishlistCollection.find().toArray();
      res.send(result);
    });

    app.get("/wishlist/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };

      // console.log(query);
      const result = await wishlistCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/wishlist", async (req, res) => {
      const blogs = req.body;
      // console.log(blogs)
      const result = await wishlistCollection.insertOne(blogs);
      res.send(result);
    });

    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishlistCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("sports server is sunning");
});

app.listen(port, () => {
  console.log(`sports server running on the port ${port}`);
});
