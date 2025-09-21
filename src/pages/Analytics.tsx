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
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  // Process data for charts
  const chartData = useMemo(() => {
    // 1. Category Distribution
    const categoryData = results.reduce((acc, result) => {
      acc[result.Category] = (acc[result.Category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryChart = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // 2. Area Distribution (using Area field which contains Rural/Urban)
    const areaData = results.reduce((acc, result) => {
      acc[result.Area] = (acc[result.Area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const locationChart = Object.entries(areaData).map(([name, value]) => ({ name, value }));

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
        <div className="flex items-center mb-12">
          <Button 
            onClick={onBack}
            variant="outline"
            className="mr-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analysis of allocation results
            </p>
          </div>
        </div>

        {/* First Row - Main Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {/* 1. Category Distribution */}
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <PieChart className="h-6 w-6 mr-3 text-primary" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.categoryChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.categoryChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 2. Area Distribution */}
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <PieChart className="h-6 w-6 mr-3 text-primary" />
                Area Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.locationChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.locationChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Allocation and Score */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {/* 3. Allocation vs Unallocation */}
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <PieChart className="h-6 w-6 mr-3 text-primary" />
                Allocation vs Unallocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.allocationChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      labelLine={false}
                    >
                      {chartData.allocationChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 4. Score Distribution */}
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <BarChart3 className="h-6 w-6 mr-3 text-primary" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.scoreChart} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Capacity and Comparison */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {/* 5. Internship Capacity Utilization */}
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-6 w-6 mr-3 text-primary" />
                Internship Capacity Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.capacityChart} margin={{ bottom: 60, left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'filled' ? `${value} filled` : `${value} total`, 
                        name === 'filled' ? 'Filled' : 'Capacity'
                      ]}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="total" fill="#E5E7EB" name="total" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="filled" fill="#10B981" name="filled" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 6. Comparison Chart */}
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <BarChart3 className="h-6 w-6 mr-3 text-primary" />
                Fairness Boost Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.comparisonChart} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="withoutBoost" fill="#9CA3AF" name="Without Boost" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="withBoost" fill="#3B82F6" name="With Boost" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fourth Row - Detailed Category Chart */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <BarChart3 className="h-6 w-6 mr-3 text-primary" />
                Detailed Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.categoryChart} margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Total Allocations</h3>
              <p className="text-3xl font-bold text-primary">{results.length}</p>
            </div>
          </Card>
          
          <Card className="p-6 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-success">
                {results.length > 0 
                  ? Math.round(results.reduce((sum, r) => sum + r.Score, 0) / results.length)
                  : 0
                }
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Unique Categories</h3>
              <p className="text-3xl font-bold text-warning">
                {new Set(results.map(r => r.Category)).size}
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <div className="text-center">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">High Scores (80+)</h3>
              <p className="text-3xl font-bold text-success">
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