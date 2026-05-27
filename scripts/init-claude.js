const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const examplePath = path.join(projectRoot, ".claude", "settings.example.json");
const outputPath = path.join(projectRoot, ".claude", "settings.local.json");

if (!fs.existsSync(examplePath)) {
  console.error("❌ .claude/settings.example.json not found");
  process.exit(1);
}

const content = fs.readFileSync(examplePath, "utf8");
const resolved = content.replaceAll("$PWD", projectRoot);

fs.writeFileSync(outputPath, resolved, "utf8");
console.log(`✅ .claude/settings.local.json generated with absolute paths`);
console.log(`   Project root: ${projectRoot}`);
