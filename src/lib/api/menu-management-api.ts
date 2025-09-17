import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMenuStore } from '@/store/menu-management-store';
import { MenuItem, Category } from '@/types/menu-management';


export const useMenuData = () => {
  const { categories, menuItems } = useMenuStore();
  
  // Simulate API call with dummy data
  return useQuery({
    queryKey: ['menuData'],
    queryFn: async () => {
      // In a real implementation, this would be an API call
      return { categories, menuItems };
    },
    initialData: { categories, menuItems },
  });
};

export const useAddMenuItem = () => {
  const queryClient = useQueryClient();
  const { addMenuItem } = useMenuStore();
  
  return useMutation({
    mutationFn: async (newItem: MenuItem) => {
      // In a real implementation, this would be an API call
      addMenuItem(newItem);
      return newItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    },
    onError: (error) => {
      console.error('Error adding menu item:', error);
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  const { updateMenuItem } = useMenuStore();
  
  return useMutation({
    mutationFn: async ({ id, item }: { id: string; item: Omit<MenuItem, 'id'> }) => {
      // In a real implementation, this would be an API call
      updateMenuItem(id, item);
      return { id, ...item };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    },
    onError: (error) => {
      console.error('Error updating menu item:', error);
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  const { deleteMenuItem } = useMenuStore();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // In a real implementation, this would be an API call
      deleteMenuItem(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    },
    onError: (error) => {
      console.error('Error deleting menu item:', error);
    },
  });
};

export const useReorderMenuItems = () => {
  const queryClient = useQueryClient();
  const { reorderMenuItems } = useMenuStore();
  
  return useMutation({
    mutationFn: async (items: MenuItem[]) => {
      // In a real implementation, this would be an API call
      reorderMenuItems(items);
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
    },
    onError: (error) => {
      console.error('Error reordering menu items:', error);
    },
  });
};