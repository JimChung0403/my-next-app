import { NextResponse } from "next/server";

type LoginPayload = {
  email?: string;
  password?: string;
};

const DEMO_USER = {
  id: "u-1024",
  name: "Demo Lin",
  email: "demo@bff.app",
  password: "password123",
  role: "member",
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginPayload;

  if (body.email === DEMO_USER.email && body.password === DEMO_USER.password) {
    return NextResponse.json({
      ok: true,
      message: "登入成功",
      data: {
        token: "mock-token-2026-01",
        user: {
          id: DEMO_USER.id,
          name: DEMO_USER.name,
          email: DEMO_USER.email,
          role: DEMO_USER.role,
        },
      },
    });
  }

  return NextResponse.json(
    {
      ok: false,
      message: "帳號或密碼錯誤",
    },
    { status: 401 }
  );
}
