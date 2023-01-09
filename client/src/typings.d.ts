enum Role {
  User = "user",
  Admin = "admin",
}

interface User {
  email: string;
  id: number;
  role: Role;
}

interface Report {
  approved: boolean;
  id: number;
  lat: number;
  lng: number;
  make: string;
  mileage: number;
  model: string;
  price: number;
  year: number;
}
