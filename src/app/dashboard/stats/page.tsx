"use client"
import { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function StatsPage() {
  const { candidates } = useApp();

  const stats = useMemo(() => {
    if (candidates.length === 0) return { total: 0, media: 0, max: 0, min: 0, pcd: 0, subJudice: 0, ampla: 0 };
    
    const notas = candidates.map(c => c.nota_final);
    return {
      total: candidates.length,
      media: (notas.reduce((a, b) => a + b, 0) / candidates.length).toFixed(2),
      max: Math.max(...notas).toFixed(2),
      min: Math.min(...notas).toFixed(2),
      pcd: candidates.filter(c => c.tipo?.toUpperCase() === 'PCD').length,
      subJudice: candidates.filter(c => c.tipo?.toLowerCase().includes('sub judice')).length,
      ampla: candidates.filter(c => !c.tipo).length
    };
  }, [candidates]);

  const pieData = [
    { name: 'Ampla Concorrência', value: stats.ampla, color: '#315C76' },
    { name: 'PCD', value: stats.pcd, color: '#F97316' },
    { name: 'Sub Judice', value: stats.subJudice, color: '#F59E0B' },
  ];

  const barData = [
    { range: '90-100', count: candidates.filter(c => c.nota_final >= 90).length },
    { range: '80-89', count: candidates.filter(c => c.nota_final >= 80 && c.nota_final < 90).length },
    { range: '70-79', count: candidates.filter(c => c.nota_final >= 70 && c.nota_final < 80).length },
    { range: '60-69', count: candidates.filter(c => c.nota_final >= 60 && c.nota_final < 70).length },
    { range: '50-59', count: candidates.filter(c => c.nota_final >= 50 && c.nota_final < 60).length },
    { range: '< 50', count: candidates.filter(c => c.nota_final < 50).length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Estatísticas</h1>
        <p className="text-muted-foreground">Panorama analítico do concurso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Inscritos" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard title="Média de Notas" value={stats.media} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Maior Nota" value={stats.max} icon={Trophy} color="bg-amber-500" />
        <StatCard title="Menor Nota" value={stats.min} icon={Target} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Candidatos por Faixa de Nota</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#315C76" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`${color} p-3 rounded-xl text-white shadow-md`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
