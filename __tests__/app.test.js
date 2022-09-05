const request = require('supertest');
const app = require('../app');
const db = require('../db');
const testData = require('..db/data/test-data');
const seed = require('../db/seeds');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
  test('should return an array of objects with slug and description properties', () => {
    return request(app)
      .get('/api/categories')
      .expect(200)
      .then(({ body }) => {
        const { games } = body;
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
