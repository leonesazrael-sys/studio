"use client"
import { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
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
  Plus, 
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function RankingPage() {
  const { candidates, user, deleteCandidate, settings } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(settings.paginacaoPadrao || 10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const sortedCandidates = useMemo(() => {
    // Remove duplicatas por inscrição e ordena por posição
    const unique = candidates.filter((c, index, self) =>
      index === self.findIndex((t) => t.inscricao === c.inscricao)
    );
    return unique.sort((a, b) => a.posicao_atual - b.posicao_atual);
  }, [candidates]);

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCandidates.slice(start, start + pageSize);
  }, [sortedCandidates, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCandidates.length / pageSize);

  const handleDelete = () => {
    if (deletingId) {
      deleteCandidate(deletingId);
      toast({ title: "Sucesso", description: "Candidato removido com sucesso." });
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">RANKING DA T4</h1>
          <p className="text-muted-foreground">Listagem oficial de classificação por nota final.</p>
        </div>
        
        {user?.role === 'ADMIN' && settings.permitirCadastro && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 bg-secondary text-primary hover:bg-secondary/90 shadow-lg">
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
              {paginatedCandidates.length > 0 ? (
                paginatedCandidates.map((c) => (
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
                    Nenhum candidato cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setCurrentPage(1); }}>
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-4">
            Mostrando {Math.min(sortedCandidates.length, (currentPage - 1) * pageSize + 1)} - {Math.min(sortedCandidates.length, currentPage * pageSize)} de {sortedCandidates.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className="h-9 w-9 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
