**Blog Post Project**

This project uses Node.js, Express.js, MongoDB, and Mongoose to create a secure and efficient blog platform.

**Features**

- User Authentication: Users can create an account and log in to the platform.
- Middleware Protection: Each route is protected by middleware that checks the user's credentials. Only users with the appropriate permissions can access the route.
- Blog Storage: Blogs are stored in MongoDB and the user can access them at anytime.
- Create and publish blog posts.
- Edit and update blog posts.
- Delete blog posts.
- View all blogs posts.
- Access each blog post individually.

**Getting Started**

Before you begin, ensure that you have the following requirements:

- Node.js and npm installed on your development machine.
- MondoDB installed and running.

**Installation (Including MongoDB Atlas Setup)**

**1. Clone the Repository**
  - Extract the ZIP file to a directory of your choice.

**2. Navigate to the Project Directory**

**3. Set Up MongoDB Atlas**
  - Go to MongoDB Atlas and sign up or log in.
  - Create a new cluster and obtain the MongoDB connection URI (add it to environment variables as mentioned in step 4).

**4. Set Up Environment Variables**
  - Create a .env file in the projects root directory.
  - Include the following environment variables: MONGODB_URI, JWT_SECRET, and SECRET_KEY.

**5. Install Node.js Dependencies**
  - Run the command "npm install" in the projects directory.

**6. Start the application**
  - Run the command "node index.js" in the projects directory.
  - Open your browser and navigate to "http://localhost:3000".
