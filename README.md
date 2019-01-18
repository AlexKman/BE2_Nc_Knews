# BE2-NC-Knews

## Northcoders News API

### Description

This is the API used in the Northcoders News Sprint which is using a database of topics articles comments and users

The database is using PSQL, and you will interact with it using [Knex](https://knexjs.org).

#### Run this project locally

This project uses node version `v8.10.0` and postgres version `10.6`.

To clone the repository use git clone https://github.com/AlexKman/BE2-NC-Knews.git in your terminal

To set the databases up and prepare for seeding run the following commands: 

* npm run seed_setup
* npm run seed:db
* npm run seed:dev:db

#### Endpoint details

**GET** 

/api : *serves JSON object describing all the endpoints available on the app*

**GET**

/api/topics : _Responds with an array of topic objects_

**POST**

/api/topics/ : _Accepts object containing unique slug and description property responds with posted object_

**GET**

/api/topics/:topic/articles : _Responds with array of articles for a given topic_

#### Queries

     * limit : limits the number of responses (defaults to 10)
     * sort_by : sorts the articles by any valid column, defaults to date
     * p : stands for page which specifies the page at which to start (calculated using limit)
     * order : can be set to asc (ascending) when true or desc (descending) when false (defaults to ascending)

**POST**

/api/topics/:topic/articles : _Accepts object containing a title body and username property responds with posted article_

**GET**

/api/articles : _Responds with an array of article objects_

#### Queries

     * limit : limits the number of responses (defaults to 10)
     * sort_by : sorts the articles by any valid column, (defaults to date)
     * p : stands for page which specifies the page at which to start (calculated using limit)
     * order : can be set to asc (ascending) when true or desc (descending) when false (defaults to ascending)

**GET**

/api/articles/:article_id : *Responds with an article object for a given article_id*

**PATCH**

/api/articles/:article_id : *Accepts an object in the form { inc_votes : newVote } responds with updated article object*

     * newVote will indicate how much the votes property in the database shoud be updated by E.g { inc_votes : 1 } would increment
       the current article's vote property by 1. { inc_votes : -100 } would decrement the current article's vote property by 100

**DELETE**

/api/articles/:article_id : *Deletes given article by article_id responds with 204 and no content*

**GET** 

/api/articles/:article_id/comments : *Responds with an array of comments for the given article_id*

#### Queries

     * limit : limits the number of responses (defaults to 10)
     * sort_by : sorts the comments by any valid column, (defaults to date)
     * p : stands for page which specifies the page at which to start (calculated using limit)
     * order : can be set to asc (ascending) when true or desc (descending) when false (defaults to ascending)

**POST** 

/api/articles/:article_id/comments: *Accepts an object with a body and username property, responds with the posted comment object*

**PATCH** 

/api/articles/:article_id/comments/:comment_id : *Accepts an object in the form { inc_votes : newVote } responds with updated comment*

     * newVote will indicate how much the votes property in the database shoud be updated by E.g { inc_votes : 1 } would increment
       the current article's vote property by 1. { inc_votes : -100 } would decrement the current article's vote property by 100

**DELETE** 

/api/articles/:article_id/comments/:comment_id : *Deletes given comment by comment_id responds with 204 and no content*

**GET** 

/api/users : *Responds with an array of user objects*

**GET** 

/api/users/username : *Responds with a user object for a given username*

