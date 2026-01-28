import { NextResponse } from "next/server";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  tier: "basic" | "pro";
  lastLogin: string;
  city: string;
};

const USERS: Record<string, UserRecord> = {
  "u-1024": {
    id: "u-1024",
    name: "Demo Lin",
    email: "demo@bff.app",
    tier: "pro",
    lastLogin: "2026-01-27T18:42:00Z",
    city: "Taipei",
  },
  "u-2048": {
    id: "u-2048",
    name: "Celia Chen",
    email: "celia@bff.app",
    tier: "basic",
    lastLogin: "2026-01-25T09:12:00Z",
    city: "Taichung",
  },
  "u-4096": {
    id: "u-4096",
    name: "Wei Hsu",
    email: "wei@bff.app",
    tier: "pro",
    lastLogin: "2026-01-20T15:20:00Z",
    city: "Kaohsiung",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = USERS[params.id];

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: `找不到 ID 為 ${params.id} 的用戶`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "查詢成功",
    data: user,
  });
}
