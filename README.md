# Blog Backend API

## Project Overview

This is the backend service for the Blog application. It provides a RESTful API for managing blog posts, comments, and user authentication. The backend is built using Node.js, Express, and MongoDB.

## Table of Contents
- [Project Overview](#project-overview)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Testing](#testing)

## API Endpoints

### Blog Posts

- **GET /posts**
  - Description: Fetch all blog posts.
  - Response: `200 OK` with a list of posts.

- **GET /posts/:id**
  - Description: Fetch a specific blog post by ID.
  - Params: `id` - The ID of the blog post.
  - Response: `200 OK` with the post data or `404 Not Found` if the post does not exist.

- **POST /posts**
  - Description: Create a new blog post.
  - Headers: `Authorization: Bearer <token>`
  - Body:
    ```json
    {
      "title": "Post Title",
      "body": "Post Body",
      "category": "Post Category",
      "readTime": 5,
      "excerpt": "Short summary",
      "tags": ["tag1", "tag2"],
      "authorName": "Author Name",
      "authorImageURL": "https://example.com/image.jpg"
    }
    ```
  - Response: `201 Created` with the created post data.

- **PUT /posts/:id**
  - Description: Update an existing blog post.
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - The ID of the blog post.
  - Body: Same as POST `/posts`.
  - Response: `200 OK` with the updated post data or `404 Not Found` if the post does not exist.

- **DELETE /posts/:id**
  - Description: Delete a blog post by ID.
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - The ID of the blog post.
  - Response: `200 OK` with a message confirming deletion or `404 Not Found` if the post does not exist.

### Comments

- **GET /comments/:postId**
  - Description: Fetch all comments for a specific blog post.
  - Params: `id` - The ID of the blog post.
  - Response: `200 OK` with a list of comments.

- **POST /comments/:postId**
  - Description: Add a new comment to a blog post.
  - Headers: `Authorization: Bearer <token>`
  - Params: `id` - The ID of the blog post.
  - Body:
    ```json
    {
      "postId": "PostID",
      "userName": "User Name",
      "userProfilePic": "https://example.com/user.jpg",
      "text": "Blog Discussion Comment"
    }
    ```
  - Response: `201 Created` with the created comment data.

## Authentication

- **POST /auth/register**
  - Description: Register a new user.
  - Body:
    ```json
    {
      "email": "test@gmail.com",
      "password": "test@123",
      "name": "Your Name",
      "bio": "Your bio"",
      "profilePicture": "https://example.com/user.jpg"
    }
    ```
  - Response: `201 Created` with the user data and JWT token.

- **POST /auth/login**
  - Description: Log in an existing user.
  - Body:
    ```json
    {
      "email": "test@gmail.com",
      "password": "password123"
    }
    ```
  - Response: `200 OK` with the user data and JWT token.

## Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JosephKS10/blog-backend.git
2. **Install dependencies:**
   ```bash
   npm install
3. **Set up environment variables:**
Create a .env file in the root directory with the following content:
   ```bash
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
   CLOUDINARY_API_KEY=<Your Cloudinary API Key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
   MONGO_URI_TEST=<Your MongoDB Test URI>
4. **Run the server:**
   ```bash
   node index.js


## Deployment
The backend is deployed and accessible at:

Live URL: https://blog-backend-xlw9.onrender.com

To test out the application with an user credential
Email: test@gmail.com
Password: test@123


## Testing
1. **Run unit tests:**
   ```bash
   npx jest
1. **Test API Endpoints:**
Use tools like Postman or cURL to test the API endpoints.



