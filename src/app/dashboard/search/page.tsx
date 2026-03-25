"use client"
import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Input } from '@/components/ui/input';
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
import { Search as SearchIcon, Info } from 'lucide-react';

export default function SearchPage() {
  const { candidates } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce simple implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCandidates = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    
    const term = debouncedSearch.toLowerCase();
    return candidates.filter(c => 
      c.inscricao === term || // Inscrição exata
      c.nome.toLowerCase().includes(term) // Nome parcial
    ).sort((a, b) => a.posicao_atual - b.posicao_atual);
  }, [candidates, debouncedSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Pesquisar</h1>
        <p className="text-muted-foreground">Localize candidatos por nome ou número de inscrição.</p>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Digite o nome completo ou número da inscrição..." 
          className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm text-lg focus-visible:ring-secondary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>

      {debouncedSearch ? (
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-16 text-center font-bold">POS</TableHead>
                  <TableHead className="font-bold">INSCRIÇÃO</TableHead>
                  <TableHead className="font-bold">NOME</TableHead>
                  <TableHead className="font-bold">NOTA</TableHead>
                  <TableHead className="font-bold">TIPO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-center font-bold">{c.posicao_atual}</TableCell>
                      <TableCell className="font-mono text-xs">{c.inscricao}</TableCell>
                      <TableCell className="font-medium">{c.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{c.nota_final.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell>
                        {c.tipo && <Badge className="bg-primary">{c.tipo}</Badge>}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                      Nenhum resultado encontrado para "{debouncedSearch}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Info className="w-12 h-12 opacity-20" />
          <p>Digite algo para iniciar a busca...</p>
        </div>
      )}
    </div>
  );
}
