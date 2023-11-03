import fs from 'fs';

export function appendToFile(content: string) {
  // Use the 'appendFileSync' method to append content to the file
  try {
    fs.appendFileSync('./data.txt', content, 'utf8');
    console.log('Content has been appended to the file successfully.');
  } catch (err) {
    console.error('Error appending content to the file:', err);
  }
}