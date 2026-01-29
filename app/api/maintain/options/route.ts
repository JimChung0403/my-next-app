import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    code: 0,
    msg: "成功",
    data: {
      Feb: [1, 2, 3, 4, 5],
      Geometry: ["A", "B", "C"],
    },
  });
}
