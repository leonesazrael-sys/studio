"use client"
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Lock, Save, KeyRound } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile, updateUserPassword } = useApp();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm.nome, profileForm.email);
    toast({ title: "Perfil atualizado", description: "Seus dados foram salvos com sucesso." });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass.length < 6) {
      toast({ title: "Erro", description: "A nova senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast({ title: "Erro", description: "A confirmação da senha não coincide.", variant: "destructive" });
      return;
    }

    const result = updateUserPassword(passwordForm.current, passwordForm.newPass);
    if (result.success) {
      toast({ title: "Sucesso", description: result.message });
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } else {
      toast({ title: "Erro", description: result.message, variant: "destructive" });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e credenciais de acesso.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Dados Gerais
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Dados do Usuário</CardTitle>
              <CardDescription>Mantenha seu e-mail e nome atualizados.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={profileForm.nome} 
                      onChange={e => setProfileForm({...profileForm, nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail de Acesso</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileForm.email} 
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Label>Nível de Acesso</Label>
                  <div className="p-3 bg-slate-50 border rounded-lg flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    <span className="font-semibold text-primary">{user.role}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button type="submit" className="ml-auto bg-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Perfil
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Para sua segurança, não compartilhe sua senha com ninguém.</CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Senha Atual</Label>
                  <Input 
                    id="current" 
                    type="password" 
                    placeholder="••••••••"
                    value={passwordForm.current}
                    onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">Nova Senha (min. 6 caracteres)</Label>
                    <Input 
                      id="new" 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordForm.newPass}
                      onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirm" 
                      type="password" 
                      placeholder="••••••••"
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button type="submit" className="ml-auto bg-primary">
                  <KeyRound className="w-4 h-4 mr-2" />
                  Atualizar Senha
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
