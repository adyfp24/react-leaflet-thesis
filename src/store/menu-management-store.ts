import { create } from 'zustand';
import { Category, MenuItem } from '@/types/menu-management';

interface MenuStore {
  categories: Category[];
  menuItems: MenuItem[];
  modalOpen: boolean;
  modalMode: 'add' | 'edit';
  currentMenu: MenuItem | null;
  currentCategory: string;
  formData: Omit<MenuItem, 'id'>;
  setCategories: (categories: Category[]) => void;
  setMenuItems: (menuItems: MenuItem[]) => void;
  setModalOpen: (open: boolean) => void;
  setModalMode: (mode: 'add' | 'edit') => void;
  setCurrentMenu: (menu: MenuItem | null) => void;
  setCurrentCategory: (categoryId: string) => void;
  setFormData: (formData: Omit<MenuItem, 'id'>) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (items: MenuItem[]) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  categories: [
    { id: "1", name: "Main", maxMenus: 15 },
    { id: "2", name: "Payments", maxMenus: 15 },
  ],
  menuItems: [
    { 
      id: "1", 
      name: "Pulsa", 
      category: "1", 
      type: "link", 
      operator: "all", 
      icon: "home", 
      active: true 
    },
    { 
      id: "2", 
      name: "Token PLN", 
      category: "2", 
      type: "link", 
      operator: "all", 
      icon: "creditCard", 
      active: true 
    },
  ],
  modalOpen: false,
  modalMode: 'add',
  currentMenu: null,
  currentCategory: "",
  formData: {
    name: "",
    category: "",
    type: "link",
    operator: "all",
    icon: "home",
    active: true
  },
  setCategories: (categories) => set({ categories }),
  setMenuItems: (menuItems) => set({ menuItems }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
  setModalMode: (modalMode) => set({ modalMode }),
  setCurrentMenu: (currentMenu) => set({ currentMenu }),
  setCurrentCategory: (currentCategory) => set({ currentCategory }),
  setFormData: (formData) => set({ formData }),
  addMenuItem: (item) => set((state) => ({ menuItems: [...state.menuItems, item] })),
  updateMenuItem: (id, item) => set((state) => ({
    menuItems: state.menuItems.map(menu => 
      menu.id === id ? { ...item, id } : menu
    )
  })),
  deleteMenuItem: (id) => set((state) => ({
    menuItems: state.menuItems.filter(item => item.id !== id)
  })),
  reorderMenuItems: (items) => set({ menuItems: items }),
}));