// Local Authentication System - Firebase olmadan çalışır
// localStorage kullanarak basit kullanıcı yönetimi

(function() {
    'use strict';

    console.log('🔐 Local Auth System başlatılıyor...');

    // Default users - ilk kurulumda oluşturulacak
    const defaultUsers = {
        coordinators: [
            {
                email: 'koordinator@ceviklider.com',
                password: 'CevikLider2024!',
                firstName: 'Sistem',
                lastName: 'Koordinatörü',
                role: 'coordinator',
                title: 'Eğitim Koordinatörü',
                department: 'Eğitim Koordinasyonu',
                isActive: true
            },
            {
                email: 'admin@ceviklider.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'coordinator',
                title: 'Yönetici',
                department: 'Yönetim',
                isActive: true
            }
        ],
        students: [
            {
                email: 'test@student.com',
                password: 'test123',
                firstName: 'Test',
                lastName: 'Öğrenci',
                role: 'student',
                department: 'Test Departmanı',
                isActive: true
            },
            {
                email: 'ahmet.yilmaz@meb.gov.tr',
                password: 'ahmet123',
                firstName: 'Ahmet',
                lastName: 'Yılmaz',
                role: 'student',
                department: 'Öğretmen',
                isActive: true
            }
        ]
    };

    // Initialize default users if not exists
    function initializeDefaultUsers() {
        if (!localStorage.getItem('local_coordinators')) {
            localStorage.setItem('local_coordinators', JSON.stringify(defaultUsers.coordinators));
            console.log('✅ Default koordinatörler oluşturuldu');
        }

        if (!localStorage.getItem('local_students')) {
            localStorage.setItem('local_students', JSON.stringify(defaultUsers.students));
            console.log('✅ Default öğrenciler oluşturuldu');
        }
    }

    // Get all coordinators
    function getCoordinators() {
        try {
            const data = localStorage.getItem('local_coordinators');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Koordinatörler yüklenemedi:', error);
            return [];
        }
    }

    // Get all students
    function getStudents() {
        try {
            const data = localStorage.getItem('local_students');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Öğrenciler yüklenemedi:', error);
            return [];
        }
    }

    // Save coordinator
    function saveCoordinator(coordinator) {
        try {
            const coordinators = getCoordinators();

            // Check if exists
            const existingIndex = coordinators.findIndex(c => c.email === coordinator.email);

            if (existingIndex >= 0) {
                coordinators[existingIndex] = { ...coordinators[existingIndex], ...coordinator };
            } else {
                coordinators.push(coordinator);
            }

            localStorage.setItem('local_coordinators', JSON.stringify(coordinators));
            console.log('✅ Koordinatör kaydedildi:', coordinator.email);
            return { success: true };
        } catch (error) {
            console.error('Koordinatör kaydedilemedi:', error);
            return { success: false, error: error.message };
        }
    }

    // Save student
    function saveStudent(student) {
        try {
            const students = getStudents();

            // Check if exists
            const existingIndex = students.findIndex(s => s.email === student.email);

            if (existingIndex >= 0) {
                students[existingIndex] = { ...students[existingIndex], ...student };
            } else {
                students.push(student);
            }

            localStorage.setItem('local_students', JSON.stringify(students));
            console.log('✅ Öğrenci kaydedildi:', student.email);
            return { success: true };
        } catch (error) {
            console.error('Öğrenci kaydedilemedi:', error);
            return { success: false, error: error.message };
        }
    }

    // Login coordinator
    function loginCoordinator(email, password) {
        const coordinators = getCoordinators();
        const coordinator = coordinators.find(c => c.email === email);

        if (!coordinator) {
            return {
                success: false,
                error: 'Koordinatör hesabı bulunamadı!'
            };
        }

        if (coordinator.password !== password) {
            return {
                success: false,
                error: 'E-posta veya şifre hatalı!'
            };
        }

        if (coordinator.isActive === false) {
            return {
                success: false,
                error: 'Hesabınız devre dışı bırakılmış.'
            };
        }

        // Save to localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('userRole', 'coordinator');

        console.log('✅ Koordinatör girişi başarılı:', email);
        return {
            success: true,
            user: coordinator
        };
    }

    // Login student
    function loginStudent(email, password) {
        const students = getStudents();
        const student = students.find(s => s.email === email);

        if (!student) {
            return {
                success: false,
                error: 'Kullanıcı bulunamadı. Lütfen kayıt olun.'
            };
        }

        if (student.password !== password) {
            return {
                success: false,
                error: 'E-posta veya şifre hatalı!'
            };
        }

        if (student.isActive === false) {
            return {
                success: false,
                error: 'Hesabınız devre dışı bırakılmış.'
            };
        }

        // Save to localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('userRole', 'student');

        console.log('✅ Öğrenci girişi başarılı:', email);
        return {
            success: true,
            user: student
        };
    }

    // Logout
    function logout() {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('userRole');
        console.log('👋 Çıkış yapıldı');
    }

    // Check if logged in
    function isLoggedIn() {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const email = localStorage.getItem('userEmail');
        const role = localStorage.getItem('userRole');

        return {
            isLoggedIn: loggedIn,
            email: email,
            role: role
        };
    }

    // Initialize on load
    initializeDefaultUsers();

    // Export to window
    window.LocalAuth = {
        getCoordinators,
        getStudents,
        saveCoordinator,
        saveStudent,
        loginCoordinator,
        loginStudent,
        logout,
        isLoggedIn,
        defaultUsers
    };

    console.log('✅ Local Auth System hazır!');
    console.log('📋 Varsayılan Hesaplar:');
    console.log('   Koordinatör: koordinator@ceviklider.com / CevikLider2024!');
    console.log('   Koordinatör: admin@ceviklider.com / admin123');
    console.log('   Öğrenci: test@student.com / test123');
    console.log('   Öğrenci: ahmet.yilmaz@meb.gov.tr / ahmet123');

})();
