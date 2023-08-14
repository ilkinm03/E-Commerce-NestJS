import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const swaggerConfig: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
    .setTitle("E-Commerce Application")
    .setDescription("The e-commerce API documentation")
    .setVersion("0.0.1")
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup("docs", app, document);
  await app.listen(3000);
}

bootstrap();
