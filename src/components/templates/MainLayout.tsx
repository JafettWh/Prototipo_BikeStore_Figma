import React from "react";
import { Page } from "../../types";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

interface MainLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSearch: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  children,
}) => {
  const isMinimalLayout = currentPage === "admin" || currentPage === "success";

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#11120f] font-['Inter',sans-serif]">
      {/* Header global (excepto en panel admin para mantener layout tipo dashboard) */}
      {currentPage !== "admin" && (
        <Header
          currentPage={currentPage}
          onNavigate={onNavigate}
          onOpenSearch={onOpenSearch}
        />
      )}

      {/* Contenido de la página */}
      <div className="flex-1 w-full">{children}</div>

      {/* Footer global */}
      {!isMinimalLayout && <Footer onNavigate={onNavigate} />}
    </div>
  );
};

export default MainLayout;
