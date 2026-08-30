import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://thbsqxhxlaoksxugpxcw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYnNxeGh4bGFva3N4dWdweGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDc5OTMsImV4cCI6MjEwMzI4Mzk5M30.8B0dQWESM-K00T64rx13sHmw4LpSHMX51aqgs86X7mI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFiles() {
  const folderPath = path.resolve('manager_photos/Desta');
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `Desta/${file}`;

    console.log(`Uploading ${file} to Supabase Storage bucket 'manager_photos' as ${storagePath}...`);

    const { data, error } = await supabase.storage
      .from('manager_photos')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading ${file}:`, error);
    } else {
      console.log(`Successfully uploaded ${file}:`, data);
      const { data: publicUrlData } = supabase.storage
        .from('manager_photos')
        .getPublicUrl(storagePath);
      console.log(`Public URL: ${publicUrlData.publicUrl}`);
    }
  }
}

uploadFiles();
