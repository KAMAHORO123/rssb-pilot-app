import {
  INestApplication,
  ValidationPipe,
  UnauthorizedException
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authService: { login: jest.Mock; register: jest.Mock };

  beforeAll(async () => {
    authService = {
      login: jest.fn(),
      register: jest.fn()
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true
      })
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /auth/login returns access_token and user", async () => {
    authService.login.mockResolvedValue({
      access_token: "jwt-token",
      user: { id: "u1", email: "test@example.com", role: "USER" }
    });

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@example.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBe("jwt-token");
    expect(res.body.user.role).toBe("USER");
  });

  it("POST /auth/login returns 401 for invalid credentials", async () => {
    authService.login.mockRejectedValue(
      new UnauthorizedException("Invalid credentials")
    );

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "test@example.com", password: "secret123" });

    expect(res.status).toBe(401);
  });
});
