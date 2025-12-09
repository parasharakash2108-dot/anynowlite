'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Prompt } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt_body: '',
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPrompts(data);
    }
    setLoading(false);
  };

  const handleOpenDialog = (prompt?: Prompt) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setFormData({
        name: prompt.name,
        description: prompt.description,
        prompt_body: prompt.prompt_body,
      });
    } else {
      setEditingPrompt(null);
      setFormData({ name: '', description: '', prompt_body: '' });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingPrompt) {
      const { error } = await supabase
        .from('prompts')
        .update({
          name: formData.name,
          description: formData.description,
          prompt_body: formData.prompt_body,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPrompt.id);

      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('prompts').insert({
        name: formData.name,
        description: formData.description,
        prompt_body: formData.prompt_body,
        user_id: '00000000-0000-0000-0000-000000000000',
      });

      if (error) {
        alert(error.message);
        return;
      }
    }

    setDialogOpen(false);
    fetchPrompts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    const { error } = await supabase.from('prompts').delete().eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchPrompts();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Prompts</h1>
          <p className="text-muted-foreground mt-1">Create and manage reusable prompts for your agents</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Create Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}</DialogTitle>
              <DialogDescription>
                {editingPrompt ? 'Update your prompt details' : 'Create a new prompt for your agents'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Customer Support Assistant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Handles customer inquiries and support requests"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt_body">Prompt Body</Label>
                <Textarea
                  id="prompt_body"
                  value={formData.prompt_body}
                  onChange={(e) => setFormData({ ...formData, prompt_body: e.target.value })}
                  placeholder="You are a helpful customer support assistant..."
                  rows={8}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingPrompt ? 'Update' : 'Create'} Prompt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.length === 0 ? (
            <Card className="col-span-full shadow-sm">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No prompts found. Create your first prompt to get started.</p>
              </CardContent>
            </Card>
          ) : (
            prompts.map((prompt) => (
              <Card key={prompt.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{prompt.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {prompt.prompt_body}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(prompt)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(prompt.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
