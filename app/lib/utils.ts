import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import type { toLowerCase } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMMM DD, YYYY");
};

export function parseMarkdownToJson(markdownText: string): unknown | null {
  const regex = /```json\n([\s\S]+?)\n```/;
  const match = markdownText.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }
  console.error("No valid JSON found in markdown text.");
  return null;
}

// export function parseTripData(jsonString: string): Post | null {
//   try {
//     const data: Post = JSON.parse(jsonString);


//     return data;
//   } catch (error) {
//     console.error("Failed to parse trip data:", error);
//     return null;
//   }
// }

export const parseTripData = (row: any) => {
  if (!row) return null;

  try {
    // parse the JSON string stored in row.postDetails
    const parsed = JSON.parse(row.postDetails || "{}");
    return {
      id: row.$id,
      createdAt: row.$createdAt,
      updatedAt: row.$updatedAt,
      ...parsed,
      raw: row,  //
    };
  } catch (err) {
    console.error("Failed to parse row.postDetails:", err);
    return { 
      id: row.$id,
      createdAt: row.$createdAt,
      updatedAt: row.$updateAt,
       postDetails: "",
       raw: row,

      
      };
  }
};

export function getFirstWord(input: string = ""): string {
  return input.trim().split(/\s+/)[0] || "";
}

export const calculateTrendPercentage = (
  countOfThisMonth: number,
  countOfLastMonth: number
): TrendResult => {
  if (countOfLastMonth === 0) {
    return countOfThisMonth === 0
      ? { trend: "no change", percentage: 0 }
      : { trend: "increment", percentage: 100 };
  }

  const change = countOfThisMonth - countOfLastMonth;
  const percentage = Math.abs((change / countOfLastMonth) * 100);

  if (change > 0) {
    return { trend: "increment", percentage };
  } else if (change < 0) {
    return { trend: "decrement", percentage };
  } else {
    return { trend: "no change", percentage: 0 };
  }
};

export const formatKey = (key: keyof TripFormData) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export const getTagIcons = (tagname: string) => {
  const normalizedTagName = tagname.replace(/[ .]/g,"").toLowerCase();

  const tagMap:{[key: string]: string} = {
    hambericho: "/assets/icons/hambericho777.png",
    777 : "/assets/icons/hambericho777.png",
    ajora: "/assets/icons/agora.png",
    memories: "/assets/icons/memories.svg",
    visitkembata: "/assets/icons/visitkembata.png",
    kembata: "/assets/icons/visitkembata.png",
    tourism: "/assets/icons/visitkembata.png",
    visit: "/assets/icons/memories.png",
    capture: "/assets/icons/capture.png",
    waterfall: "/assets/icons/ajora.png",
    mountain: "/assets/icons/hambericho777.png"
  }

  return tagMap[normalizedTagName] ?  `${tagMap[normalizedTagName]}` : "/assets/icons/visitkembata.png"
}

export const formatDateCgt = (isoString: string, locale: string = "en-US") => {
  if (!isoString) return "";

  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",   // "September"
      day: "numeric",  // "30"
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (err) {
    console.error("Invalid date string:", isoString, err);
    return isoString;
  }
};

// ~/lib/utils.ts
export const timeAgo = (isoString: string, locale: string = "en-US") => {
  if (!isoString) return "";

  const now = new Date();
  const past = new Date(isoString);

  const diffInSeconds = Math.floor((past.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "second" },   // 60 seconds = 1 minute
    { amount: 60, unit: "minute" },   // 60 minutes = 1 hour
    { amount: 24, unit: "hour" },     // 24 hours = 1 day
    { amount: 7, unit: "day" },       // 7 days = 1 week
    { amount: 4.34524, unit: "week" }, // ~4.3 weeks = 1 month
    { amount: 12, unit: "month" },    // 12 months = 1 year
  ];

  let duration = diffInSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return rtf.format(Math.round(duration), "year");
};


