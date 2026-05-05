import { env } from "$env/dynamic/private";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { redis } from "$lib/redis";
import type { DisplayCard } from "$lib/types/display-card";
import type { YGOCard } from "$lib/yugioh/types";

const YGO_API_BASE = "https://db.ygoprodeck.com/api/v7";
const R2_PUBLIC_URL = env.R2_PUBLIC_URL;

let r2: S3Client | null = null;
let bucket: string = "";

function getR2Client(): S3Client | null {
  if (r2) return r2;

  const endpoint = env.R2_ENDPOINT;
  const accessKey = env.R2_ACCESS_KEY_ID;
  const secretKey = env.R2_SECRET_ACCESS_KEY;
  bucket = env.R2_BUCKET_NAME || "";

  if (!endpoint || !accessKey || !secretKey || !bucket) {
    return null;
  }

  r2 = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey
    }
  });

  return r2;
}

export async function searchYGOCards(
  query: string | null,
  type: string = "",
  attribute: string = "",
  archetype: string = "",
  pageNumber = 1,
  pageSize = 20
): Promise<{ cards: DisplayCard[]; page: number; pageCount: number; cardCount: number }> {
  const allCards = await getAllCachedCards();

  let filtered = allCards;

  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }

  if (type) {
    filtered = filtered.filter((c) => c.type === type);
  }

  if (attribute) {
    filtered = filtered.filter((c) => c.attribute === attribute);
  }

  if (archetype) {
    filtered = filtered.filter((c) => c.archetype === archetype);
  }

  const cardCount = filtered.length;
  const pageCount = cardCount > 0 ? Math.ceil(cardCount / pageSize) : 0;
  const page = Math.min(pageNumber, Math.max(1, pageCount));
  const offset = (page - 1) * pageSize;
  const paginated = filtered.slice(offset, offset + pageSize);

  return {
    cards: paginated.map(toDisplayCard),
    page,
    pageCount,
    cardCount
  };
}

export async function getYGOCard(id: number): Promise<YGOCard | null> {
  const cached = await redis.get(`yugioh:card:${id}`);
  if (cached) {
    const card = JSON.parse(cached) as YGOCard;
    await ensureImageUploaded(card);
    return card;
  }

  const response = await fetch(`${YGO_API_BASE}/cardinfo.php?id=${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`YGOPRODeck card fetch failed: ${response.status}`);
  }

  const data = await response.json();
  const card = data.data[0] as YGOCard;
  await redis.set(`yugioh:card:${id}`, JSON.stringify(card), "EX", 86400 * 90);
  await uploadCardImages(card);
  return card;
}

export async function getAllCachedCards(): Promise<YGOCard[]> {
  const keys = await redis.keys("yugioh:card:[0-9]*");
  if (keys.length === 0) {
    return [];
  }

  const values = await redis.mget(...keys);
  return values
    .filter((v): v is string => v !== null)
    .map((v) => JSON.parse(v) as YGOCard)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getYGOTypes(): Promise<string[]> {
  const cached = await redis.get("yugioh-metadata:types");
  if (cached) return JSON.parse(cached);

  const types = [
    "Effect Monster",
    "Flip Effect Monster",
    "Flip Tuner Effect Monster",
    "Gemini Monster",
    "Normal Monster",
    "Normal Tuner Monster",
    "Pendulum Effect Monster",
    "Pendulum Effect Ritual Monster",
    "Pendulum Flip Effect Monster",
    "Pendulum Normal Monster",
    "Pendulum Tuner Effect Monster",
    "Ritual Effect Monster",
    "Ritual Monster",
    "Spell Card",
    "Spirit Monster",
    "Toon Monster",
    "Trap Card",
    "Tuner Monster",
    "Union Effect Monster",
    "Fusion Monster",
    "Link Monster",
    "Pendulum Effect Fusion Monster",
    "Synchro Monster",
    "Synchro Pendulum Effect Monster",
    "Synchro Tuner Monster",
    "XYZ Monster",
    "XYZ Pendulum Effect Monster",
    "Skill Card",
    "Token"
  ];

  await redis.set("yugioh-metadata:types", JSON.stringify(types), "EX", 86400 * 30);
  return types;
}

export async function getYGOAttributes(): Promise<string[]> {
  const cached = await redis.get("yugioh-metadata:attributes");
  if (cached) return JSON.parse(cached);

  const attributes = ["DARK", "EARTH", "FIRE", "LIGHT", "WATER", "WIND", "DIVINE"];
  await redis.set("yugioh-metadata:attributes", JSON.stringify(attributes), "EX", 86400 * 30);
  return attributes;
}

export async function getYGOArchetypes(): Promise<string[]> {
  const cached = await redis.get("yugioh-metadata:archetypes");
  if (cached) return JSON.parse(cached);

  const response = await fetch(`${YGO_API_BASE}/archetypes.php`);
  if (!response.ok) {
    throw new Error(`YGOPRODeck archetypes failed: ${response.status}`);
  }

  const data = await response.json();
  const archetypes = data.map((a: { archetype_name: string }) => a.archetype_name).sort();
  await redis.set("yugioh-metadata:archetypes", JSON.stringify(archetypes), "EX", 86400 * 30);
  return archetypes;
}

export function getCardImageUrl(card: YGOCard): string | undefined {
  if (!R2_PUBLIC_URL) {
    return card.card_images[0]?.image_url;
  }
  return `${R2_PUBLIC_URL}/cards/${card.id}.jpg`;
}

export function getCardImageUrlSmall(card: YGOCard): string | undefined {
  if (!R2_PUBLIC_URL) {
    return card.card_images[0]?.image_url_small;
  }
  return `${R2_PUBLIC_URL}/cards_small/${card.id}.jpg`;
}

async function uploadToR2(key: string, buffer: Buffer, contentType: string) {
  const client = getR2Client();
  if (!client) return;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType
    })
  );
}

async function uploadCardImages(card: YGOCard) {
  const client = getR2Client();
  if (!client) return;

  const imageUrl = card.card_images[0]?.image_url;
  const imageUrlSmall = card.card_images[0]?.image_url_small;

  if (imageUrl) {
    try {
      const buffer = await downloadImage(imageUrl);
      await uploadToR2(`cards/${card.id}.jpg`, buffer, "image/jpeg");
    } catch (err) {
      console.error(`Failed to upload image for card ${card.id}:`, err);
    }
  }

  if (imageUrlSmall) {
    try {
      const buffer = await downloadImage(imageUrlSmall);
      await uploadToR2(`cards_small/${card.id}.jpg`, buffer, "image/jpeg");
    } catch (err) {
      console.error(`Failed to upload small image for card ${card.id}:`, err);
    }
  }
}

async function ensureImageUploaded(card: YGOCard) {
  const client = getR2Client();
  if (!client) return;

  const uploadedKey = `yugioh-image-uploaded:${card.id}`;
  const alreadyUploaded = await redis.get(uploadedKey);
  if (alreadyUploaded) return;

  await uploadCardImages(card);
  await redis.set(uploadedKey, "1", "EX", 86400 * 90);
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function toDisplayCard(card: YGOCard): DisplayCard {
  return {
    id: card.id,
    name: card.name,
    image: getCardImageUrlSmall(card),
    text: card.desc,
    setName: card.card_sets?.[0]?.set_name
  };
}

// ── Bulk sync & update ──────────────────────────────────────────────

export async function syncAllCards(): Promise<void> {
  const lastSync = await redis.get("yugioh-metadata:synced_at");

  const allOldKeys = await redis.keys("yugioh-card:*");
  const oldCardKeys = allOldKeys.filter((k) => /^yugioh-card:\d+$/.test(k));

  if (oldCardKeys.length > 0) {
    console.log(`[YuGiOh] Migrating ${oldCardKeys.length} cards to new key format...`);
    await redis.del(...oldCardKeys);
    await redis.del("yugioh-metadata:synced_at");
  }

  if (lastSync && oldCardKeys.length === 0) {
    console.log("[YuGiOh] Already synced, skipping full sync.");
    return;
  }

  console.log("[YuGiOh] Starting full card sync...");

  let offset = 0;
  const pageSize = 10000;
  let total = 0;
  let processed = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${YGO_API_BASE}/cardinfo.php?num=${pageSize}&offset=${offset}`);

    if (!response.ok) {
      console.error(`[YuGiOh] API error: ${response.status}`);
      break;
    }

    const data = await response.json();
    const cards: YGOCard[] = data.data || [];

    if (cards.length === 0) break;

    if (total === 0) {
      total = data.meta?.total_rows || cards.length;
      console.log(`[YuGiOh] Total cards to sync: ${total}`);
    }

    const pipeline = redis.pipeline();

    for (const card of cards) {
      pipeline.set(`yugioh:card:${card.id}`, JSON.stringify(card), "EX", 86400 * 90);
      processed++;
    }

    await pipeline.exec();
    console.log(`[YuGiOh] Synced ${processed}/${total}`);

    hasMore = !!data.meta?.next_page;
    offset += pageSize;
  }

  await redis.set("yugioh-metadata:synced_at", new Date().toISOString(), "EX", 86400 * 90);

  console.log(`[YuGiOh] Full sync complete: ${processed} cards`);
}

export async function syncUpdates(): Promise<void> {
  const response = await fetch(`${YGO_API_BASE}/checkDBVer.php`);
  if (!response.ok) {
    console.error(`[YuGiOh] checkDBVer error: ${response.status}`);
    return;
  }

  const { database_version, date } = await response.json();
  const lastVersion = await redis.get("yugioh-metadata:db_version");
  const lastDate = await redis.get("yugioh-metadata:db_date");

  if (lastVersion === String(database_version) && lastDate === date) {
    return;
  }

  console.log(
    `[YuGiOh] Database changed (${lastVersion} -> ${database_version}), syncing updates...`
  );

  const offset = 0;
  const pageSize = 500;
  const newCards: YGOCard[] = [];
  let hasMore = true;
  let currentOffset = offset;

  while (hasMore) {
    const response = await fetch(
      `${YGO_API_BASE}/cardinfo.php?num=${pageSize}&offset=${currentOffset}&sort=new`
    );

    if (!response.ok) {
      console.error(`[YuGiOh] API error: ${response.status}`);
      break;
    }

    const data = await response.json();
    const cards: YGOCard[] = data.data || [];

    if (cards.length === 0) break;

    let hitExisting = false;
    for (const card of cards) {
      const exists = await redis.exists(`yugioh:card:${card.id}`);
      if (exists) {
        hitExisting = true;
        break;
      }
      newCards.push(card);
    }

    if (hitExisting) break;

    hasMore = !!data.meta?.next_page;
    currentOffset += pageSize;
  }

  if (newCards.length > 0) {
    const pipeline = redis.pipeline();
    for (const card of newCards) {
      pipeline.set(`yugioh:card:${card.id}`, JSON.stringify(card), "EX", 86400 * 90);
    }
    await pipeline.exec();
    console.log(`[YuGiOh] Merged ${newCards.length} new/updated cards`);
  }

  await redis.set("yugioh-metadata:db_version", String(database_version), "EX", 86400 * 90);
  await redis.set("yugioh-metadata:db_date", date, "EX", 86400 * 90);
}
