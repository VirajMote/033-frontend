import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { AllocationResults, AllocationResult } from '@/components/AllocationResults';
import { CategoryChart } from '@/components/CategoryChart';
import { callAllocationAPI } from '@/services/allocationApi';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Users, Target } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CANDIDATE_CATEGORIES = ['Urban', 'Rural', 'Tribal', 'SC', 'ST', 'OBC', 'PwD'];

const Index = () => {
  const [results, setResults] = useState<AllocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const handleFilesUploaded = async (candidatesFile: File | null, internshipsFile: File | null) => {
    if (!candidatesFile || !internshipsFile) {
      setError('Please select both candidates and internships CSV files');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await callAllocationAPI(candidatesFile, internshipsFile);
      setResults(response.allocations);
      
      toast({
        title: "Success!",
        description: `Generated ${response.allocations.length} allocation results`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-primary shadow-glow">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Internship Allocation Engine
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload candidate and internship data to generate optimal allocations using our intelligent matching algorithm
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-elegant border">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Total Allocations</h3>
                <p className="text-3xl font-bold text-primary">{results.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-elegant border">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold text-lg">Average Score</h3>
                <p className="text-3xl font-bold text-success">
                  {results.length > 0 
                    ? Math.round(results.reduce((sum, r) => sum + r.Score, 0) / results.length)
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {/* File Upload */}
        {results.length === 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <FileUpload onFilesUploaded={handleFilesUploaded} isLoading={isLoading} />
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AllocationResults results={results} onReset={handleReset} />
              </div>
              <div>
                <CategoryChart results={results} categories={CANDIDATE_CATEGORIES} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
