import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ApplicationModule } from '../src/app.module';
import { Server } from 'http';

describe('SynchronizationModule', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`Should return object with WatermellonDB format`, () => {
    return request(server)
      .get('/synchronization/init')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          changes: {
            posts: {
              created: [],
              updated: [],
              deleted: [],
            },
          },
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
