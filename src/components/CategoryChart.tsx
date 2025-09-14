import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AllocationResult } from './AllocationResults';

interface CategoryChartProps {
  results: AllocationResult[];
  categories: string[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ results, categories }) => {
  // Generate distribution data
  const distributionData = categories.map(category => {
    const count = results.filter(result => result.Category === category).length;
    return {
      category,
      count,
      percentage: results.length > 0 ? Math.round((count / results.length) * 100) : 0
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elegant">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-primary">
            {`Count: ${payload[0].value}`}
          </p>
          <p className="text-muted-foreground">
            {`${payload[0].payload.percentage}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-elegant">
      <CardHeader className="bg-gradient-subtle">
        <CardTitle className="text-xl font-bold">Candidate Distribution by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="category" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {distributionData.map((item) => (
            <div key={item.category} className="text-center">
              <div className="text-2xl font-bold text-primary">{item.count}</div>
              <div className="text-sm font-medium">{item.category}</div>
              <div className="text-xs text-muted-foreground">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};