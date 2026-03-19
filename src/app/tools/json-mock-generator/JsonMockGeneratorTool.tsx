"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Field types ────────────────────────────────────────────────────────────

type FieldType =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "username"
  | "avatar"
  | "uuid"
  | "objectId"
  | "boolean"
  | "integer"
  | "float"
  | "price"
  | "date"
  | "datetime"
  | "timestamp"
  | "ipv4"
  | "ipv6"
  | "url"
  | "domain"
  | "color"
  | "hexColor"
  | "company"
  | "jobTitle"
  | "street"
  | "city"
  | "state"
  | "zip"
  | "country"
  | "latitude"
  | "longitude"
  | "paragraph"
  | "sentence"
  | "word"
  | "slug"
  | "customList"
  | "autoIncrement"
  | "nullValue";

interface FieldDef {
  id: string;
  name: string;
  type: FieldType;
  customValues?: string; // comma-separated for customList
}

interface FieldTypeInfo {
  label: string;
  group: string;
}

const FIELD_TYPES: Record<FieldType, FieldTypeInfo> = {
  firstName: { label: "First Name", group: "Person" },
  lastName: { label: "Last Name", group: "Person" },
  fullName: { label: "Full Name", group: "Person" },
  email: { label: "Email", group: "Person" },
  phone: { label: "Phone", group: "Person" },
  username: { label: "Username", group: "Person" },
  avatar: { label: "Avatar URL", group: "Person" },
  company: { label: "Company", group: "Person" },
  jobTitle: { label: "Job Title", group: "Person" },
  street: { label: "Street Address", group: "Location" },
  city: { label: "City", group: "Location" },
  state: { label: "State", group: "Location" },
  zip: { label: "Zip Code", group: "Location" },
  country: { label: "Country", group: "Location" },
  latitude: { label: "Latitude", group: "Location" },
  longitude: { label: "Longitude", group: "Location" },
  uuid: { label: "UUID", group: "ID" },
  objectId: { label: "ObjectId (Mongo)", group: "ID" },
  autoIncrement: { label: "Auto Increment", group: "ID" },
  integer: { label: "Integer", group: "Number" },
  float: { label: "Float", group: "Number" },
  price: { label: "Price ($)", group: "Number" },
  boolean: { label: "Boolean", group: "Number" },
  date: { label: "Date (YYYY-MM-DD)", group: "Date/Time" },
  datetime: { label: "DateTime (ISO)", group: "Date/Time" },
  timestamp: { label: "Unix Timestamp", group: "Date/Time" },
  ipv4: { label: "IPv4 Address", group: "Network" },
  ipv6: { label: "IPv6 Address", group: "Network" },
  url: { label: "URL", group: "Network" },
  domain: { label: "Domain", group: "Network" },
  color: { label: "Color Name", group: "Text" },
  hexColor: { label: "Hex Color", group: "Text" },
  paragraph: { label: "Paragraph", group: "Text" },
  sentence: { label: "Sentence", group: "Text" },
  word: { label: "Word", group: "Text" },
  slug: { label: "Slug", group: "Text" },
  customList: { label: "Custom List", group: "Other" },
  nullValue: { label: "Null", group: "Other" },
};

const FIELD_TYPE_GROUPS = [
  "Person",
  "Location",
  "ID",
  "Number",
  "Date/Time",
  "Network",
  "Text",
  "Other",
];

// ─── Data pools ─────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Lisa", "Daniel", "Nancy",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Dorothy", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna",
  "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
  "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
  "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Nicholas", "Amy",
];
const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter",
];
const DOMAINS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
  "protonmail.com", "fastmail.com", "zoho.com", "aol.com", "mail.com",
];
const COMPANIES = [
  "Acme Corp", "Globex Inc", "Initech", "Hooli", "Pied Piper", "Wayne Enterprises",
  "Stark Industries", "Umbrella Corp", "Cyberdyne Systems", "Soylent Corp",
  "Massive Dynamic", "Wonka Industries", "Sterling Cooper", "Dunder Mifflin",
  "TechNova", "InnovatePro", "DataStream", "CloudSync", "NetSphere", "CodeForge",
];
const JOB_TITLES = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "DevOps Engineer", "QA Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Technical Lead", "Engineering Manager", "CTO",
  "Marketing Manager", "Sales Director", "HR Specialist", "Business Analyst",
  "System Administrator", "Database Administrator", "Security Engineer", "ML Engineer",
];
const STREETS = [
  "123 Main St", "456 Oak Ave", "789 Pine Rd", "321 Elm Dr", "654 Maple Ln",
  "987 Cedar Blvd", "147 Birch Way", "258 Walnut Ct", "369 Spruce Pl", "741 Ash St",
  "852 Cherry Dr", "963 Willow Ave", "159 Poplar Rd", "357 Hickory Ln", "468 Cypress Blvd",
];
const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco",
  "Seattle", "Denver", "Nashville", "Portland", "Oklahoma City", "Las Vegas", "Memphis",
];
const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];
const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Australia",
  "Japan", "Brazil", "India", "Mexico", "Netherlands", "Sweden", "Norway",
  "Switzerland", "Spain", "Italy", "South Korea", "Singapore", "New Zealand", "Ireland",
];
const COLORS = [
  "red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan",
  "magenta", "teal", "indigo", "violet", "crimson", "coral", "salmon",
  "turquoise", "navy", "maroon", "olive", "aqua",
];
const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "tempor", "incididunt", "labore", "dolore", "magna", "aliqua", "enim",
  "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
  "nisi", "aliquip", "commodo", "consequat", "duis", "aute", "irure",
  "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "proident", "sunt",
  "culpa", "officia", "deserunt", "mollit", "anim", "est",
];
const TLDS = [".com", ".io", ".dev", ".org", ".net", ".co", ".app"];

// ─── Random helpers ─────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateObjectId(): string {
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += Math.floor(Math.random() * 16).toString(16);
  }
  return id;
}

function generateHexColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

function randomDate(): string {
  const start = new Date(2020, 0, 1).getTime();
  const end = new Date(2026, 11, 31).getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().split("T")[0];
}

function randomDatetime(): string {
  const start = new Date(2020, 0, 1).getTime();
  const end = new Date(2026, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
}

function randomTimestamp(): number {
  const start = new Date(2020, 0, 1).getTime() / 1000;
  const end = new Date(2026, 11, 31).getTime() / 1000;
  return Math.floor(start + Math.random() * (end - start));
}

function randomIPv4(): string {
  return `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

function randomIPv6(): string {
  const parts: string[] = [];
  for (let i = 0; i < 8; i++) {
    parts.push(randInt(0, 0xffff).toString(16).padStart(4, "0"));
  }
  return parts.join(":");
}

function randomSentence(): string {
  const len = randInt(6, 14);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(pick(WORDS));
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function randomParagraph(): string {
  const count = randInt(3, 6);
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) sentences.push(randomSentence());
  return sentences.join(" ");
}

function randomPhone(): string {
  return `(${randInt(200, 999)}) ${randInt(200, 999)}-${randInt(1000, 9999)}`;
}

// ─── Generate a single field value ──────────────────────────────────────────

function generateFieldValue(
  field: FieldDef,
  index: number,
): unknown {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);

  switch (field.type) {
    case "firstName":
      return firstName;
    case "lastName":
      return lastName;
    case "fullName":
      return `${firstName} ${lastName}`;
    case "email":
      return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 999)}@${pick(DOMAINS)}`;
    case "phone":
      return randomPhone();
    case "username":
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randInt(1, 99)}`;
    case "avatar":
      return `https://i.pravatar.cc/150?u=${generateUUID()}`;
    case "uuid":
      return generateUUID();
    case "objectId":
      return generateObjectId();
    case "autoIncrement":
      return index + 1;
    case "boolean":
      return Math.random() > 0.5;
    case "integer":
      return randInt(1, 10000);
    case "float":
      return randFloat(0, 1000, 2);
    case "price":
      return randFloat(0.99, 999.99, 2);
    case "date":
      return randomDate();
    case "datetime":
      return randomDatetime();
    case "timestamp":
      return randomTimestamp();
    case "ipv4":
      return randomIPv4();
    case "ipv6":
      return randomIPv6();
    case "url":
      return `https://${pick(WORDS)}${pick(TLDS)}/${pick(WORDS)}`;
    case "domain":
      return `${pick(WORDS)}${pick(TLDS)}`;
    case "color":
      return pick(COLORS);
    case "hexColor":
      return generateHexColor();
    case "company":
      return pick(COMPANIES);
    case "jobTitle":
      return pick(JOB_TITLES);
    case "street":
      return pick(STREETS);
    case "city":
      return pick(CITIES);
    case "state":
      return pick(STATES);
    case "zip":
      return String(randInt(10000, 99999));
    case "country":
      return pick(COUNTRIES);
    case "latitude":
      return randFloat(-90, 90, 6);
    case "longitude":
      return randFloat(-180, 180, 6);
    case "paragraph":
      return randomParagraph();
    case "sentence":
      return randomSentence();
    case "word":
      return pick(WORDS);
    case "slug":
      return `${pick(WORDS)}-${pick(WORDS)}-${pick(WORDS)}`;
    case "customList": {
      const values = (field.customValues || "a,b,c")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      return values.length > 0 ? pick(values) : null;
    }
    case "nullValue":
      return null;
  }
}

// ─── Templates ──────────────────────────────────────────────────────────────

interface Template {
  label: string;
  fields: Omit<FieldDef, "id">[];
}

const TEMPLATES: Template[] = [
  {
    label: "Users",
    fields: [
      { name: "id", type: "uuid" },
      { name: "firstName", type: "firstName" },
      { name: "lastName", type: "lastName" },
      { name: "email", type: "email" },
      { name: "phone", type: "phone" },
      { name: "avatar", type: "avatar" },
      { name: "company", type: "company" },
      { name: "jobTitle", type: "jobTitle" },
      { name: "createdAt", type: "datetime" },
    ],
  },
  {
    label: "Products",
    fields: [
      { name: "id", type: "autoIncrement" },
      { name: "name", type: "sentence" },
      { name: "slug", type: "slug" },
      { name: "price", type: "price" },
      { name: "category", type: "customList", customValues: "Electronics,Clothing,Books,Home,Sports,Toys" },
      { name: "inStock", type: "boolean" },
      { name: "rating", type: "float" },
      { name: "createdAt", type: "date" },
    ],
  },
  {
    label: "Orders",
    fields: [
      { name: "orderId", type: "uuid" },
      { name: "customerName", type: "fullName" },
      { name: "email", type: "email" },
      { name: "total", type: "price" },
      { name: "status", type: "customList", customValues: "pending,processing,shipped,delivered,cancelled" },
      { name: "shippingCity", type: "city" },
      { name: "shippingState", type: "state" },
      { name: "orderDate", type: "datetime" },
    ],
  },
  {
    label: "Blog Posts",
    fields: [
      { name: "id", type: "autoIncrement" },
      { name: "title", type: "sentence" },
      { name: "slug", type: "slug" },
      { name: "author", type: "fullName" },
      { name: "body", type: "paragraph" },
      { name: "tags", type: "customList", customValues: "javascript,react,nodejs,python,devops,css" },
      { name: "published", type: "boolean" },
      { name: "publishedAt", type: "datetime" },
    ],
  },
  {
    label: "Todos",
    fields: [
      { name: "id", type: "autoIncrement" },
      { name: "title", type: "sentence" },
      { name: "completed", type: "boolean" },
      { name: "priority", type: "customList", customValues: "low,medium,high,urgent" },
      { name: "assignee", type: "fullName" },
      { name: "dueDate", type: "date" },
    ],
  },
  {
    label: "Addresses",
    fields: [
      { name: "id", type: "uuid" },
      { name: "name", type: "fullName" },
      { name: "street", type: "street" },
      { name: "city", type: "city" },
      { name: "state", type: "state" },
      { name: "zip", type: "zip" },
      { name: "country", type: "country" },
      { name: "latitude", type: "latitude" },
      { name: "longitude", type: "longitude" },
    ],
  },
];

// ─── Unique ID counter ──────────────────────────────────────────────────────

let fieldIdCounter = 0;
function nextFieldId(): string {
  return `field_${++fieldIdCounter}`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function JsonMockGeneratorTool() {
  const [fields, setFields] = useState<FieldDef[]>(() =>
    TEMPLATES[0].fields.map((f) => ({ ...f, id: nextFieldId() })),
  );
  const [count, setCount] = useState(10);
  const [output, setOutput] = useState("");
  const [compact, setCompact] = useState(false);
  const [wrapRoot, setWrapRoot] = useState<"array" | "object">("array");
  const [rootKey, setRootKey] = useState("data");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const { trackAction } = useToolAnalytics("json-mock-generator");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("json-mock-generator");

  const handleGenerate = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);

    if (fields.length === 0) {
      setError("Add at least one field to generate data.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction("generate");

    try {
      const rows: Record<string, unknown>[] = [];
      for (let i = 0; i < count; i++) {
        const row: Record<string, unknown> = {};
        for (const field of fields) {
          row[field.name] = generateFieldValue(field, i);
        }
        rows.push(row);
      }

      const data = wrapRoot === "object" ? { [rootKey]: rows } : rows;
      setOutput(JSON.stringify(data, null, compact ? 0 : 2));
    } catch {
      setError("Failed to generate data. Check your field configuration.");
    }
  }, [fields, count, compact, wrapRoot, rootKey, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleGenerate);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mock-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addField() {
    setFields((prev) => [
      ...prev,
      { id: nextFieldId(), name: "newField", type: "word" },
    ]);
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function updateField(id: string, updates: Partial<FieldDef>) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
  }

  function moveField(id: string, direction: -1 | 1) {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }

  function loadTemplate(tpl: Template) {
    setFields(tpl.fields.map((f) => ({ ...f, id: nextFieldId() })));
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON Mock Data Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate realistic fake JSON data for API testing and prototyping. Define
        your schema with 30+ field types, use preset templates, and download the
        result.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Templates */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Templates
        </label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => loadTemplate(tpl)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schema builder */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Schema ({fields.length} field{fields.length !== 1 ? "s" : ""})
          </label>
          <button
            onClick={addField}
            className="rounded border border-indigo-300 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors"
          >
            + Add Field
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveField(field.id, -1)}
                  disabled={idx === 0}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:text-gray-500 dark:hover:text-gray-300"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveField(field.id, 1)}
                  disabled={idx === fields.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:text-gray-500 dark:hover:text-gray-300"
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              {/* Field name */}
              <input
                type="text"
                value={field.name}
                onChange={(e) =>
                  updateField(field.id, { name: e.target.value })
                }
                placeholder="fieldName"
                className="w-36 rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:w-44"
              />

              {/* Field type */}
              <select
                value={field.type}
                onChange={(e) =>
                  updateField(field.id, { type: e.target.value as FieldType })
                }
                className="flex-1 min-w-0 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {FIELD_TYPE_GROUPS.map((group) => (
                  <optgroup key={group} label={group}>
                    {(Object.entries(FIELD_TYPES) as [FieldType, FieldTypeInfo][])
                      .filter(([, info]) => info.group === group)
                      .map(([type, info]) => (
                        <option key={type} value={type}>
                          {info.label}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>

              {/* Custom values input */}
              {field.type === "customList" && (
                <input
                  type="text"
                  value={field.customValues || ""}
                  onChange={(e) =>
                    updateField(field.id, { customValues: e.target.value })
                  }
                  placeholder="val1, val2, val3"
                  className="w-36 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:w-44"
                />
              )}

              {/* Remove */}
              <button
                onClick={() => removeField(field.id)}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
                title="Remove field"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-600">
            No fields defined. Add a field or choose a template.
          </p>
        )}
      </div>

      {/* Options */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Rows:
          </label>
          <input
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) =>
              setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))
            }
            className="w-20 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          Compact output
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Root:
          </label>
          <select
            value={wrapRoot}
            onChange={(e) =>
              setWrapRoot(e.target.value as "array" | "object")
            }
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value="array">Array [ ]</option>
            <option value="object">Object {"{ }"}</option>
          </select>
        </div>

        {wrapRoot === "object" && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Key:
            </label>
            <input
              type="text"
              value={rootKey}
              onChange={(e) => setRootKey(e.target.value)}
              className="w-24 rounded border border-gray-300 bg-white px-2 py-1.5 font-mono text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isLimited || fields.length === 0}
        className="mb-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
      >
        Generate {count} Row{count !== 1 ? "s" : ""}{" "}
        <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
          Ctrl+Enter
        </kbd>
      </button>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Generated JSON
              </label>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {count} record{count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .json
              </button>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Field type reference */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Available Field Types
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
          {FIELD_TYPE_GROUPS.map((group) => (
            <div key={group}>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 dark:text-gray-400">
                {group}
              </h3>
              <ul className="space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
                {(Object.entries(FIELD_TYPES) as [FieldType, FieldTypeInfo][])
                  .filter(([, info]) => info.group === group)
                  .map(([, info]) => (
                    <li key={info.label}>{info.label}</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON Mock Data
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Generate up to 500 rows of realistic fake data for API testing and
            prototyping.
          </li>
          <li>
            Choose from 6 preset templates: Users, Products, Orders, Blog Posts,
            Todos, and Addresses.
          </li>
          <li>
            Custom List fields let you define your own enum values (comma-separated).
          </li>
          <li>
            Wrap output in an array or an object with a custom key name.
          </li>
          <li>
            Download as .json or copy to clipboard for use in Postman, fetch
            calls, or test fixtures.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
