import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { AllocationResult } from '@/components/AllocationResults';

interface AnalyticsProps {
  results: AllocationResult[];
  onBack: () => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ results, onBack }) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Placeholder Cards for Charts */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Area Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Past Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be implemented here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Chart will be implemented here</p>
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