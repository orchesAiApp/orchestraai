import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') || '100'
    const agentId = searchParams.get('agentId')

    let query = supabase.from('activity_logs').select('*').eq('workspace_id', user.id)

    if (agentId) {
      query = query.eq('agent_id', agentId)
    }

    const { data: activities, error } = await query
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) throw error

    return NextResponse.json(activities)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data: activity, error } = await supabase
      .from('activity_logs')
      .insert({
        workspace_id: user.id,
        agent_id: body.agent_id,
        workflow_id: body.workflow_id,
        action_type: body.action_type,
        description: body.description,
        metadata: body.metadata || {},
        status: body.status || 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(activity)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
