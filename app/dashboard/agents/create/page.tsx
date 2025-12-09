'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Prompt } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

const agentTypeLabels: Record<string, string> = {
  widget_text: 'Widget Text',
  widget_voice: 'Widget Voice',
  widget_video: 'Widget Video',
  whatsapp_text: 'WhatsApp Text',
  whatsapp_voice: 'WhatsApp Voice',
  inbound: 'Inbound',
  outbound: 'Outbound',
};

export default function CreateAgentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'widget_text';
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    prompt_id: '',
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      setPrompts(data);
    }
  };

  const handleContinue = async () => {
    if (!formData.name || !formData.prompt_id) {
      alert('Please fill in all fields');
      return;
    }

    const { data, error } = await supabase
      .from('agents')
      .insert({
        name: formData.name,
        type,
        prompt_id: formData.prompt_id,
        user_id: '00000000-0000-0000-0000-000000000000',
        status: 'draft',
      })
      .select()
      .maybeSingle();

    const agent = data;

    if (error) {
      alert(error.message);
      return;
    }

    if (agent) {
      router.push(`/dashboard/agents/setup/${agent.id}`);
    }
  };

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
          <h1 className="text-3xl font-semibold text-gray-900">Create New Agent</h1>
          <Badge variant="secondary" className="text-sm">
            {agentTypeLabels[type] || type}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">Configure your agent details to get started</p>
      </div>

      <Card className="max-w-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
          <CardDescription>Set up the basic details for your new agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Customer Support Agent"
            />
            <p className="text-sm text-muted-foreground">
              Give your agent a descriptive name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Select
              value={formData.prompt_id}
              onValueChange={(value) => setFormData({ ...formData, prompt_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                {prompts.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No prompts available. Create one first.
                  </div>
                ) : (
                  prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose the prompt that defines your agent's behavior
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/agents')}
            >
              Cancel
            </Button>
            <Button onClick={handleContinue}>
              Continue to Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
