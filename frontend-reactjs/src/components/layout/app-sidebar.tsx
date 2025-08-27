import { Car, Building2, Wrench, LayoutDashboard, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { Button } from '@/components/ui/button';

export type PageType = 'dashboard' | 'brands' | 'models' | 'cars';

interface MenuItem {
  id: PageType;
  title: string;
  icon: typeof LayoutDashboard;
  description: string;
  color: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral do sistema',
    color: 'text-yellow-600'
  },
  {
    id: 'brands',
    title: 'Marcas',
    icon: Building2,
    description: 'Gerenciar marcas de veículos',
    color: 'text-yellow-700'
  },
  {
    id: 'models',
    title: 'Modelos',
    icon: Wrench,
    description: 'Gerenciar modelos de carros',
    color: 'text-yellow-800'
  },
  {
    id: 'cars',
    title: 'Carros',
    icon: Car,
    description: 'Inventário de veículos',
    color: 'text-yellow-900'
  }
];

interface AppSidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const getNavClass = (pageId: PageType) => {
    const baseClasses =
      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group';

    if (currentPage === pageId) {
      return `${baseClasses} bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg transform scale-[1.02]`;
    }

    return `${baseClasses} hover:bg-gradient-to-r hover:from-yellow-100 hover:to-yellow-200 text-gray-700 hover:text-yellow-800 hover:shadow-md`;
  };

  const getIconClass = (pageId: PageType, baseColor: string) => {
    const baseClasses = 'h-5 w-5 flex-shrink-0 transition-all duration-200';

    if (currentPage === pageId) {
      return `${baseClasses} text-white`;
    }

    return `${baseClasses} ${baseColor} group-hover:scale-110`;
  };

  return (
    <Sidebar className="border-r-2 border-yellow-500" collapsible="icon">
      <SidebarContent className="bg-slate-100 shadow-lg">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-300">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold  whitespace-nowrap overflow-hidden bg-gradient-to-r bg-clip-text text-transparent from-yellow-500 to-yellow-600"
              >
                WS Vehicle Manager
              </motion.h2>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 cursor-pointer text-yellow-600 hover:bg-yellow-600 hover:text-white transition-all duration-200 hover:scale-110"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <SidebarGroup className="py-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`${getNavClass(item.id)} transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                      onClick={() => onPageChange(item.id)}
                    >
                      <div className="transition-transform duration-200 hover:rotate-3">
                        <item.icon
                          className={getIconClass(item.id, item.color)}
                        />
                      </div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col overflow-hidden"
                          >
                            <span className="text-sm font-medium whitespace-nowrap">
                              {item.title}
                            </span>
                            <span className="text-xs opacity-75 whitespace-nowrap">
                              {item.description}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-auto p-4 border-t border-yellow-300"
            >
              <div className="text-xs text-center text-yellow-600">
                © 2025 WS Vehicle Manager
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarContent>
    </Sidebar>
  );
}
