import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Automatically sync images from root `images/` into `public/images/` on config load
try {
  const rootImages = path.resolve(__dirname, 'images');
  const publicImages = path.resolve(__dirname, 'public/images');
  if (fs.existsSync(rootImages)) {
    copyDirSync(rootImages, publicImages);
  }
} catch (e) {
  console.warn('Image sync notice:', e);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-root-images',
      buildStart() {
        const rootImages = path.resolve(__dirname, 'images');
        const publicImages = path.resolve(__dirname, 'public/images');
        if (fs.existsSync(rootImages)) {
          copyDirSync(rootImages, publicImages);
        }
      },
      generateBundle() {
        // Emit image files directly into dist/images/ in the bundle
        const emitRecursive = (src, folderName) => {
          if (!fs.existsSync(src)) return;
          const entries = fs.readdirSync(src, { withFileTypes: true });
          for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const targetFileName = `${folderName}/${entry.name}`;
            if (entry.isDirectory()) {
              emitRecursive(srcPath, targetFileName);
            } else {
              this.emitFile({
                type: 'asset',
                fileName: targetFileName,
                source: fs.readFileSync(srcPath)
              });
            }
          }
        };
        const rootImages = path.resolve(__dirname, 'images');
        if (fs.existsSync(rootImages)) {
          emitRecursive(rootImages, 'images');
        }
      }
    }
  ],
})

