import { Bell, CreditCard, FileText, HelpCircle, Home, Users } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  maxMenus: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  type: "link" | "dropdown" | "section";
  operator: "all" | "specific";
  icon: string;
  active: boolean;
};

export type MenuFormData = Omit<MenuItem, 'id'>;

export const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  creditCard: CreditCard,
  fileText: FileText,
  users: Users,
  bell: Bell,
  helpCircle: HelpCircle
};