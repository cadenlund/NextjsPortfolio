import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/projects/Long-short-portfolio",
                destination: "/projects/market-neutral-price-compression-portfolio", // or a full URL if external
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
