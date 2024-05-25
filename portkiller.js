// Kills the specified port I have been using it to kill port

import { exec } from "child_process";

function killPort(port) {
  exec(`netstat -ano | findstr :${port}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error finding process on port ${port}: ${err.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error finding process on port ${port}: ${stderr}`);
      return;
    }

    const lines = stdout.trim().split('\n');
    if (lines.length > 0) {
      const parts = lines[0].trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error killing process ${pid}: ${err.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error killing process ${pid}: ${stderr}`);
          return;
        }
        console.log(`Successfully killed process ${pid} running on port ${port}`);
      });
    } else {
      console.log(`No process found running on port ${port}`);
    }
  });
}

// Usage
killPort(3000);
