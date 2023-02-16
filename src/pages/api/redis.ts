import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
export const config = {
  runtime: "edge",
};

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function middleware(req: NextRequest) {
  const country = req.geo?.country || "fallback";

  const sameCountryVisits = await redis.incr(country);
  const totalVisits = await redis.incr("total");
  return NextResponse.json({
    message: `Hi from ${country}! You are visitor #${sameCountryVisits} from ${country} and visitor #${totalVisits} in total.`,
  });
}
