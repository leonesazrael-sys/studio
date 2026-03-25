"use client"
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  ShieldCheck, 
  Users,
  Search,
  Settings
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="p-4 bg-primary">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-lg text-white group-data-[collapsible=icon]:hidden">RankInsight</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-primary">
          <SidebarMenu className="px-2 pt-4">
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Ranking Principal" className="text-white hover:bg-white/10">
                <LayoutDashboard />
                <span>Ranking Principal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Pesquisar" className="text-white hover:bg-white/10">
                <Search />
                <span>Pesquisar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Estatísticas" className="text-white hover:bg-white/10">
                <Users />
                <span>Estatísticas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Configurações" className="text-white hover:bg-white/10">
                <Settings />
                <span>Ajustes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="bg-primary p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={logout} 
                tooltip="Sair"
                className="text-white hover:bg-destructive/80"
              >
                <LogOut />
                <span>Desconectar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 items-center border-b bg-white px-6 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest group-data-[collapsible=icon]:ml-4">
              Dashboard / Ranking
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">{user.nome}</p>
              <p className="text-xs text-muted-foreground mt-1">{user.role === 'ADMIN' ? 'Administrador' : 'Usuário Comum'}</p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-primary/10">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
              <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}