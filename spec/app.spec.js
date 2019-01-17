process.env.NODE_ENV = "test";
const supertest = require("supertest");

const { expect } = require("chai");
const app = require("../app");

const request = supertest(app);
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() =>
    connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run())
  );
  after(() => connection.destroy());

  describe("/topics", () => {
    it("GET returns status:200 of an array of all the topics", () =>
      request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics[0].slug).to.equal("mitch");
          expect(body.topics).to.have.length(2);
        }));
    it("status :405 handles invalid requests for /api/topics", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const url = "/api/topics";
      const invalidRequests = invalidMethods.map(invalidMethod =>
        request[invalidMethod](url).expect(405)
      );
      return Promise.all(invalidRequests);
    });
    it("POST returns status:201 responds with newly added topic", () =>
      request
        .post("/api/topics")
        .send({ slug: "Alex", description: "Northcoders" })
        .expect(201)
        .then(({ body }) => {
          expect(body.topic.slug).to.equal("Alex");
          expect(body.topic).to.have.ownProperty("description");
        }));
    it("POST status:400 responds with malformed request body", () =>
      request
        .post("/api/topics")
        .send({ name: "Alex", description: "Northcoders" })
        .expect(400));
    it("GET returns status:200 of an array of all the articles for a given topic, also tests default limit", () =>
      request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(12);
          expect(body.articles[0]).to.haveOwnProperty("comment_count");
          expect(body.articles.length).to.equal(10);
        }));
    it("status :405 handles invalid requests for /api/topics/:topic/articles", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const url = "/api/topics/:topic/articles";
      const invalidRequests = invalidMethods.map(invalidMethod =>
        request[invalidMethod](url).expect(405)
      );
      return Promise.all(invalidRequests);
    });
    it("GET returns status:200 of an array of all the articles for a given topic, tests start query", () =>
      request
        .get("/api/topics/mitch/articles?p=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(11);
          expect(body.articles.length).to.equal(10);
        }));
    it("GET returns status:200 of an array of all the articles for a given topic, tests limit query", () =>
      request
        .get("/api/topics/mitch/articles?limit=5")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(5);
        }));
    it("GET returns status:404 responds with error 404 not found", () =>
      request.get("/api/topics/paul/articles").then(({ body }) => {
        expect(body.message).to.equal("Topic not found");
      }));
    it("POST returns status:201 respons with the newly added article", () => {
      const newArticle = {
        title: "new article",
        body: "new article body",
        username: "icellusedkars"
      };
      return request
        .post("/api/topics/mitch/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article.username).to.equal("icellusedkars");
        });
    });
    it("POST returns status:400 responds with malformed request body", () => {
      const newArticle = {
        title: "new article",
        body: "new article body",
        user: "icellusedkars"
      };
      return request
        .post("/api/topics/mitch/articles")
        .send(newArticle)
        .expect(400);
    });
  });
  describe("/api/articles", () => {
    it("GET returns status:200 responds with an array of all the articles, also tests default limit query", () =>
      request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(10);
          expect(body.articles[0]).to.haveOwnProperty("comment_count");
          expect(body.articles[0]).to.haveOwnProperty("author");
          expect(body.articles[0].title).to.equal(
            "Living in the shadow of a great man"
          );
        }));
    it("status :405 handles invalid requests for /api/articles", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const url = "/api/articles";
      const invalidRequests = invalidMethods.map(invalidMethod =>
        request[invalidMethod](url).expect(405)
      );
      return Promise.all(invalidRequests);
    });
    it("GET returns status:200 responds with an array of articles, tests limit query and start query", () =>
      request
        .get("/api/articles?limit=5&&p=3")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(5);
          expect(body.articles[0].title).to.equal("Student SUES Mitch!");
        }));
    it("GET returns status:200 responds with an article with a given article_id", () =>
      request
        .get("/api/articles/4")
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0].article_id).to.equal(4);
          expect(body.article[0]).to.haveOwnProperty("comment_count");
          expect(body.article[0]).to.haveOwnProperty("author");
        }));
    it("status :405 handles invalid requests for /api/articles/:article_id", () => {
      const invalidMethods = ["put", "post"];
      const url = "/api/articles/:article_id";
      const invalidRequests = invalidMethods.map(invalidMethod =>
        request[invalidMethod](url).expect(405)
      );
      return Promise.all(invalidRequests);
    });
    it("GET returns status:404 responds with message:not found", () =>
      request
        .get("/api/articles/250")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal("Article not found");
        }));
    it("PATCH returns status:204 responds with updated article", () =>
      request
        .patch("/api/articles/1")
        .send({ inc_votes: 50 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(150);
          expect(body.article.article_id).to.equal(1);
        }));
    it("PATCH returns status:404 responds with message:not found", () =>
      request
        .patch("/api/articles/5000")
        .send({ inc_votes: 50 })
        .expect(404));
    it("DELETE returns status:204 responds with no content", () =>
      request
        .delete("/api/articles/1")
        .expect(204)
        .then(() => request.get("/api/articles/1").expect(404)));
    it("GET returns status:200 responds with array of comments with given article_id, tests default limit query", () =>
      request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(10);
          expect(body.comments[0].article_id).to.equal(1);
        }));
    it("GET returns status:200 responds with an array of comments with given article_id, tests limit query and page start query", () =>
      request
        .get("/api/articles/1/comments?limit=5?p=3")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(5);
          expect(body.comments[0].author).to.equal("butter_bridge");
        }));
    it("GET returns status:404 responds with message:not found", () =>
      request
        .get("/api/articles/500/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal("No comments found/ no article found");
        }));
    it("POST returns status:201 responds with added comment", () => {
      const newComment = {
        username: "butter_bridge",
        body: "this is the body"
      };

      return request
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.username).to.equal("butter_bridge");
          expect(body.comment.body).to.equal("this is the body");
        });
    });
    it("status :405 handles invalid requests for /api/articles/:article_id/comments", () => {
      const invalidMethods = ["put", "delete"];
      const url = "/api/articles/:article_id/comments";
      const invalidRequests = invalidMethods.map(invalidMethod =>
        request[invalidMethod](url).expect(405)
      );
      return Promise.all(invalidRequests);
    });
    it("PATCH returns status:200 responds with updated comment", () =>
      request
        .patch("/api/articles/1/comments/3")
        .send({ inc_votes: -30 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(70);
        }));
    it("PATCH returns status:404 responds with comment not found", () =>
      request
        .patch("/api/articles/1/comments/32")
        .send({ inc_votes: -30 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal("Comment not found");
        }));
    it("DELETE returns status:204 responds with no content", () => {
      return request
        .delete("/api/articles/1/comments/12")
        .expect(204)
        .then(() => {
          return connection("comments")
            .where("comment_id", 12)
            .then(({ body }) => {
              expect(body).to.equal(undefined);
            });
        });
    });
  });
  describe("/api/users", () => {
    it("GET returns status:200 of an array of all user objects", () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).to.equal(3);
          expect(body.users[0].username).to.equal("butter_bridge");
        });
    });
    it("status :405 handles invalid requests for /api/articles/:article_id", () => {
      const invalidMethods = ["put", "post", "delete", "patch"];
      const url = "/api/users";
      const invalidRequests = invalidMethods.map(invalidMethod =>
        request[invalidMethod](url).expect(405)
      );
      return Promise.all(invalidRequests);
    });
  });
  describe("/api/users/:username", () => {
    it.only("GET returns status:200 of user object with given username", () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user.username).to.equal("butter_bridge");
        });
    });
  });
});
