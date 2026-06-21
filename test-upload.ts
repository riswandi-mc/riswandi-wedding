import { createAdminClient } from '@insforge/sdk';
import fs from 'fs';
import path from 'path';

async function testUpload() {
  const configPath = path.join(process.cwd(), '.insforge', 'project.json');
  let apiKey = '';
  try {
    const projectJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    apiKey = projectJson.api_key;
  } catch (e) {
    console.error("Could not read project.json", e);
    return;
  }

  const adminClient = createAdminClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "https://itmbg4nj.ap-southeast.insforge.app",
    apiKey: apiKey,
  });

  const buffer = Buffer.from('hello world');

  try {
    // @ts-ignore
    const { data, error } = await adminClient.storage.from("galeri").upload("test.txt", buffer);
    console.log("Upload result:", { data, error });
  } catch (err: any) {
    console.error("Caught exception:", err.message);
  }
}

testUpload();
