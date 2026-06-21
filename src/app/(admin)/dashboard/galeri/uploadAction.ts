"use server";
import { createAdminClient } from '@insforge/sdk';
import fs from 'fs';
import path from 'path';

export async function uploadMediaAdmin(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file || !fileName) {
      return { error: "File or fileName missing" };
    }

    // Read the project API key from .insforge/project.json safely on the server
    const configPath = path.join(process.cwd(), '.insforge', 'project.json');
    let apiKey = '';
    try {
      const projectJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      apiKey = projectJson.api_key;
    } catch (e) {
      console.error("Could not read project.json", e);
      return { error: "Admin API Key not found on server" };
    }

    // Use Admin Client to bypass any RLS or Schema permission issues
    const adminClient = createAdminClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "https://itmbg4nj.ap-southeast.insforge.app",
      apiKey: apiKey,
    });

    // Next.js FormData File can cause 'Failed to fetch' in Node.js Undici fetch. 
    // Converting to Buffer bypasses this, as Buffer is handled natively by node fetch.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // @ts-ignore: We use Buffer instead of File/Blob to bypass Node.js fetch streaming issues
    const { data, error } = await adminClient.storage.from("galeri").upload(fileName, buffer);

    if (error) {
      console.error("Admin upload error:", error);
      return { error: error.message || JSON.stringify(error) };
    }

    // Return the URL and Key
    return { data };
  } catch (error: any) {
    console.error("Server Action Exception:", error);
    return { error: error?.message || "Unknown error occurred" };
  }
}
