-- Create agents table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('research', 'writing', 'coding', 'analysis', 'testing', 'custom')),
  status text not null default 'idle' check (status in ('idle', 'working', 'completed', 'error')),
  description text,
  capabilities text[] default array[]::text[],
  config jsonb default '{}',
  token_usage integer default 0,
  error_count integer default 0,
  success_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create workflows table
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed', 'archived')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  nodes jsonb default '[]',
  connections jsonb default '[]',
  config jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'queued', 'running', 'completed', 'failed', 'cancelled')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  estimated_time interval,
  actual_time interval,
  input jsonb default '{}',
  output jsonb default '{}',
  error_message text,
  retry_count integer default 0,
  scheduled_for timestamp with time zone,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create activity logs table
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  action text not null,
  details jsonb default '{}',
  duration integer,
  created_at timestamp with time zone default now()
);

-- Create agent library table for marketplace
create table if not exists public.agent_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  role text not null,
  version text default '1.0.0',
  is_public boolean default false,
  config jsonb default '{}',
  capabilities text[] default array[]::text[],
  downloads integer default 0,
  rating numeric(3,2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create webhooks table
create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete cascade,
  url text not null,
  event_type text not null check (event_type in ('task_started', 'task_completed', 'task_failed', 'workflow_started', 'workflow_completed', 'agent_error', 'custom')),
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create audit trail table
create table if not exists public.audit_trail (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity_type text,
  entity_id uuid,
  changes jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Create team_members table for collaboration
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.agents enable row level security;
alter table public.workflows enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_logs enable row level security;
alter table public.agent_library enable row level security;
alter table public.webhooks enable row level security;
alter table public.audit_trail enable row level security;
alter table public.team_members enable row level security;

-- RLS Policies for agents
create policy "Users can view their own agents"
  on public.agents for select
  using (auth.uid() = user_id);

create policy "Users can insert agents"
  on public.agents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own agents"
  on public.agents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own agents"
  on public.agents for delete
  using (auth.uid() = user_id);

-- RLS Policies for workflows
create policy "Users can view their own workflows"
  on public.workflows for select
  using (auth.uid() = user_id);

create policy "Users can insert workflows"
  on public.workflows for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workflows"
  on public.workflows for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workflows"
  on public.workflows for delete
  using (auth.uid() = user_id);

-- RLS Policies for tasks
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- RLS Policies for activity logs
create policy "Users can view their own activity logs"
  on public.activity_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert activity logs"
  on public.activity_logs for insert
  with check (auth.uid() = user_id);

-- RLS Policies for agent library
create policy "Users can view public agents and their own agents"
  on public.agent_library for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can insert agents"
  on public.agent_library for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own agents"
  on public.agent_library for update
  using (auth.uid() = user_id);

-- RLS Policies for webhooks
create policy "Users can view their own webhooks"
  on public.webhooks for select
  using (auth.uid() = user_id);

create policy "Users can insert webhooks"
  on public.webhooks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own webhooks"
  on public.webhooks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own webhooks"
  on public.webhooks for delete
  using (auth.uid() = user_id);

-- RLS Policies for audit trail
create policy "Users can view their own audit trail"
  on public.audit_trail for select
  using (auth.uid() = user_id);

create policy "Users can insert audit entries"
  on public.audit_trail for insert
  with check (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists agents_user_id_idx on public.agents(user_id);
create index if not exists agents_status_idx on public.agents(status);
create index if not exists workflows_user_id_idx on public.workflows(user_id);
create index if not exists workflows_status_idx on public.workflows(status);
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_workflow_id_idx on public.tasks(workflow_id);
create index if not exists tasks_agent_id_idx on public.tasks(agent_id);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at);
create index if not exists audit_trail_user_id_idx on public.audit_trail(user_id);
create index if not exists audit_trail_created_at_idx on public.audit_trail(created_at);
