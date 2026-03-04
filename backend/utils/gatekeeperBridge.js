import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * SOVEREIGN BRIDGE: Node.js -> OpenManus (Python)
 * Connects the Executive Vault to the Agentic Reasoning Engine.
 */
class GatekeeperBridge {
  constructor() {
    this.openmanusPath = path.join(__dirname, "..", "..", "..", "openmanus");
    this.findingsPath = path.join(
      __dirname,
      "..",
      "vault_guard",
      "security_findings.md",
    );
    this.auditPlanPath = path.join(
      __dirname,
      "..",
      "vault_guard",
      "vault_audit.md",
    );
  }

  async runSovereignAudit(receiptsContext) {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const auditPrompt = `
        PROTOCOL: SOVEREIGN_VAULT_AUDIT v2.0
        CONTEXT: ${JSON.stringify(receiptsContext)}
        INSTRUCTIONS:
        1. Review the provided receipts for merchant risk rank.
        2. Detect jurisdictional tax anomalies (GST/QST/HST/USA).
        3. Consult 'security-auditor' knowledge for PCI-DSS compliance risks.
        4. Append your 'Thinking' trace and findings to ${this.findingsPath}.
        5. Mark current phase in ${this.auditPlanPath} if complete.
        6. END with 'AUDIT_FINALIZED_BY_GATEKEEPER'.
      `;

      // Log startup to findings
      fs.appendFileSync(
        this.findingsPath,
        `\n\n### 🧬 Sovereign Audit Session: ${now}\n- *Initializing OpenManus Reasoning Engine...*`,
      );

      // Spawn the OpenManus CLI
      // Use python3 if python is not found
      const pythonExe = process.platform === "win32" ? "python" : "python3";
      const pythonProcess = spawn(
        pythonExe,
        ["main.py", "--prompt", auditPrompt],
        {
          cwd: this.openmanusPath,
        },
      );

      let outputTrace = "";

      pythonProcess.stdout.on("data", (data) => {
        const chunk = data.toString();
        outputTrace += chunk;
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`[GATEKEEPER_BRIDGE] Error: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          const finalLog = `\n- **AUDIT_COMPLETE**: Process exited with code ${code}. Findings synchronized.`;
          fs.appendFileSync(this.findingsPath, finalLog);
          resolve({ success: true, trace: outputTrace });
        } else {
          fs.appendFileSync(
            this.findingsPath,
            `\n- **AUDIT_FAILED**: Process exited with code ${code}. Memory unstable.`,
          );
          reject(new Error(`Audit process failed with code ${code}`));
        }
      });
    });
  }
}

export default new GatekeeperBridge();
