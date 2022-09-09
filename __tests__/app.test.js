const request = require('supertest');
const { use } = require('../app');
const jestSort = require('jest-sorted');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('universal 404', () => {
  test('status 404: should return a message for invalid path', () => {
    return request(app)
      .get('/api/invalid')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid path.');
      });
  });
});

describe('GET /api/categories', () => {
  test('status 200: should return an array of objects with slug and description properties', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const games = body.categories;
        expect(games).toBeInstanceOf(Array);
        expect(games.length > 0).toBe(true);
        games.forEach((game) => {
          expect(game).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe('GET /api/reviews/:review_id', () => {
  describe('happy paths', () => {
    test('status 200: should return the matching review with correct keys, now including comments', () => {
      const revId = 3;
      return request(app)
        .get(`/api/reviews/${revId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 3,
            title: 'Ultimate Werewolf',
            designer: 'Akihisa Okui',
            owner: 'bainesface',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: "We couldn't find the werewolf!",
            category: 'social deduction',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 5,
            comment_count: '3',
          });
        });
    });
  });

  describe('error handling', () => {
    test('status 400: should return a message for a bad request', () => {
      return request(app)
        .get('/api/reviews/not_an_id')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request, not a review id');
        });
    });
    test('status 404: should return a message for an id that does not exist', () => {
      return request(app)
        .get('/api/reviews/10000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('That review id does not exist');
        });
    });
  });
});

describe('GET /api/users', () => {
  test('status 200: should return an array of user objects with correct keys', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const userList = body.users;
        expect(userList).toBeInstanceOf(Array);
        expect(userList.length > 0).toBe(true);
        userList.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe('PATCH /api/reviews/:review_id', () => {
  describe('happy path', () => {
    test('status 200: should return the review with updated votes value', () => {
      const revId = 3;
      return request(app)
        .patch(`/api/reviews/${revId}`)
        .send({ inc_votes: 30 })
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 3,
            title: 'Ultimate Werewolf',
            designer: 'Akihisa Okui',
            owner: 'bainesface',
            review_img_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: "We couldn't find the werewolf!",
            category: 'social deduction',
            created_at: '2021-01-18T10:01:41.251Z',
            votes: 35,
          });
        });
    });
  });

  describe('error handling', () => {
    test('status 400: bad request for malformed body empty obj', () => {
      const revId = 3;
      return request(app)
        .patch(`/api/reviews/${revId}`)
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request, malformed body');
        });
    });
    test('status 400: bad request for malformed body missing key', () => {
      const revId = 3;
      return request(app)
        .patch(`/api/reviews/${revId}`)
        .send({ wrong_key: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request, malformed body');
        });
    });
    test('status 400: bad request for incorrect type', () => {
      const revId = 3;
      return request(app)
        .patch(`/api/reviews/${revId}`)
        .send({ inc_votes: 'not a number' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request, incorrect value type');
        });
    });
    test('status 404: not a review id', () => {
      const revId = 10000;
      return request(app)
        .patch(`/api/reviews/${revId}`)
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('That review id does not exist');
        });
    });
  });
});

describe('GET /api/reviews, optional /:category that filters by category', () => {
  describe('happy paths', () => {
    test('status 200: should return an array of review objects with correct keys and values', () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews.length > 0).toBe(true);
          expect(reviews).toBeSortedBy('created_at', { descending: true });
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test('status 200: should return array of review objects filtered by provided category', () => {
      const categ = 'social deduction';
      return request(app)
        .get(`/api/reviews?category=${categ}`)
        .expect(200)
        .then(({ body }) => {
          const reviews = body.reviews;
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews.length > 0).toBe(true);
          expect(reviews).toBeSortedBy('created_at', { descending: true });
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: 'social deduction',
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe('error handling', () => {
    test('status 404: if category given is valid but does not exist', () => {
      const categ = 'not a category';
      return request(app)
        .get(`/api/reviews?category=${categ}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('There is no such category');
        });
    });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  describe('happy path', () => {
    test('status 200: should return an array of comments for passed review id with correct keys', () => {
      const revId = 3;
      return request(app)
        .get(`/api/reviews/${revId}/comments`)
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length > 0).toBe(true);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe('error handling', () => {
    test('status 400: should return a message for a bad request', () => {
      const revId = 'not an id';
      return request(app)
        .get(`/api/reviews/${revId}/comments`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request, not a review id');
        });
    });
    test('status 404: should return a message for an id that does not exist', () => {
      const revId = 10000;
      return request(app)
        .get(`/api/reviews/${revId}/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('That review id does not exist');
        });
    });
  });
});
