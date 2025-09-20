import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface AllocationResult {
  Candidate: string;
  Internship: string;
  Score: number;
  Reason: string;
  Category: string;
  Gender: string;
  Area: string;
  "Past Participation": string;
}

interface AllocationResultsProps {
  results: AllocationResult[];
  onReset: () => void;
  onViewAnalytics: () => void;
}

export const AllocationResults: React.FC<AllocationResultsProps> = ({ results, onReset, onViewAnalytics }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof AllocationResult>('Score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedResults = useMemo(() => {
    let filtered = results.filter(
      (result) =>
        result.Candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.Internship.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.Reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.Gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.Area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result["Past Participation"].toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });

    return filtered;
  }, [results, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof AllocationResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success text-success-foreground';
    if (score >= 60) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <Card className="w-full shadow-elegant">
      <CardHeader className="bg-gradient-subtle">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Allocation Results</CardTitle>
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="hover:bg-destructive hover:text-destructive-foreground transition-smooth"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates, internships, or reasons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {filteredAndSortedResults.length} results
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {(['Candidate', 'Internship', 'Score', 'Reason', 'Category', 'Gender', 'Area', 'Past Participation'] as const).map((field) => (
                  <TableHead 
                    key={field}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSort(field)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{field}</span>
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedResults.map((result, index) => (
                <TableRow key={index} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-medium">{result.Candidate}</TableCell>
                  <TableCell>{result.Internship}</TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(result.Score)}>
                      {result.Score}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={result.Reason}>
                    {result.Reason}
                  </TableCell>
                  <TableCell>{result.Category}</TableCell>
                  <TableCell>{result.Gender}</TableCell>
                  <TableCell>{result.Area}</TableCell>
                  <TableCell>{result["Past Participation"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <div className="p-6 border-t bg-muted/20">
        <div className="flex justify-center">
          <Button 
            onClick={onViewAnalytics}
            variant="default"
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2 shadow-elegant"
          >
            View Analytics
          </Button>
        </div>
      </div>
    </Card>
  );
};