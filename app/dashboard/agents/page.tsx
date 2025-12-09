'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Agent } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Phone, Video, MessageCircle, PhoneCall, ArrowDownUp, ArrowUpDown } from 'lucide-react';

const agentTypes = [
  { value: 'widget_text', label: 'Widget Text', icon: MessageSquare },
  { value: 'widget_voice', label: 'Widget Voice', icon: Phone },
  { value: 'widget_video', label: 'Widget Video', icon: Video },
  { value: 'whatsapp_text', label: 'WhatsApp Text', icon: MessageCircle },
  { value: 'whatsapp_voice', label: 'WhatsApp Voice', icon: PhoneCall },
  { value: 'inbound', label: 'Inbound', icon: ArrowDownUp },
  { value: 'outbound', label: 'Outbound', icon: ArrowUpDown },
];

export default function AgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAgents(data);
    }
    setLoading(false);
  };

  const handleCreateAgent = (type: string) => {
    router.push(`/dashboard/agents/create?type=${type}`);
  };

  const getAgentTypeLabel = (type: string) => {
    const agentType = agentTypes.find(t => t.value === type);
    return agentType?.label || type;
  };

  const getAgentTypeIcon = (type: string) => {
    const agentType = agentTypes.find(t => t.value === type);
    const Icon = agentType?.icon || MessageSquare;
    return Icon;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Agents</h1>
          <p className="text-muted-foreground mt-1">Manage and create your automation agents</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {agentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <DropdownMenuItem
                  key={type.value}
                  onClick={() => handleCreateAgent(type.value)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.length === 0 ? (
            <Card className="col-span-full shadow-sm">
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No agents found. Create your first agent to get started.</p>
              </CardContent>
            </Card>
          ) : (
            agents.map((agent) => {
              const Icon = getAgentTypeIcon(agent.type);
              return (
                <Card key={agent.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/agents/setup/${agent.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription>{getAgentTypeLabel(agent.type)}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={agent.status === 'published' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </div>
                      {agent.llm_model && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Model</span>
                          <span className="font-medium">{agent.llm_model}</span>
                        </div>
                      )}
                      {agent.voice && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Voice</span>
                          <span className="font-medium">{agent.voice}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
