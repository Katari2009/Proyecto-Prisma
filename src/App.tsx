import React from 'react';
import { UserProvider } from './hooks/useUser';
import AppContent from './components/AppContent';

const App: React.FC = () => {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
};

export default App;