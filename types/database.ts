export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type Prompt = {
  id: string;
  name: string;
  description: string;
  prompt_body: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type AgentType =
  | 'widget_text'
  | 'widget_voice'
  | 'widget_video'
  | 'whatsapp_text'
  | 'whatsapp_voice'
  | 'inbound'
  | 'outbound';

export type Agent = {
  id: string;
  name: string;
  type: AgentType;
  prompt_id: string | null;
  llm_model: string;
  voice: string;
  status: 'draft' | 'published';
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type AgentWidgetConfig = {
  agent_id: string;
  position: 'bottom-left' | 'bottom-right' | 'center';
  color: string;
  shape: 'rounded' | 'full' | 'square';
  trigger_style: 'icon' | 'text' | 'bubble';
  title_text: string;
  welcome_message: string;
};
