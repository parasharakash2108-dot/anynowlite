'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Agent, AgentWidgetConfig } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Eye } from 'lucide-react';

const llmModels = [
  'GPT-4.1',
  'GPT-4.1-mini',
  'Claude 3.5 Sonnet',
  'Claude 3.5 Haiku',
  'Llama 3.1',
  'Gemini 2.0',
];

const voices = ['Nova', 'Alloy', 'Verse', 'Callisto', 'Female', 'Male'];

const positions = [
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center', label: 'Center' },
];

const shapes = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'full', label: 'Full Circle' },
  { value: 'square', label: 'Square' },
];

const triggerStyles = [
  { value: 'icon', label: 'Icon' },
  { value: 'text', label: 'Text' },
  { value: 'bubble', label: 'Bubble' },
];

const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function AgentSetupClient() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.agentId as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [widgetConfig, setWidgetConfig] = useState<AgentWidgetConfig>({
    agent_id: agentId,
    position: 'bottom-right',
    color: '#3B82F6',
    shape: 'rounded',
    trigger_style: 'bubble',
    title_text: 'Chat with us',
    welcome_message: 'Hello! How can I help you today?',
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgent();
  }, [agentId]);

  const fetchAgent = async () => {
    const { data: agentData, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agentData) {
      alert('Agent not found');
      router.push('/dashboard/agents');
      return;
    }

    setAgent(agentData);

    const { data: configData } = await supabase
      .from('agent_widget_config')
      .select('*')
      .eq('agent_id', agentId)
      .maybeSingle();

    if (configData) {
      setWidgetConfig(configData);
    }

    setLoading(false);
  };

  const handleUpdateAgent = async (field: string, value: string) => {
    const { error } = await supabase
      .from('agents')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', agentId);

    if (error) {
      alert(error.message);
      return;
    }

    setAgent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleUpdateConfig = (field: keyof AgentWidgetConfig, value: string) => {
    setWidgetConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = async () => {
    const { data: existing } = await supabase
      .from('agent_widget_config')
      .select('agent_id')
      .eq('agent_id', agentId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('agent_widget_config')
        .update(widgetConfig)
        .eq('agent_id', agentId);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('agent_widget_config')
        .insert(widgetConfig);

      if (error) {
        alert(error.message);
        return;
      }
    }

    alert('Configuration saved successfully');
  };

  const handlePublish = async () => {
    await handleSaveConfig();
    await handleUpdateAgent('status', 'published');
    alert('Agent published successfully');
    router.push('/dashboard/agents');
  };

  if (loading || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/agents')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-gray-900">{agent.name}</h1>
          <Badge variant={agent.status === 'published' ? 'default' : 'secondary'}>
            {agent.status}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">Configure your agent settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>LLM Model Selection</CardTitle>
            <CardDescription>Choose the AI model for your agent</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={agent.llm_model}
              onValueChange={(value) => handleUpdateAgent('llm_model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {llmModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Voice Selection</CardTitle>
            <CardDescription>Choose the voice for your agent</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={agent.voice}
              onValueChange={(value) => handleUpdateAgent('voice', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice} value={voice}>
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Widget Configuration</CardTitle>
          <CardDescription>Customize the appearance and behavior of your widget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Widget Position</Label>
              <Select
                value={widgetConfig.position}
                onValueChange={(value: any) => handleUpdateConfig('position', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Widget Shape</Label>
              <Select
                value={widgetConfig.shape}
                onValueChange={(value: any) => handleUpdateConfig('shape', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shapes.map((shape) => (
                    <SelectItem key={shape.value} value={shape.value}>
                      {shape.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trigger Button Style</Label>
              <Select
                value={widgetConfig.trigger_style}
                onValueChange={(value: any) => handleUpdateConfig('trigger_style', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggerStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Widget Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleUpdateConfig('color', color)}
                    className={`w-10 h-10 rounded-lg transition-transform ${
                      widgetConfig.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title Text</Label>
            <Input
              id="title"
              value={widgetConfig.title_text}
              onChange={(e) => handleUpdateConfig('title_text', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome">Welcome Message</Label>
            <Textarea
              id="welcome"
              value={widgetConfig.welcome_message}
              onChange={(e) => handleUpdateConfig('welcome_message', e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSaveConfig} variant="outline" className="w-full">
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Agent Preview</CardTitle>
          <CardDescription>See how your agent will look to users</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setPreviewOpen(true)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Agent
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => router.push('/dashboard/agents')}>
          Cancel
        </Button>
        <Button onClick={handleSaveConfig} variant="outline">
          Save Draft
        </Button>
        <Button onClick={handlePublish}>
          Publish Agent
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-6 min-h-[400px] relative">
              <div
                className={`absolute ${
                  widgetConfig.position === 'bottom-left' ? 'bottom-4 left-4' :
                  widgetConfig.position === 'bottom-right' ? 'bottom-4 right-4' :
                  'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                }`}
              >
                <div
                  className={`w-16 h-16 shadow-lg flex items-center justify-center cursor-pointer text-white font-semibold ${
                    widgetConfig.shape === 'full' ? 'rounded-full' :
                    widgetConfig.shape === 'rounded' ? 'rounded-2xl' :
                    'rounded-lg'
                  }`}
                  style={{ backgroundColor: widgetConfig.color }}
                >
                  {widgetConfig.trigger_style === 'text' ? 'Chat' : '💬'}
                </div>
              </div>

              <div className="absolute bottom-24 right-4 bg-white rounded-xl shadow-xl p-4 w-80 max-h-96">
                <div className="border-b pb-3 mb-3">
                  <h3 className="font-semibold">{widgetConfig.title_text}</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-100 rounded-lg p-3 text-sm">
                    {widgetConfig.welcome_message}
                  </div>
                  <Input placeholder="Type a message..." />
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This is how your widget will appear on your website
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
