export interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  company: string;
  salaryMin: number;
  salaryMax: number;
  industry: string;
  datePosted: string;
  overview: string;
  responsible: string;
  qualify: string;
  likedJob: boolean;
  dateApplied: string;
}