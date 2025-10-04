import express from "express";
import fs from "fs-extra";
import cors from "cors";
import bodyParser from "body-parser";
import AdmZip from "adm-zip";
import multer from "multer";
import cron from "node-cron";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const WORK_DIR = process.env.WORK_DIR || "./sandbox_server";
const BACKUP_DIR = "./backups";
await fs.ensureDir(WORK_DIR);
await fs.ensureDir(BACKUP_DIR);

let serverProcess = null;

// -------- SERVER CONTROL --------
app.post("/server/start", async (_, res) => {
  if (serverProcess) return res.json({ running: true });
  serverProcess = spawn("bash", ["-c", `cd ${WORK_DIR} && java -Xmx2G -jar server.jar nogui`]);
  serverProcess.stdout.on("data", d => console.log(d.toString()));
  serverProcess.stderr.on("data", d => console.log("[ERR]", d.toString()));
  serverProcess.on("exit", c => {
    console.log("Server exited:", c);
    serverProcess = null;
    if (process.env.AUTO_RESTART === "true") {
      console.log("Auto restart in 10s...");
      setTimeout(() => app.handle({ url: "/server/start", method: "POST" }, { json: ()=>{} }), 10000);
    }
  });
  res.json({ started: true });
});

app.post("/server/stop", (_, res) => {
  if (!serverProcess) return res.json({ running: false });
  serverProcess.kill("SIGTERM");
  res.json({ stopped: true });
});

app.post("/server/restart", (_, res) => {
  if (!serverProcess) return res.json({ restarted: false });
  serverProcess.kill("SIGTERM");
  setTimeout(() => app.handle({ url: "/server/start", method: "POST" }, { json: ()=>{} }), 2000);
  res.json({ restarted: true });
});

app.post("/server/kill", (_, res) => {
  if (!serverProcess) return res.json({ running: false });
  serverProcess.kill("SIGKILL");
  serverProcess = null;
  res.json({ killed: true });
});

// -------- BACKUP SYSTEM --------
function createBackupName() {
  const now = new Date();
  return `${now.toISOString().replace(/[:T]/g,"-").split(".")[0]}.zip`;
}
async function makeBackup() {
  const zip = new AdmZip();
  const targets = ["world", "plugins", "config"];
  for (const t of targets) {
    const dir = path.join(WORK_DIR, t);
    if (await fs.pathExists(dir)) zip.addLocalFolder(dir, t);
  }
  const name = createBackupName();
  zip.writeZip(path.join(BACKUP_DIR, name));
  const list = (await fs.readdir(BACKUP_DIR)).filter(f=>f.endsWith(".zip")).sort();
  if (list.length > 5) await fs.remove(path.join(BACKUP_DIR, list[0]));
}

app.post("/backup/run", async (_, res) => {
  await makeBackup();
  res.json({ ok: true });
});

app.get("/backup/list", async (_, res) => {
  const files = (await fs.readdir(BACKUP_DIR)).filter(f=>f.endsWith(".zip")).sort().reverse();
  res.json({ backups: files });
});

app.get("/backup/download/:file", async (req, res) => {
  const file = path.join(BACKUP_DIR, req.params.file);
  if (!await fs.pathExists(file)) return res.status(404).send("Not found");
  res.download(file);
});

const upload = multer({ dest: "uploads/" });
app.post("/backup/restore", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const zip = new AdmZip(filePath);
  const extractDir = WORK_DIR;
  await fs.ensureDir(extractDir);
  zip.extractAllTo(extractDir, true);
  await fs.remove(filePath);
  res.json({ restored: true });
});

if (process.env.AUTO_BACKUP === "true")
  cron.schedule("0 * * * *", () => makeBackup());

app.listen(5174, () => console.log("Backend running on port 5174"));
