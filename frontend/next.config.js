const fs = require("fs");
const path = require("path");

function loadRootEnv() {
  const envPath = path.resolve(__dirname, "../.env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadRootEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server (.next/standalone) for small container images.
  output: "standalone",
  // Trace files from this folder, not the repo root (plan A1 / G17).
  outputFileTracingRoot: __dirname,
  // The app does not use next/image; keep the optimizer (sharp/libheif, see
  // .trivyignore) switched off so it cannot be enabled by accident.
  images: { unoptimized: true }
};

module.exports = nextConfig;
