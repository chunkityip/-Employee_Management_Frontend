export interface EmployeeFormData {
  id: string;               // Maps to userName
  firstname: string;        // Maps to firstName
  lastname: string;         // Maps to lastName
  email: string;
  password: string;
  dob: string;             // Maps to dateOfBirth
  mobileno: string;        // Maps to mobileNumber
  domain: string;
  experience: string;      // Will be converted to number
}