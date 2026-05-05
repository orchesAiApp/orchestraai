-- Create executions table
CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'paused', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  input JSONB,
  output JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create execution_logs table
CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  input JSONB,
  output TEXT,
  error_message TEXT,
  duration INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow_versions table for versioning
CREATE TABLE workflow_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  name TEXT,
  description TEXT,
  nodes JSONB NOT NULL,
  connections JSONB NOT NULL,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for executions
CREATE POLICY "Users can view their own executions" ON executions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own executions" ON executions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own executions" ON executions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own executions" ON executions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for execution_logs
CREATE POLICY "Users can view logs for their executions" ON execution_logs
  FOR SELECT USING (
    execution_id IN (
      SELECT id FROM executions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert logs for their executions" ON execution_logs
  FOR INSERT WITH CHECK (
    execution_id IN (
      SELECT id FROM executions WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for workflow_versions
CREATE POLICY "Users can view their own workflow versions" ON workflow_versions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workflow versions" ON workflow_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view versions of their workflows" ON workflow_versions
  FOR SELECT USING (
    workflow_id IN (
      SELECT id FROM workflows WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX idx_executions_user_id ON executions(user_id);
CREATE INDEX idx_executions_status ON executions(status);
CREATE INDEX idx_execution_logs_execution_id ON execution_logs(execution_id);
CREATE INDEX idx_workflow_versions_workflow_id ON workflow_versions(workflow_id);
