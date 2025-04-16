
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TodoProvider } from "./context/todo";
import { ThemeProvider } from "./components/ThemeProvider";
import SidebarToggleProvider from "./context/SidebarToggleContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <TodoProvider>
          <SidebarToggleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<Index view="calendar" />} />
                <Route path="/dashboard" element={<Index view="dashboard" />} />
                <Route path="/starred" element={<Index view="starred" />} />
                <Route path="/settings" element={<Index view="settings" />} />
                <Route path="/archived" element={<Index view="archived" />} />
                <Route path="/analytics" element={<Index view="analytics" />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarToggleProvider>
        </TodoProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
