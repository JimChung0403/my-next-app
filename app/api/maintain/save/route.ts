import { NextResponse } from "next/server";

type SavePayload = {
  A: string;
  B: string;
  CreateTime: string;
  UpdateTime: string;
  Feb: string;
  Geometry: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SavePayload;

  return NextResponse.json({
    code: 0,
    msg: "儲存成功",
    data: {
      id: `TL5-${Date.now()}`,
      ...body,
      savedAt: new Date().toISOString(),
    },
  });
}
