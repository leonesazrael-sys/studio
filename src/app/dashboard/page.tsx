"use client"
import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  Users,
  Trophy,
  ArrowUpDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { CandidateForm } from '@/components/candidate-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function RankingPage() {
  const { candidates, user, deleteCandidate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.inscricao.includes(searchTerm)
    ).sort((a, b) => a.posicao_atual - b.posicao_atual);
  }, [candidates, searchTerm]);

  const stats = useMemo(() => ({
    total: candidates.length,
    pcd: candidates.filter(c => c.tipo?.toUpperCase() === 'PCD').length,
    subJudice: candidates.filter(c => c.tipo?.toLowerCase().includes('sub judice')).length,
    media: (candidates.reduce((acc, c) => acc + c.nota_final, 0) / candidates.length || 0).toFixed(2)
  }), [candidates]);

  const handleDelete = () => {
    if (deletingId) {
      deleteCandidate(deletingId);
      toast({ title: "Sucesso", description: "Candidato removido com sucesso." });
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-none shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Candidatos Total</p>
                <h3 className="text-3xl font-bold mt-1 text-primary">{stats.total}</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">PCD / Especiais</p>
                <h3 className="text-3xl font-bold mt-1 text-orange-600">{stats.pcd}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <UserPlus className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-200"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Sub Judice</p>
                <h3 className="text-3xl font-bold mt-1 text-amber-600">{stats.subJudice}</h3>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <GraduationCap className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-200"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Média de Nota</p>
                <h3 className="text-3xl font-bold mt-1 text-secondary">{stats.media}</h3>
              </div>
              <div className="bg-secondary/10 p-3 rounded-xl">
                <Trophy className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/20"></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por nome ou inscrição..." 
            className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-secondary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-slate-200 h-11">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          {user?.role === 'ADMIN' && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 md:flex-none h-11 bg-secondary text-primary hover:bg-secondary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Registro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Candidato</DialogTitle>
                </DialogHeader>
                <CandidateForm onSuccess={() => setIsAddOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 text-center font-bold">POS</TableHead>
                <TableHead className="font-bold">INSCRIÇÃO</TableHead>
                <TableHead className="font-bold">NOME</TableHead>
                <TableHead className="font-bold">NOTA</TableHead>
                <TableHead className="font-bold">L. VAGA</TableHead>
                <TableHead className="font-bold">TIPO</TableHead>
                {user?.role === 'ADMIN' && <TableHead className="text-right font-bold pr-6">AÇÕES</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((c) => (
                  <TableRow key={c.id} className="group hover:bg-slate-50 transition-colors">
                    <TableCell className="text-center">
                      <div className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${c.posicao_atual <= 3 ? 'bg-secondary text-primary' : 'bg-slate-100 text-slate-600'}
                      `}>
                        {c.posicao_atual}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.inscricao}</TableCell>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold bg-white text-primary border-primary/20">
                        {c.nota_final.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>{c.posicao_lista_vaga}</TableCell>
                    <TableCell>
                      {c.tipo && (
                        <Badge 
                          className={`
                            ${c.tipo.toUpperCase() === 'PCD' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-amber-500 hover:bg-amber-600'}
                            text-white border-none font-semibold text-[10px] tracking-wider
                          `}
                        >
                          {c.tipo}
                        </Badge>
                      )}
                    </TableCell>
                    {user?.role === 'ADMIN' && (
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setEditingCandidate(c)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeletingId(c.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                    Nenhum candidato encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingCandidate && (
        <Dialog open={!!editingCandidate} onOpenChange={() => setEditingCandidate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Candidato</DialogTitle>
            </DialogHeader>
            <CandidateForm 
              candidate={editingCandidate} 
              onSuccess={() => setEditingCandidate(null)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente os dados do candidato do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}