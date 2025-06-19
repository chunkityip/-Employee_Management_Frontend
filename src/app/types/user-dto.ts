// Create this file as: src/app/types/user-dto.ts
export interface UserDto {
  phone: string | undefined;
  dob: string | undefined;
  id?: string;               // For user ID, typically maps to userName
  userName?: string;          // For username field
  firstName?: string;         // For first name
  lastName?: string;          // For last name  
  email?: string;            // For email
  password?: string;         // For password
  dateOfBirth?: string;      // For date of birth (ISO string format)
  mobileNumber?: string;     // For mobile number
  domain?: string;           // For domain/specialization
  experience?: number;       // For years of experience
}