const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production.");
}

export const jwtConstants = {
  secret: jwtSecret ?? "change-me",
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
};
