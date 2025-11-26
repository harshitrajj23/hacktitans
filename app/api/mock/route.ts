import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get('projectId');
  const path = url.searchParams.get('path') || '/';

  if (!projectId) {
    return NextResponse.json(
      { error: 'projectId is required' },
      { status: 400 }
    );
  }

  // ensure path starts with "/"
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  console.log('Mock request:', { projectId, fullPath });

  const { data, error } = await supabase
    .from('endpoints')
    .select('*')
    .eq('project_id', projectId)
    .eq('path', fullPath)
    .single();

  if (error || !data) {
    console.error('Mock not found:', error);
    return NextResponse.json(
      { error: 'Mock endpoint not found', details: { projectId, fullPath } },
      { status: 404 }
    );
  }

  await new Promise((res) => setTimeout(res, 200));

  return NextResponse.json(data.response_json, {
    status: data.status_code ?? 200,
  });
}