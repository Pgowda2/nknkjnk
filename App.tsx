import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { PublisherRoute } from './components/PublisherRoute.js';

import { HomePage } from './pages/HomePage.js';
import { PostDetailPage } from './pages/PostDetailPage.js';
import { PublisherLoginPage } from './pages/PublisherLoginPage.js';
import { PublisherDashboardPage } from './pages/PublisherDashboardPage.js';
import { PublisherPostEditorPage } from './pages/PublisherPostEditorPage.js';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Visitor Routes (Strictly NO sign-in or account links in UI) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/post/:slug" element={<PostDetailPage />} />

              {/* Hidden Publisher Routes (Not linked from public pages) */}
              <Route path="/publisher/login" element={<PublisherLoginPage />} />
              <Route
                path="/publisher/dashboard"
                element={
                  <PublisherRoute>
                    <PublisherDashboardPage />
                  </PublisherRoute>
                }
              />
              <Route
                path="/publisher/posts/new"
                element={
                  <PublisherRoute>
                    <PublisherPostEditorPage />
                  </PublisherRoute>
                }
              />
              <Route
                path="/publisher/posts/edit/:id"
                element={
                  <PublisherRoute>
                    <PublisherPostEditorPage />
                  </PublisherRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
