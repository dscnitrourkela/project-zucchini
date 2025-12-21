import { Payment } from "@/components/ui/data-table/columns";

export const publicRoutes = ["/login", "/register"];
export const tempUserData: Payment[] = [
  {
    id: "1",
    name: "Shuvam Satapathi",
    email: "shuvam@gmail.com",
    phone: "9876543210",
    college: "NIT Rourkela",
    registeredAt: "2024-10-12",
    status: "success",
    amount: 499,
  },
  {
    id: "2",
    name: "Aman Verma",
    email: "aman.verma@gmail.com",
    phone: "9123456780",
    college: "IIT Bhubaneswar",
    registeredAt: "2024-10-13",
    status: "processing",
    amount: 399,
  },
  {
    id: "3",
    name: "Riya Sharma",
    email: "riya.sharma@gmail.com",
    phone: "9988776655",
    college: "NIT Trichy",
    registeredAt: "2024-10-14",
    status: "failed",
    amount: 499,
  },
  {
    id: "4",
    name: "Kunal Das",
    email: "kunal.das@gmail.com",
    phone: "9090909090",
    college: "JU Kolkata",
    registeredAt: "2024-10-15",
    status: "pending",
    amount: 299,
  },
];
