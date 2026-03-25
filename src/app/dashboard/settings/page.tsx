"use client"
import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { user, settings, updateSettings } = useApp();
  const router = useRouter();
  const { toast } = useToast();
  
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSave = () => {
    updateSettings(form);
    toast({
      title: "Configurações salvas",
      description: "As alterações do sistema foram aplicadas com sucesso."
    });
  };

  if (user?.role !== 'ADMIN') return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Ajustes do Sistema</h1>
        <p className="text-muted-foreground">Configurações globais acessíveis apenas para administradores.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Configure como o sistema deve se comportar para os usuários.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Nome da Aplicação</Label>
            <Input 
              value={form.nomeSistema} 
              onChange={e => setForm({...form, nomeSistema: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Permitir Novos Cadastros</Label>
              <p className="text-sm text-muted-foreground">Ativa ou desativa o formulário de inclusão de candidatos.</p>
            </div>
            <Switch 
              checked={form.permitirCadastro}
              onCheckedChange={v => setForm({...form, permitirCadastro: v})}
            />
          </div>

          <div className="space-y-2">
            <Label>Itens por Página (Padrão)</Label>
            <Input 
              type="number"
              value={form.paginacaoPadrao}
              onChange={e => setForm({...form, paginacaoPadrao: parseInt(e.target.value)})}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSave} className="ml-auto bg-primary">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Alterar configurações estruturais pode afetar a experiência de todos os usuários. Tenha certeza do que está fazendo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
