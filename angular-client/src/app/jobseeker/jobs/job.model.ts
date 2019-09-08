export interface Job {
  id: number;
  title: string;
  type: string;
  description: string;
 // change to date object
  datePosted: string;
  location: string;
  salary: number;
  industry: string;
}