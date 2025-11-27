//a p  i// app/api/ci-integrations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";
import { XAxis } from "recharts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, status, webhookUrl } = body;

    if (!provider) {
      return NextResponse.json(
        { error: "provider is required" },
        { status: 400 }
      );
    }

    // dummy but stored in DB
    const { data, error } = await supabase
      .from("ci_integrations")
      .insert({
        provider,
        status: status ?? "connected",
        webhook_url: webhookUrl ?? null,
        last_sync: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error inserting CI integration", error);
      return NextResponse.json(
        { error: error?.message ?? "Failed to save CI integration" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in CI route", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
