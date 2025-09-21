import Papa from 'papaparse';
import { Candidate, Internship, AllocationRequest, AllocationResponse } from '@/types';

export const parseCSV = <T>(file: File): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('CSV parsing failed: ' + results.errors[0].message));
          return;
        }
        resolve(results.data as T[]);
      },
      error: (error) => reject(error),
      header: true,
      skipEmptyLines: true,
    });
  });
};

export const generateMockAllocation = async (
  candidatesFile: File,
  internshipsFile: File
): Promise<AllocationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const candidates = await parseCSV<Candidate>(candidatesFile);
    const internships = await parseCSV<Internship>(internshipsFile);

    // Generate mock allocation results
    const allocations = candidates.slice(0, Math.min(candidates.length, 20)).map((candidate, index) => {
      const internship = internships[index % internships.length];
      const score = Math.floor(Math.random() * 40) + 60; // 60-100 range
      
      const reasons = [
        'Strong skill match and location preference',
        'Previous experience aligns well with requirements',
        'Geographic proximity and skill compatibility',
        'High aptitude score and relevant background',
        'Optimal fit based on capacity and skills'
      ];

      const genders = ['Male', 'Female'];
      const pastParticipation = candidate.past_internship === 'TRUE' ? 'Yes' : 'No';

      return {
        Candidate: candidate.name,
        Internship: internship?.title || 'Software Development Intern',
        Score: score,
        Reason: reasons[Math.floor(Math.random() * reasons.length)],
        Category: candidate.category,
        Gender: genders[Math.floor(Math.random() * genders.length)],
        Area: candidate.category, // Using category as area (Rural/Urban)
        "Past Participation": pastParticipation
      };
    });

    return { allocations };
  } catch (error) {
    throw new Error('Failed to process files: ' + (error as Error).message);
  }
};

export const callAllocationAPI = async (
  candidatesFile: File,
  internshipsFile: File
): Promise<AllocationResponse> => {
  // This is a placeholder for the actual API call
  // Replace this with your actual backend endpoint
  
  try {
    const candidates = await parseCSV<Candidate>(candidatesFile);
    const internships = await parseCSV<Internship>(internshipsFile);

    const requestData: AllocationRequest = {
      candidates,
      internships
    };

    // Actual API call (commented out for prototype)
    /*
    const response = await fetch('/api/allocate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Allocation API call failed');
    }

    return await response.json();
    */

    // For now, return mock data
    return generateMockAllocation(candidatesFile, internshipsFile);
  } catch (error) {
    throw new Error('API call failed: ' + (error as Error).message);
  }
};