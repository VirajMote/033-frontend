export interface Candidate {
  id: string;
  name: string;
  skills: string;
  qualifications: string;
  location_preferences: string;
  sector_interests: string;
  Category: string; // Reservation category (Gen, OBC, EWS, ST, SC)
  category: string; // Area (Rural, Urban)
  past_internship: string;
}

export interface Internship {
  id: string;
  title: string;
  required_skills: string;
  qualifications: string;
  location: string;
  organization: string;
  description: string;
  sector: string;
  capacity: number;
}

export interface AllocationRequest {
  candidates: Candidate[];
  internships: Internship[];
}

export interface AllocationResponse {
  allocations: Array<{
    Candidate: string;
    Internship: string;
    Score: number;
    Reason: string;
    Category: string;
    Gender: string;
    Area: string;
    "Past Participation": string;
  }>;
}