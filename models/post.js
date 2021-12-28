const db = require("../data/database");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;

    if (id) {
      this.id = new ObjectId(id);
    }
  }

  async save() {
    let result;
    if (!this.id) {
      result = await db.getDb().collection("posts").insertOne({
        title: this.title,
        content: this.content,
      });
    } else {
      result = await db
        .getDb()
        .collection("posts")
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
    }

    return result;
  }

  static async getPostById(id) {
    const postid = new ObjectId(id);
    const post = await db.getDb().collection("posts").findOne({ _id: postid });

    if (!post) {
      return undefined;
    }

    return new Post(post.title, post.content, post._id);
  }

  static async getPosts() {
    const posts = [];
    const postDocuments = await db.getDb().collection("posts").find().toArray();
    for (let postDocument of postDocuments) {
      posts.push(
        new Post(postDocument.title, postDocument.content, postDocument._id)
      );
    }
    return posts;
  }

  async delete() {
    if (!this.id) {
      return;
    }
    await db.getDb().collection("posts").deleteOne({ _id: this.id });
  }
}

module.exports = Post;
