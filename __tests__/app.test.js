const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('universal 404', () => {
  test('status 404: should return a message for invalid path', () => {
    return request(app)
      .get('/api/category')
      .expect(404)
      .then(({ body }) => {
        console.log(body);
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
