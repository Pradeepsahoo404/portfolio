const fs = require("fs");
const path = require("path");

function isUtf16Le(buf) {
  return buf.length > 2 && buf[1] === 0x00 && buf[3] === 0x00;
}

function toUtf8(filePath) {
  const buf = fs.readFileSync(filePath);
  if (isUtf16Le(buf)) {
    fs.writeFileSync(filePath, buf.toString("utf16le"), "utf8");
    console.log("fixed encoding:", filePath);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", "dist", ".git"].includes(entry.name)) walk(full);
    } else if (/\.(ts|json|hbs|md|yaml|yml)$/.test(entry.name)) {
      toUtf8(full);
    }
  }
}

walk(path.join(__dirname, ".."));
walk(path.join(__dirname, "../.."));

console.log("Done");
