import { NextResponse } from "next/server";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterPayload;

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      {
        ok: false,
        message: "欄位不完整",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "註冊成功",
    data: {
      id: "u-2048",
      name: body.name,
      email: body.email,
      createdAt: "2026-01-28T12:00:00Z",
      plan: "trial",
    },
  });
}
