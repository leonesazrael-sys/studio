"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/lib/store';
import { Candidate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  inscricao: z.string().min(1, 'Inscrição é obrigatória'),
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  nota_final: z.coerce.number().min(0).max(100),
  posicao_lista_vaga: z.string().min(1, 'Posição na vaga é obrigatória'),
  tipo: z.string().optional(),
  posicao_atual: z.coerce.number().min(1),
});

interface CandidateFormProps {
  candidate?: Candidate;
  onSuccess: () => void;
}

export function CandidateForm({ candidate, onSuccess }: CandidateFormProps) {
  const { addCandidate, updateCandidate } = useApp();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inscricao: '',
      nome: '',
      nota_final: 0,
      posicao_lista_vaga: '',
      tipo: 'GERAL',
      posicao_atual: 1,
    },
  });

  useEffect(() => {
    if (candidate) {
      form.reset({
        ...candidate,
        tipo: candidate.tipo || 'GERAL',
      });
    }
  }, [candidate, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedValues = {
      ...values,
      tipo: values.tipo === 'GERAL' ? undefined : values.tipo
    };

    if (candidate) {
      updateCandidate({ ...formattedValues, id: candidate.id });
      toast({ title: "Sucesso", description: "Candidato atualizado com sucesso." });
    } else {
      addCandidate(formattedValues);
      toast({ title: "Sucesso", description: "Candidato cadastrado com sucesso." });
    }
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="inscricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Inscrição</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 20240114788" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do candidato" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="nota_final"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nota Final</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="posicao_lista_vaga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição Lista Vaga</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 176º" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="posicao_atual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição Atual Ranking</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Candidatura</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GERAL">Geral (Nenhum)</SelectItem>
                  <SelectItem value="PCD">PCD</SelectItem>
                  <SelectItem value="sub judice">Sub Judice</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary text-white">
            {candidate ? 'Salvar Alterações' : 'Cadastrar Candidato'}
          </Button>
        </div>
      </form>
    </Form>
  );
}