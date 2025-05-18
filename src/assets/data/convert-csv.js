import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 修正 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取原始 CSV 檔案
const inputPath = path.join(__dirname, "Dodgers-Players-Database.csv"); // ← 放你的 CSV 檔
const outputPath = path.join(__dirname, "players1.json");

const csv = fs.readFileSync(inputPath, "utf-8");

// 拆解為陣列
const lines = csv.trim().split("\n");
const headers = lines[0].split(",");

const data = lines.slice(1).map((line) => {
  // 特殊處理：避免逗號被誤切割，使用 CSV 的 " 括號結構處理（簡化版）
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  const obj = {};
  headers.forEach((key, index) => {
    key = key.replace(/\r/g, ""); // ✅ 移除欄位名稱中的 \r

    let raw = values[index];
    let value = (typeof raw === "string" ? raw.replace(/\r/g, "") : raw) ?? "";

    if (key === "Achievements") {
      value = value ? value.split(",").map((s) => s.trim()) : [];
    }

    // 如果是圖片欄位，補完整路徑
    if (key === "Image_URL") {
      value = value ? `src/assets/images/players/${value}` : null;
    }

    obj[key] = value === "" ? null : value;
  });

  return obj;
});

// 寫入 JSON 檔案
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
console.log(`✅ 已轉換為 JSON，輸出到：${outputPath}`);
