import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { Post } from './post/post.entity';
import { WatermellondbSynchronizationModule } from '../../src/watermellondb-synchronization.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '0.0.0.0',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Post],
      synchronize: true,
      autoLoadEntities: true,
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    PostModule,
    WatermellondbSynchronizationModule.register({
      readEntities: [Post],
      writeEntities: [],
    })
  ],
})
export class ApplicationModule {}
