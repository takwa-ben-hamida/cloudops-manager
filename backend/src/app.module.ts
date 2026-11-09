import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { EnvironmentsModule } from './environments/environments.module';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    PrismaModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    TeamsModule,
    EnvironmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
