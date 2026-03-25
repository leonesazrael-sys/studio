"use client"
import { useApp } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
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
  User as UserIcon, 
  ShieldCheck, 
  BarChart3,
  Settings
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, settings } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const menuItems = [
    { name: 'Ranking Principal', icon: LayoutDashboard, path: '/dashboard', role: 'USER' },
    { name: 'Estatísticas', icon: BarChart3, path: '/dashboard/stats', role: 'USER' },
    { name: 'Meu Perfil', icon: UserIcon, path: '/dashboard/profile', role: 'USER' },
    { name: 'Ajustes', icon: Settings, path: '/dashboard/settings', role: 'ADMIN' },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="p-4 bg-primary">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-lg text-white group-data-[collapsible=icon]:hidden">
              {settings.nomeSistema}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-primary">
          <SidebarMenu className="px-2 pt-4">
            {menuItems.map((item) => {
              if (item.role === 'ADMIN' && user.role !== 'ADMIN') return null;
              const isActive = pathname === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    isActive={isActive} 
                    tooltip={item.name} 
                    className={`text-white hover:bg-white/10 ${isActive ? 'bg-white/20' : ''}`}
                    asChild
                  >
                    <Link href={item.path}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
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
              Dashboard / {menuItems.find(i => i.path === pathname)?.name || 'Início'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">{user.nome}</p>
              <p className="text-xs text-muted-foreground mt-1">{user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 border-2 border-primary/10 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={`https://picsum.photos/seed/${user.id}/100`} />
                  <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
