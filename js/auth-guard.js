// Authentication Guard - Kullanıcı kimlik doğrulama kontrolü
// Bu dosya korumalı sayfalara dahil edilmelidir

(function() {
    'use strict';

    console.log('🔒 Auth Guard başlatılıyor...');

    // Define public pages that don't require authentication
    const publicPages = [
        'index.html',
        'register.html',
        'instructor-login.html',
        'test-pdf.html',
        'test-timestamp-matching.html',
        'clear-cache.html'
    ];

    // Get current page name
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Check if current page is public
    const isPublicPage = publicPages.some(page => currentPage.includes(page));

    if (isPublicPage) {
        console.log('✅ Public sayfa, auth kontrolü atlanıyor:', currentPage);
        return;
    }

    // Check authentication
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userEmail = localStorage.getItem('userEmail');
        const loginTime = localStorage.getItem('loginTime');

        // Check if user is logged in
        if (isLoggedIn !== 'true' || !userEmail) {
            console.warn('⚠️ Kullanıcı oturum açmamış, giriş sayfasına yönlendiriliyor...');
            redirectToLogin();
            return false;
        }

        // Check session timeout (24 hours)
        if (loginTime) {
            const loginTimestamp = parseInt(loginTime);
            const now = Date.now();
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

            if (now - loginTimestamp > sessionDuration) {
                console.warn('⚠️ Oturum süresi doldu, giriş sayfasına yönlendiriliyor...');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('loginTime');
                localStorage.removeItem('userRole');
                redirectToLogin();
                return false;
            }
        }

        // Check if coordinator page and user is coordinator
        const isCoordinatorPage = currentPage.includes('instructor-');
        const userRole = localStorage.getItem('userRole');

        if (isCoordinatorPage && userRole !== 'coordinator') {
            console.warn('⚠️ Koordinatör yetkisi gerekli, giriş sayfasına yönlendiriliyor...');
            redirectToLogin('instructor-login.html');
            return false;
        }

        console.log('✅ Auth kontrolü başarılı:', userEmail);
        return true;
    }

    // Redirect to login page
    function redirectToLogin(loginPage = 'index.html') {
        // Save current page for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.href);

        // Show message
        alert('Lütfen önce giriş yapın.');

        // Redirect
        window.location.href = loginPage;
    }

    // Run authentication check immediately
    const isAuthenticated = checkAuth();

    if (!isAuthenticated) {
        // Stop page loading
        document.addEventListener('DOMContentLoaded', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // Hide page content
        if (document.body) {
            document.body.style.display = 'none';
        }
    }

    // Export to window for manual checks
    window.AuthGuard = {
        checkAuth: checkAuth,
        redirectToLogin: redirectToLogin,
        isAuthenticated: isAuthenticated
    };

})();
