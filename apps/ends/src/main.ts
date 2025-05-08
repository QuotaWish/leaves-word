import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
