import fs from 'fs';
import path from 'path';

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetch_failed_${res.status}`);
  return await res.json();
}

function esc(str) {
  return String(str || '').replace(/'/g, "''");
}

async function loadDataset() {
  const earthchie = 'https://raw.githubusercontent.com/earthchie/jquery.Thailand/master/jquery.Thailand.js/database/db.json';
  const kongvut = 'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json';
  try {
    const j = await fetchJson(earthchie);
    if (Array.isArray(j) && j.length > 1000) {
      return { type: 'earthchie', data: j };
    }
  } catch {}
  try {
    const j2 = await fetchJson(kongvut);
    if (Array.isArray(j2)) return { type: 'kongvut', data: j2 };
  } catch {}
  const localPath = path.join(process.cwd(), 'data', 'api_province_with_amphure_tambon.json');
  if (fs.existsSync(localPath)) {
    const raw = fs.readFileSync(localPath, 'utf8');
    const j3 = JSON.parse(raw);
    if (Array.isArray(j3)) return { type: 'kongvut', data: j3 };
  }
  throw new Error('dataset_unavailable');
}

function buildSqlFromEarthchie(rows) {
  const out = [];
  out.push("-- Thai address SQL generated from earthchie dataset");
  out.push("SET NAMES utf8mb4;");
  out.push("CREATE DATABASE IF NOT EXISTS thai_address CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
  out.push("USE thai_address;");
  out.push("DROP TABLE IF EXISTS tambons;");
  out.push("DROP TABLE IF EXISTS amphoes;");
  out.push("DROP TABLE IF EXISTS provinces;");
  out.push(`
CREATE TABLE provinces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_th VARCHAR(128) NOT NULL,
  UNIQUE KEY uk_province_name_th(name_th)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.trim());
  out.push(`
CREATE TABLE amphoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  province_id INT NOT NULL,
  name_th VARCHAR(128) NOT NULL,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  UNIQUE KEY uk_amphoe_prov_name(province_id, name_th)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.trim());
  out.push(`
CREATE TABLE tambons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amphoe_id INT NOT NULL,
  name_th VARCHAR(128) NOT NULL,
  zip_code VARCHAR(5) NOT NULL DEFAULT '',
  FOREIGN KEY (amphoe_id) REFERENCES amphoes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_tambon_amph_name(amphoe_id, name_th)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.trim());

  out.push("START TRANSACTION;");
  const provinces = Array.from(new Set(rows.map(r => r.province))).sort((a,b)=>a.localeCompare(b,'th'));
  out.push("-- Provinces");
  for (const p of provinces) {
    out.push(`INSERT IGNORE INTO provinces (name_th) VALUES ('${esc(p)}');`);
  }
  out.push("-- Amphoes");
  const amphSet = new Set();
  for (const r of rows) {
    const key = `${r.province}__${r.amphoe}`;
    if (amphSet.has(key)) continue;
    amphSet.add(key);
    out.push(`SET @prov_id := (SELECT id FROM provinces WHERE name_th='${esc(r.province)}');`);
    out.push(`INSERT IGNORE INTO amphoes (province_id, name_th) VALUES (@prov_id, '${esc(r.amphoe)}');`);
  }
  out.push("-- Tambons");
  const tambSet = new Set();
  for (const r of rows) {
    const key = `${r.province}__${r.amphoe}__${r.district}`;
    if (tambSet.has(key)) continue;
    tambSet.add(key);
    out.push(`SET @amph_id := (SELECT a.id FROM amphoes a JOIN provinces p ON a.province_id=p.id WHERE p.name_th='${esc(r.province)}' AND a.name_th='${esc(r.amphoe)}');`);
    out.push(`INSERT IGNORE INTO tambons (amphoe_id, name_th, zip_code) VALUES (@amph_id, '${esc(r.district)}', '${esc(r.zipcode)}');`);
  }
  out.push("COMMIT;");
  return out.join('\n');
}

function buildSqlFromKongvut(rows) {
  const out = [];
  out.push("-- Thai address SQL generated from kongvut dataset");
  out.push("SET NAMES utf8mb4;");
  out.push("CREATE DATABASE IF NOT EXISTS thai_address CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
  out.push("USE thai_address;");
  out.push("DROP TABLE IF EXISTS tambons;");
  out.push("DROP TABLE IF EXISTS amphoes;");
  out.push("DROP TABLE IF EXISTS provinces;");
  out.push(`
CREATE TABLE provinces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_th VARCHAR(128) NOT NULL,
  UNIQUE KEY uk_province_name_th(name_th)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.trim());
  out.push(`
CREATE TABLE amphoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  province_id INT NOT NULL,
  name_th VARCHAR(128) NOT NULL,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  UNIQUE KEY uk_amphoe_prov_name(province_id, name_th)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.trim());
  out.push(`
CREATE TABLE tambons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amphoe_id INT NOT NULL,
  name_th VARCHAR(128) NOT NULL,
  zip_code VARCHAR(5) NOT NULL DEFAULT '',
  FOREIGN KEY (amphoe_id) REFERENCES amphoes(id) ON DELETE CASCADE,
  UNIQUE KEY uk_tambon_amph_name(amphoe_id, name_th)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`.trim());
  out.push("START TRANSACTION;");
  out.push("-- Provinces");
  for (const p of rows) {
    const name = p?.name_th || p?.name || p?.province || '';
    if (!name) continue;
    out.push(`INSERT IGNORE INTO provinces (name_th) VALUES ('${esc(name)}');`);
  }
  out.push("-- Amphoes and Tambons");
  for (const p of rows) {
    const provName = p?.name_th || p?.name || p?.province || '';
    const amphures = p?.amphure || p?.amphures || [];
    if (!provName || !Array.isArray(amphures)) continue;
    out.push(`SET @prov_id := (SELECT id FROM provinces WHERE name_th='${esc(provName)}');`);
    for (const a of amphures) {
      const amphName = a?.name_th || a?.name || a?.amphure || '';
      if (!amphName) continue;
      out.push(`INSERT IGNORE INTO amphoes (province_id, name_th) VALUES (@prov_id, '${esc(amphName)}');`);
      out.push(`SET @amph_id := (SELECT id FROM amphoes WHERE province_id=@prov_id AND name_th='${esc(amphName)}');`);
      const tambons = a?.tambon || a?.district || a?.districts || [];
      if (Array.isArray(tambons)) {
        for (const t of tambons) {
          const tamName = t?.name_th || t?.name || t?.district || '';
          const zip = String(t?.zip_code || t?.zipcode || t?.post_code || '') || '';
          if (!tamName) continue;
          out.push(`INSERT IGNORE INTO tambons (amphoe_id, name_th, zip_code) VALUES (@amph_id, '${esc(tamName)}', '${esc(zip)}');`);
        }
      }
    }
  }
  out.push("COMMIT;");
  return out.join('\n');
}

async function main() {
  const { type, data } = await loadDataset();
  const sql = type === 'earthchie' ? buildSqlFromEarthchie(data) : buildSqlFromKongvut(data);
  const outPath = path.join(process.cwd(), 'data', 'thai_address_full.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log(`Generated SQL at ${outPath}`);
}

main().catch(err => {
  console.error('Failed to generate SQL:', err);
  process.exit(1);
});
