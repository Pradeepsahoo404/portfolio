const fs = require("fs");
const path = require("path");

const NESTED_DIRS = [
  "src/models/auth",
  "src/models/workspace",
  "src/models/taxonomy",
  "src/models/site",
  "src/models/base",
  "src/repositories",
  "src/services",
  "src/cron/jobs",
  "src/database/indexes",
  "src/routes/v1",
];

const PREFIXES = [
  "constants",
  "config",
  "errors",
  "helpers",
  "utils",
  "repositories",
  "models",
  "controllers",
  "middlewares",
  "validators",
  "emails",
  "dtos",
];

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, "utf8");
  let changed = false;
  for (const prefix of PREFIXES) {
    const wrong = `from "../${prefix}/`;
    const right = `from "../../${prefix}/`;
    if (c.includes(wrong)) {
      c = c.split(wrong).join(right);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, c, "utf8");
    console.log("restored", filePath);
  }
}

const root = path.join(__dirname, "..");
for (const dir of NESTED_DIRS) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) continue;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith(".ts")) fixFile(f);
    }
  };
  walk(fullDir);
}

// seeders/utils needs ../../ for src-level imports
const clearDb = path.join(root, "src/seeders/utils/clearDatabase.ts");
if (fs.existsSync(clearDb)) {
  let c = fs.readFileSync(clearDb, "utf8");
  c = c.replace('from "../utils/', 'from "../../utils/');
  fs.writeFileSync(clearDb, c, "utf8");
  console.log("restored", clearDb);
}

console.log("Done restoring nested imports");
