export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
  badge?: string; // Optional badge for recommended items
  options?: MenuOptionGroup[];
}

export interface MenuOptionGroup {
  title: string;
  required: boolean;
  items: MenuOption[];
}

export interface MenuOption {
  name: string;
  price: number;
  optionId: number; // Ensure this matches the backend structure
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface SelectedOptions {
  [key: string]: MenuOption;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  options?: { [key: string]: string }; // Name-based options for display
  optionIds?: number[]; // Option IDs for backend requests
  image?: string;
}

