const request = require('supertest');
const app = require('../app');
const db = require('../db');
const testData = require('..db/data/test-data');
const seed = require('../db/seeds');

beforeEach(() => seed(testData));
afterAll(() => db.end());
