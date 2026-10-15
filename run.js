#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const rootDir = __dirname;
const envFile = path.join(rootDir, '.env');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

// Load environment variables from .env if present
const envVars = {};
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      envVars[key] = val;
    }
  }
}

const mergedEnv = { ...process.env, ...envVars };

console.log('\x1b[36m%s\x1b[0m', '═════════════════════════════════════════════════════════════════');
console.log('\x1b[33m%s\x1b[0m', '  🎴  Starting Solah Parchi Thap (Full Stack)...');
console.log('\x1b[32m%s\x1b[0m', '  ➜  Frontend : http://localhost:8000');
console.log('\x1b[35m%s\x1b[0m', '  ➜  Backend  : http://localhost:8080');
console.log('\x1b[90m%s\x1b[0m', '  Press Ctrl+C at any time to stop both servers.');
console.log('\x1b[36m%s\x1b[0m', '═════════════════════════════════════════════════════════════════\n');

function prefixStream(stream, prefix, colorCode) {
  if (!stream) return;
  let buffer = '';
  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${colorCode}${prefix}\x1b[0m ${line}`);
      }
    }
  });
}

const isWin = process.platform === 'win32';
const mvnCmd = isWin ? 'mvnw.cmd' : './mvnw';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Spawn Backend (Spring Boot)
const backendProc = spawn(isWin ? 'cmd.exe' : mvnCmd, isWin ? ['/c', mvnCmd, 'spring-boot:run'] : ['spring-boot:run'], {
  cwd: backendDir,
  env: mergedEnv,
  shell: isWin,
});
prefixStream(backendProc.stdout, '[BACKEND] ', '\x1b[35m');
prefixStream(backendProc.stderr, '[BACKEND] ', '\x1b[31m');

// Spawn Frontend (Vite)
const frontendProc = spawn(isWin ? 'cmd.exe' : npmCmd, isWin ? ['/c', npmCmd, 'run', 'dev'] : ['run', 'dev'], {
  cwd: frontendDir,
  env: mergedEnv,
  shell: isWin,
});
prefixStream(frontendProc.stdout, '[FRONTEND]', '\x1b[32m');
prefixStream(frontendProc.stderr, '[FRONTEND]', '\x1b[33m');

let cleaningUp = false;
function cleanup() {
  if (cleaningUp) return;
  cleaningUp = true;
  console.log('\n\x1b[33m🛑 Stopping all services...\x1b[0m');

  for (const proc of [backendProc, frontendProc]) {
    if (proc && proc.pid) {
      try {
        if (isWin) {
          execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
      } catch (err) {
        // Process might have already exited
      }
    }
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
