import { Resolver } from "node:dns/promises";

const DNS_SERVERS = ["8.8.8.8", "8.8.4.4", "1.1.1.1"];

let cachedResolvedUri: string | null = null;

function createResolver() {
  const resolver = new Resolver();
  resolver.setServers(DNS_SERVERS);
  return resolver;
}

/**
 * Converts mongodb+srv:// URIs to mongodb:// using explicit DNS resolution.
 * Avoids querySrv failures on Windows/residential networks where the default
 * resolver refuses SRV lookups.
 */
export async function resolveMongoUri(uri: string): Promise<string> {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  if (cachedResolvedUri) {
    return cachedResolvedUri;
  }

  const withoutScheme = uri.slice("mongodb+srv://".length);
  const atIndex = withoutScheme.lastIndexOf("@");
  const credsPart = atIndex >= 0 ? withoutScheme.slice(0, atIndex + 1) : "";
  const hostPart = atIndex >= 0 ? withoutScheme.slice(atIndex + 1) : withoutScheme;

  const queryIndex = hostPart.indexOf("?");
  const hostAndPath =
    queryIndex >= 0 ? hostPart.slice(0, queryIndex) : hostPart;
  const queryString = queryIndex >= 0 ? hostPart.slice(queryIndex + 1) : "";

  const slashIndex = hostAndPath.indexOf("/");
  const hostname =
    slashIndex >= 0 ? hostAndPath.slice(0, slashIndex) : hostAndPath;
  const dbPath = slashIndex >= 0 ? hostAndPath.slice(slashIndex) : "";

  const resolver = createResolver();
  const srvHost = `_mongodb._tcp.${hostname}`;

  const [srvRecords, txtRecords] = await Promise.all([
    resolver.resolveSrv(srvHost),
    resolver.resolveTxt(srvHost).catch(() => [] as string[][]),
  ]);

  const hosts = srvRecords
    .sort((a, b) => a.priority - b.priority || b.weight - a.weight)
    .map((record) => `${record.name}:${record.port}`)
    .join(",");

  const params = new URLSearchParams(queryString);

  for (const txtRecord of txtRecords.flat()) {
    for (const part of txtRecord.split("&")) {
      const [key, value] = part.split("=");
      if (key && !params.has(key)) {
        params.set(key, value ?? "");
      }
    }
  }

  if (!params.has("ssl")) {
    params.set("ssl", "true");
  }

  const query = params.toString();
  cachedResolvedUri = `mongodb://${credsPart}${hosts}${dbPath}${query ? `?${query}` : ""}`;

  return cachedResolvedUri;
}
