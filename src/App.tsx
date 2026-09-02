import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { TopAppBar } from './components/layout/TopAppBar';
import { EvidenceDrawer } from './components/layout/EvidenceDrawer';
import { ImpactModal } from './components/layout/ImpactModal';
import { DataUploadModal } from './components/common/DataUploadModal';

import { HomeScreen } from './components/screens/HomeScreen';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { HarmonizationScreen } from './components/screens/HarmonizationScreen';
import { ReviewQueueScreen } from './components/screens/ReviewQueueScreen';
import { MasterCatalogueScreen } from './components/screens/MasterCatalogueScreen';
import { MaterialDetailScreen } from './components/screens/MaterialDetailScreen';
import { RationalizationScreen } from './components/screens/RationalizationScreen';
import { DataHubScreen } from './components/screens/DataHubScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { GovernanceScreen } from './components/screens/GovernanceScreen';
import { SettingsScreen, SupportScreen } from './components/screens/SettingsScreen';

const MainLayout: React.FC = () => {
  const { activeScreen } = useApp();

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen />;
      case 'dashboard':
        return <OverviewScreen />;
      case 'harmonization':
        return <HarmonizationScreen />;
      case 'review':
        return <ReviewQueueScreen />;
      case 'master':
        return <MasterCatalogueScreen />;
      case 'detail':
        return <MaterialDetailScreen />;
      case 'rationalization':
        return <RationalizationScreen />;
      case 'datahub':
        return <DataHubScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'governance':
        return <GovernanceScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'support':
        return <SupportScreen />;
      default:
        return <OverviewScreen />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-standard text-on-surface transition-colors duration-200">
      {/* Fixed Left Navigation Sidebar (240px) */}
      <AppShell />

      {/* Main Content Area */}
      <div className="ml-[240px] flex-1 flex flex-col h-full bg-background overflow-hidden transition-colors duration-200">
        <TopAppBar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {renderScreen()}
        </div>
      </div>

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer />

      {/* Confirmation & Downstream Impact Modal */}
      <ImpactModal />

      {/* CSV / XLS Ingestion & Reader Modal */}
      <DataUploadModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
