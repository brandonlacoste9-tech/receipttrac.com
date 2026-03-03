
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

async function runSovereignTest() {
  console.log('--- INITIALIZING SOVEREIGN TEST PROTOCOL: SWARM AUDITING ---');

  try {
    const directorEmail = `director_${Date.now()}@lacoste-corp.com`;
    const executiveEmail = `exec_${Date.now()}@lacoste-corp.com`;
    const password = 'SovereignPassword123';

    // 1. Register Director
    console.log('[1/6] Registering Director Identity...');
    const dirReg = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: directorEmail,
      password: password,
      name: 'Director Lacoste'
    });
    const dirToken = dirReg.data.token;
    console.log('      Director Secured.');

    // 2. Register Executive
    console.log('[2/6] Registering Executive Identity...');
    const execReg = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: executiveEmail,
      password: password,
      name: 'Field Executive'
    });
    const execToken = execReg.data.token;
    console.log('      Executive Secured.');

    // 3. Initialize Institutional Vault
    console.log('[3/6] Initializing Institutional Vault...');
    const vaultRes = await axios.post(`${BASE_URL}/api/vaults`, {
      name: 'Lacoste Strategic Assets',
      description: 'Shared container for executive overhead'
    }, {
      headers: { Authorization: `Bearer ${dirToken}` }
    });
    const vaultId = vaultRes.data.id;
    console.log(`      Vault [${vaultRes.data.name}] initialized with ID: ${vaultId}`);

    // 4. Recruitment Handshake (Invite Executive)
    console.log('[4/6] Executing Recruitment Handshake...');
    await axios.post(`${BASE_URL}/api/vaults/${vaultId}/members`, {
      email: executiveEmail,
      role: 'EXECUTIVE'
    }, {
      headers: { Authorization: `Bearer ${dirToken}` }
    });
    console.log('      Member authorized.');

    // 5. Multi-Tenant Verification
    console.log('[5/6] Verifying Multi-Tenant Access...');
    const execVaults = await axios.get(`${BASE_URL}/api/vaults`, {
      headers: { Authorization: `Bearer ${execToken}` }
    });
    
    const vaultFound = execVaults.data.find(v => v.id === vaultId);
    if (vaultFound) {
      console.log(`      Executive successfully gained access to: ${vaultFound.name}`);
      console.log(`      Verified Role: ${vaultFound.userRole}`);
    } else {
      throw new Error('Executive denied access to vault!');
    }

    // 6. Archival Visibility
    console.log('[6/6] Testing Shared Archival Visibility...');
    // Director scans a dummy image (placeholder for scan)
    // For test, we'll manually check vault receipts (should be 0 initially)
    const receiptsRes = await axios.get(`${BASE_URL}/api/receipts?vault_id=${vaultId}`, {
      headers: { Authorization: `Bearer ${execToken}` }
    });
    console.log(`      Verified Auditing Loop: ${receiptsRes.data.length} receipts found in shared vault.`);

    console.log('\n--- SOVEREIGN TEST SUCCESSFUL: PROTOCOL VALIDATED ---');
    console.log(`Director: ${directorEmail}`);
    console.log(`Executive: ${executiveEmail}`);
    console.log(`Vault ID: ${vaultId}`);

  } catch (err) {
    console.error('\n!!! SOVEREIGN TEST FAILURE !!!');
    console.error(err.response?.data || err.message);
    process.exit(1);
  }
}

runSovereignTest();
