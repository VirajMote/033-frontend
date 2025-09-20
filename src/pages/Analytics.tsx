import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { AllocationResult } from '@/components/AllocationResults';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface AnalyticsProps {
  results: AllocationResult[];
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ results, onBack }) => {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  // Process data for charts
  const chartData = useMemo(() => {
    // 1. Category Distribution
    const categoryData = results.reduce((acc, result) => {
      acc[result.Category] = (acc[result.Category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryChart = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // 2. Location Distribution (using Area field)
    const locationData = results.reduce((acc, result) => {
      acc[result.Area] = (acc[result.Area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const locationChart = Object.entries(locationData).map(([name, value]) => ({ name, value }));

    // 3. Allocation vs Unallocation (simulated data)
    const allocated = results.length;
    const unallocated = Math.floor(allocated * 0.15); // Simulate 15% unallocated
    const allocationChart = [
      { name: 'Allocated', value: allocated, percentage: Math.round((allocated / (allocated + unallocated)) * 100) },
      { name: 'Unallocated', value: unallocated, percentage: Math.round((unallocated / (allocated + unallocated)) * 100) }
    ];

    // 4. Score Distribution (histogram)
    const scoreRanges = { '0-59': 0, '60-69': 0, '70-79': 0, '80-89': 0, '90-100': 0 };
    results.forEach(result => {
      if (result.Score < 60) scoreRanges['0-59']++;
      else if (result.Score < 70) scoreRanges['60-69']++;
      else if (result.Score < 80) scoreRanges['70-79']++;
      else if (result.Score < 90) scoreRanges['80-89']++;
      else scoreRanges['90-100']++;
    });
    
    const scoreChart = Object.entries(scoreRanges).map(([range, count]) => ({ range, count }));

    // 5. Internship Capacity Utilization (simulated)
    const internshipData = results.reduce((acc, result) => {
      if (!acc[result.Internship]) {
        acc[result.Internship] = { filled: 0, total: Math.floor(Math.random() * 20) + 10 }; // Random capacity 10-30
      }
      acc[result.Internship].filled++;
      return acc;
    }, {} as Record<string, { filled: number; total: number }>);
    
    const capacityChart = Object.entries(internshipData).map(([name, data]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      filled: data.filled,
      total: data.total,
      utilization: Math.round((data.filled / data.total) * 100)
    }));

    // 6. Comparison Chart (simulated)
    const comparisonChart = [
      { category: 'SC', withoutBoost: 12, withBoost: 18 },
      { category: 'ST', withoutBoost: 8, withBoost: 15 },
      { category: 'OBC', withoutBoost: 25, withBoost: 28 },
      { category: 'Rural', withoutBoost: 20, withBoost: 32 },
      { category: 'PwD', withoutBoost: 3, withBoost: 8 }
    ];

    return {
      categoryChart,
      locationChart,
      allocationChart,
      scoreChart,
      capacityChart,
      comparisonChart
    };
  }, [results]);
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onBack}
            variant="outline"
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of allocation results
            </p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Category Distribution */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.categoryChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.categoryChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 2. Location Distribution */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Location Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.locationChart} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 3. Allocation vs Unallocation */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Allocation vs Unallocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.allocationChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {chartData.allocationChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 4. Score Distribution */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.scoreChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Capacity and Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 5. Internship Capacity Utilization */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Internship Capacity Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.capacityChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'filled' ? `${value} filled` : `${value} total`, 
                        name === 'filled' ? 'Filled' : 'Capacity'
                      ]}
                    />
                    <Bar dataKey="total" fill="hsl(var(--muted))" name="total" />
                    <Bar dataKey="filled" fill="hsl(var(--primary))" name="filled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 6. Comparison Chart */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Fairness Boost Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.comparisonChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="withoutBoost" fill="hsl(var(--muted))" name="Without Boost" />
                    <Bar dataKey="withBoost" fill="hsl(var(--primary))" name="With Boost" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground">Total Allocations</h3>
              <p className="text-2xl font-bold text-primary">{results.length}</p>
            </div>
          </Card>
          
          <Card className="p-4 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground">Average Score</h3>
              <p className="text-2xl font-bold text-success">
                {results.length > 0 
                  ? Math.round(results.reduce((sum, r) => sum + r.Score, 0) / results.length)
                  : 0
                }
              </p>
            </div>
          </Card>

          <Card className="p-4 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground">Unique Categories</h3>
              <p className="text-2xl font-bold text-warning">
                {new Set(results.map(r => r.Category)).size}
              </p>
            </div>
          </Card>

          <Card className="p-4 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground">High Scores (80+)</h3>
              <p className="text-2xl font-bold text-success">
                {results.filter(r => r.Score >= 80).length}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;