export interface IUser {
  _id: unknown;
  fullName: string;
  email: string;
  password?: string;
  profileImage?: string;
  bio?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  roleType?: string;
  school?: string;
  budgetMin?: number;
  budgetMax?: number;
  moveInDate?: Date;
  onboardingCompleted?: boolean;
  
  // Roommate matching preferences
  cleanlinessLevel?: "low" | "medium" | "high";
  sleepType?: "early_bird" | "night_owl";
  guestPolicy?: "no" | "often" | "regular";
  smoker?: boolean;
  drinker?: boolean;
  preferredLocations?: string[];
  preferredFacilities?: string[];
  
  // Virtuals/Populated
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Fallback for fields not yet explicitly defined
  [key: string]: unknown;
}

export interface IRoom {
  _id: unknown;
  ownerId: unknown | IUser;
  title: string;
  description: string;
  locationText: string;
  address?: string;
  rentAmount: number;
  depositAmount?: number;
  availableFrom?: Date;
  images: string[];
  providedFacilities: string[];
  propertyType: "apartment" | "house" | "studio";
  roomType: "private" | "shared";
  status: "available" | "unavailable";
  
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Fallback
  [key: string]: unknown;
}

export interface IMatchResult {
  scorePercent: number;
  reasons: string[];
  [key: string]: unknown;
}

export interface IConnection {
  _id: unknown;
  sender: unknown | IUser;
  receiver: unknown | IUser;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export interface IJoinRequest {
  _id: unknown;
  roomId: unknown | IRoom;
  userId: unknown | IUser;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}
