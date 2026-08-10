/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // You may need the following setting in newer Next.js versions if you
  // get the error "Cannot read properties of null (reading 'useContext')".
  transpilePackages: ["configcat-react"],
  turbopack: {
    root: "."
  }
};

export default nextConfig;
