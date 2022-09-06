const request = require('supertest');
const { use } = require('../app');
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
    test('status 200: should return the matching review with correct keys', () => {
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
