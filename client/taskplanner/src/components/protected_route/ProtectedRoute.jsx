import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Checks if user is logged in before allowing access to protected pages
 * Redirects to login page if not authenticated
 */
export default function ProtectedRoute({ children }) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        // Not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }
    
    // User is logged in, show the protected page
    return children;
}