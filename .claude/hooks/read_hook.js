process.stdin.setEncoding("utf8");
let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  const toolArgs = JSON.parse(input);
  const readPath = toolArgs.tool_input?.file_path || "";

  const blocked = [".env", ".pem", "id_rsa", "id_ed25519", "credentials.json", "service-account.json"];
  const match = blocked.find((p) => readPath.includes(p));

  if (match) {
    console.error(`Access blocked: cannot read sensitive file "${readPath}"`);
    process.exit(2);
  }

  process.exit(0);
});
