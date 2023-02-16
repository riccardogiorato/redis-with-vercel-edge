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

// Create a Redis client outside of the function
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function middleware(req: NextRequest) {
  const country = req.geo?.country || "fallback";

  // Increment the country counter
  const sameCountryVisits = await redis.incr(country);
  // Increment the total counter
  const totalVisits = await redis.incr("total");

  const countryEmoji = country !== "fallback" ? getFlagEmoji(country) : "";
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  return NextResponse.json({
    sameCountryVisits,
    totalVisits,
    countryEmoji,
    countryName: regionNames.of(country),
  });
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
