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
          expect(body.articles[0]).to.haveOwnProperty("count");
          expect(body.articles.length).to.equal(10);
        }));
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
          expect(body.articles[0]).to.haveOwnProperty("count");
          expect(body.articles[0]).to.haveOwnProperty("author");
          expect(body.articles[0].title).to.equal(
            "Living in the shadow of a great man"
          );
        }));
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
        }));
    it.only("GET returns status:404 responds with message:not found", () => {
      return request.get("/api/articles/250").expect(404);
    });
  });
});
