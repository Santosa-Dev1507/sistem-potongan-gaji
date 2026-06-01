import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Set root direktori proyek secara eksplisit agar Turbopack tidak salah
  // mendeteksi root karena ada multiple lockfiles di parent directory.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
