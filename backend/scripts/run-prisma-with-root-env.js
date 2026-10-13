const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

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

loadEnvFile(path.resolve(__dirname, "../../.env"));

const prismaCliPath = path.resolve(
  __dirname,
  "../node_modules/prisma/build/index.js"
);

const child = spawn(process.execPath, [prismaCliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

