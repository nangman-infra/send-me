import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/styles/theme';
import { MainPage } from '@/pages/MainPage';
import { WritePage } from '@/pages/WritePage';
import { DonePage } from '@/pages/DonePage';
import { CancelPage } from '@/pages/CancelPage';
import { HistoryPage } from '@/pages/HistoryPage';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/done" element={<DonePage />} />
          <Route path="/cancel/:token" element={<CancelPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
