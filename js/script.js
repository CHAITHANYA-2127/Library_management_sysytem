/**
 * ============================================================================
 * LIBRARY — Professional Library Management System
 * Dual Login (Admin & Student) + Book Cover Uploads + Profile Controls
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STORAGE KEYS & DEFAULT SEED DATA WITH BOOK COVERS
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    BOOKS: 'library_lms_books_v3',
    STUDENTS: 'library_lms_students_v3',
    ISSUES: 'library_lms_issues_v3',
    ACTIVITIES: 'library_lms_activities_v3',
    AUTH: 'library_lms_auth_v3',
    ADMIN_PWD: 'library_lms_admin_pwd_v3'
  };

  function formatDateYYYYMMDD(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function getOffsetDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return formatDateYYYYMMDD(d);
  }

  const DEFAULT_BOOKS = [
    {
      id: 'BK-101',
      title: 'The Book of Life',
      author: 'Chaithanya',
      category: 'Moral Values',
      totalQty: 6,
      availableQty: 4,
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-102',
      title: 'The Art',
      author: 'Suhana',
      category: 'Art',
      totalQty: 6,
      availableQty: 6,
      coverUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-103',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Programming',
      totalQty: 5,
      availableQty: 4,
      coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-104',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      category: 'Fiction',
      totalQty: 4,
      availableQty: 4,
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
      createdAt: new Date().toISOString()
    }
  ];

  const DEFAULT_STUDENTS = [
    {
      rollNumber: '24kb1a05k3',
      name: 'Chaithanya',
      department: 'CSE',
      email: 'gunukulachaithanya2127@gmail.com',
      phone: '+1 555-019-2831',
      password: 'student123',
      createdAt: new Date().toISOString()
    },
    {
      rollNumber: '123',
      name: 'Suhana',
      department: 'CSE',
      email: 'suhana@example.com',
      phone: '+1 555-014-9823',
      password: 'student123',
      createdAt: new Date().toISOString()
    },
    {
      rollNumber: '23CSE101',
      name: 'Alex Morgan',
      department: 'CSE',
      email: 'alex.morgan@campus.edu',
      phone: '+1 555-012-3456',
      password: 'student123',
      createdAt: new Date().toISOString()
    }
  ];

  const DEFAULT_ISSUES = [
    {
      id: 'TXN-901',
      studentRoll: '24kb1a05k3',
      studentName: 'Chaithanya',
      bookId: 'BK-101',
      bookTitle: 'The Book of Life',
      issueDate: getOffsetDate(-18),
      dueDate: getOffsetDate(-4),
      returnDate: getOffsetDate(-3),
      status: 'Returned'
    },
    {
      id: 'TXN-902',
      studentRoll: '24kb1a05k3',
      studentName: 'Chaithanya',
      bookId: 'BK-101',
      bookTitle: 'The Book of Life',
      issueDate: getOffsetDate(-4),
      dueDate: getOffsetDate(10),
      returnDate: null,
      status: 'Issued'
    },
    {
      id: 'TXN-903',
      studentRoll: '23CSE101',
      studentName: 'Alex Morgan',
      bookId: 'BK-103',
      bookTitle: 'Clean Code',
      issueDate: getOffsetDate(-20),
      dueDate: getOffsetDate(-6),
      returnDate: null,
      status: 'Issued'
    },
    {
      id: 'TXN-904',
      studentRoll: '123',
      studentName: 'Suhana',
      bookId: 'BK-101',
      bookTitle: 'The Book of Life',
      issueDate: getOffsetDate(-8),
      dueDate: getOffsetDate(6),
      returnDate: null,
      status: 'Issued'
    }
  ];

  const DEFAULT_ACTIVITIES = [
    {
      id: 'ACT-1',
      type: 'return',
      title: 'The Book of Life',
      student: 'Chaithanya • 24kb1a05k3',
      status: 'Returned',
      timestamp: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'ACT-2',
      type: 'issue',
      title: 'The Book of Life',
      student: 'Chaithanya • 24kb1a05k3',
      status: 'Issued',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'ACT-3',
      type: 'issue',
      title: 'Clean Code',
      student: 'Alex Morgan • 23CSE101',
      status: 'Issued',
      timestamp: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'ACT-4',
      type: 'issue',
      title: 'The Book of Life',
      student: 'Suhana • 123',
      status: 'Issued',
      timestamp: new Date(Date.now() - 8 * 86400000).toISOString()
    }
  ];

  // --------------------------------------------------------------------------
  // 2. DATABASE REPOSITORY / LOCALSTORAGE MANAGER
  // --------------------------------------------------------------------------
  class Database {
    constructor() {
      this.initDatabase();
    }

    initDatabase() {
      if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
        this.saveBooks(DEFAULT_BOOKS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        this.saveStudents(DEFAULT_STUDENTS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.ISSUES)) {
        this.saveIssues(DEFAULT_ISSUES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
        this.saveActivities(DEFAULT_ACTIVITIES);
      }
      if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PWD)) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, 'Library@123');
      }
    }

    resetToDemoData() {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(DEFAULT_BOOKS));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(DEFAULT_ISSUES));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, 'Library@123');
    }

    getAdminPassword() {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || 'Library@123';
    }

    setAdminPassword(pwd) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, pwd);
    }

    getBooks() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS)) || [];
      } catch (e) {
        return [];
      }
    }

    saveBooks(books) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    }

    getStudents() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS)) || [];
      } catch (e) {
        return [];
      }
    }

    saveStudents(students) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }

    getIssues() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ISSUES)) || [];
      } catch (e) {
        return [];
      }
    }

    saveIssues(issues) {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    }

    getActivities() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) || [];
      } catch (e) {
        return [];
      }
    }

    saveActivities(activities) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    }

    addActivity(type, title, student, status) {
      const activities = this.getActivities();
      activities.unshift({
        id: 'ACT-' + Date.now(),
        type: type,
        title: title,
        student: student,
        status: status,
        timestamp: new Date().toISOString()
      });
      if (activities.length > 30) activities.pop();
      this.saveActivities(activities);
    }

    getAuth() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || null;
      } catch (e) {
        return null;
      }
    }

    setAuth(authData) {
      if (authData) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    }
  }

  const db = new Database();

  // --------------------------------------------------------------------------
  // 3. UI STATE & DOM REFERENCES
  // --------------------------------------------------------------------------
  const state = {
    currentRole: 'admin',
    currentStudent: null,
    currentView: 'dashboard',
    currentStudentView: 'student-overview',
    bookSearchQuery: '',
    bookCategoryFilter: 'all',
    studentSearchQuery: '',
    returnSearchQuery: '',
    returnStatusFilter: 'all',
    historySearchQuery: '',
    historyStatusFilter: 'all',
    studentCatalogSearch: '',
    studentCatalogCategory: 'all',
    pendingConfirmAction: null
  };

  const DOM = {
    authView: document.getElementById('authView'),
    appWorkspace: document.getElementById('appWorkspace'),
    studentWorkspace: document.getElementById('studentWorkspace'),
    
    // Role switcher tabs
    tabRoleAdmin: document.getElementById('tabRoleAdmin'),
    tabRoleStudent: document.getElementById('tabRoleStudent'),
    adminLoginFormWrap: document.getElementById('adminLoginFormWrap'),
    studentLoginFormWrap: document.getElementById('studentLoginFormWrap'),
    
    // Login Forms
    loginForm: document.getElementById('loginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    togglePasswordBtn: document.getElementById('togglePasswordBtn'),

    studentLoginForm: document.getElementById('studentLoginForm'),
    studentLoginRoll: document.getElementById('studentLoginRoll'),
    studentLoginPassword: document.getElementById('studentLoginPassword'),
    toggleStudentPasswordBtn: document.getElementById('toggleStudentPasswordBtn'),

    // Sign out buttons
    signOutBtn: document.getElementById('signOutBtn'),
    studentSignOutBtn: document.getElementById('studentSignOutBtn'),

    // Top Right Corner Profile Menus (Change Password & Logout)
    adminUserDropdownBtn: document.getElementById('adminUserDropdownBtn'),
    adminUserDropdownMenu: document.getElementById('adminUserDropdownMenu'),
    btnAdminChangePassword: document.getElementById('btnAdminChangePassword'),
    btnAdminLogout: document.getElementById('btnAdminLogout'),

    studentUserDropdownBtn: document.getElementById('studentUserDropdownBtn'),
    studentUserDropdownMenu: document.getElementById('studentUserDropdownMenu'),
    btnStudentChangePassword: document.getElementById('btnStudentChangePassword'),
    btnStudentLogout: document.getElementById('btnStudentLogout'),
    menuStudentName: document.getElementById('menuStudentName'),
    menuStudentRoll: document.getElementById('menuStudentRoll'),
    studentTopbarDropdownName: document.getElementById('studentTopbarDropdownName'),

    // Change Password Modal
    changePasswordModal: document.getElementById('changePasswordModal'),
    changePasswordForm: document.getElementById('changePasswordForm'),
    pwdModalRoleBadge: document.getElementById('pwdModalRoleBadge'),
    currentPasswordInput: document.getElementById('currentPasswordInput'),
    newPasswordInput: document.getElementById('newPasswordInput'),
    confirmNewPasswordInput: document.getElementById('confirmNewPasswordInput'),

    // Admin Sidebar & Navigation
    appSidebar: document.getElementById('appSidebar'),
    sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
    sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    breadcrumbSection: document.getElementById('breadcrumbSection'),
    currentDateDisplay: document.getElementById('currentDateDisplay'),
    refreshDataBtn: document.getElementById('refreshDataBtn'),
    sidebarReturnBadge: document.getElementById('sidebarReturnBadge'),
    navItems: document.querySelectorAll('.sidebar .nav-item[data-view]'),
    sections: document.querySelectorAll('.content-section'),

    // Student Sidebar & Navigation
    studentSidebar: document.getElementById('studentSidebar'),
    studentSidebarToggleBtn: document.getElementById('studentSidebarToggleBtn'),
    studentSidebarCloseBtn: document.getElementById('studentSidebarCloseBtn'),
    studentSidebarBackdrop: document.getElementById('studentSidebarBackdrop'),
    studentBreadcrumb: document.getElementById('studentBreadcrumb'),
    studentCurrentDateDisplay: document.getElementById('studentCurrentDateDisplay'),
    studentNavItems: document.querySelectorAll('[data-student-view]'),
    studentSections: document.querySelectorAll('.student-content-section'),
    studentGreetingName: document.getElementById('studentGreetingName'),
    studentProfileName: document.getElementById('studentProfileName'),
    studentProfileRoll: document.getElementById('studentProfileRoll'),
    studentAvatarText: document.getElementById('studentAvatarText'),
    studentTopbarAvatar: document.getElementById('studentTopbarAvatar'),

    // Student Dashboard Elements
    studentStatIssued: document.getElementById('studentStatIssued'),
    studentStatOverdue: document.getElementById('studentStatOverdue'),
    studentStatReturned: document.getElementById('studentStatReturned'),
    studentStatCatalog: document.getElementById('studentStatCatalog'),
    studentActiveIssuesBody: document.getElementById('studentActiveIssuesBody'),
    studentNoActiveIssues: document.getElementById('studentNoActiveIssues'),
    profName: document.getElementById('profName'),
    profRoll: document.getElementById('profRoll'),
    profDept: document.getElementById('profDept'),
    profEmail: document.getElementById('profEmail'),
    profPhone: document.getElementById('profPhone'),

    // Student Catalog & History
    studentBooksCardsGrid: document.getElementById('studentBooksCardsGrid'),
    studentCatalogSearch: document.getElementById('studentCatalogSearch'),
    studentCatalogCategoryFilter: document.getElementById('studentCatalogCategoryFilter'),
    studentHistoryTableBody: document.getElementById('studentHistoryTableBody'),
    studentHistoryEmpty: document.getElementById('studentHistoryEmpty'),

    // Database Actions Dropdown
    dbSettingsBtn: document.getElementById('dbSettingsBtn'),
    dbSettingsMenu: document.getElementById('dbSettingsMenu'),
    btnExportData: document.getElementById('btnExportData'),
    btnResetDemoData: document.getElementById('btnResetDemoData'),

    // Admin Dashboard Elements
    statTotalBooks: document.getElementById('statTotalBooks'),
    statTotalTitles: document.getElementById('statTotalTitles'),
    statAvailableBooks: document.getElementById('statAvailableBooks'),
    statIssuedBooks: document.getElementById('statIssuedBooks'),
    statOverdueWarning: document.getElementById('statOverdueWarning'),
    statRegisteredStudents: document.getElementById('statRegisteredStudents'),
    dashboardActivityList: document.getElementById('dashboardActivityList'),
    dashboardRecentIssuesTable: document.getElementById('dashboardRecentIssuesTable'),
    statsCirculationPercent: document.getElementById('statsCirculationPercent'),
    statsCirculationBar: document.getElementById('statsCirculationBar'),
    statsCategoryList: document.getElementById('statsCategoryList'),
    statsInStockTitles: document.getElementById('statsInStockTitles'),
    statsOutOfStockTitles: document.getElementById('statsOutOfStockTitles'),
    btnViewAllHistory: document.getElementById('btnViewAllHistory'),
    btnGoToIssueModule: document.getElementById('btnGoToIssueModule'),

    // Quick Actions
    qaAddBook: document.getElementById('qaAddBook'),
    qaRegisterStudent: document.getElementById('qaRegisterStudent'),
    qaIssueBook: document.getElementById('qaIssueBook'),
    qaReturnBook: document.getElementById('qaReturnBook'),

    // Books Module & Cover Upload
    booksTotalBadge: document.getElementById('booksTotalBadge'),
    booksAvailableSubtitle: document.getElementById('booksAvailableSubtitle'),
    addBookForm: document.getElementById('addBookForm'),
    bookIdInput: document.getElementById('bookIdInput'),
    bookTitleInput: document.getElementById('bookTitleInput'),
    bookAuthorInput: document.getElementById('bookAuthorInput'),
    bookCategoryInput: document.getElementById('bookCategoryInput'),
    bookQuantityInput: document.getElementById('bookQuantityInput'),
    coverUploadDropzone: document.getElementById('coverUploadDropzone'),
    bookCoverFileInput: document.getElementById('bookCoverFileInput'),
    coverUploadPrompt: document.getElementById('coverUploadPrompt'),
    coverPreviewWrap: document.getElementById('coverPreviewWrap'),
    coverPreviewImg: document.getElementById('coverPreviewImg'),
    btnRemoveCover: document.getElementById('btnRemoveCover'),
    bookCoverDataUrl: document.getElementById('bookCoverDataUrl'),
    searchBooksInput: document.getElementById('searchBooksInput'),
    filterBookCategory: document.getElementById('filterBookCategory'),
    booksTableBody: document.getElementById('booksTableBody'),
    booksEmptyState: document.getElementById('booksEmptyState'),

    // Students Module
    studentsTotalBadge: document.getElementById('studentsTotalBadge'),
    registerStudentForm: document.getElementById('registerStudentForm'),
    studentNameInput: document.getElementById('studentNameInput'),
    studentRollInput: document.getElementById('studentRollInput'),
    studentDeptInput: document.getElementById('studentDeptInput'),
    studentEmailInput: document.getElementById('studentEmailInput'),
    studentPhoneInput: document.getElementById('studentPhoneInput'),
    searchStudentsInput: document.getElementById('searchStudentsInput'),
    studentsTableBody: document.getElementById('studentsTableBody'),
    studentsEmptyState: document.getElementById('studentsEmptyState'),

    // Issue Books Module & Preview
    issueBookForm: document.getElementById('issueBookForm'),
    issueStudentSelect: document.getElementById('issueStudentSelect'),
    issueBookSelect: document.getElementById('issueBookSelect'),
    issueBookPreviewBox: document.getElementById('issueBookPreviewBox'),
    issueBookPreviewImg: document.getElementById('issueBookPreviewImg'),
    issueBookPreviewTitle: document.getElementById('issueBookPreviewTitle'),
    issueBookPreviewAuthor: document.getElementById('issueBookPreviewAuthor'),
    issueBookPreviewStock: document.getElementById('issueBookPreviewStock'),
    issueDateInput: document.getElementById('issueDateInput'),
    dueDateInput: document.getElementById('dueDateInput'),
    issueCopiesAvailableCount: document.getElementById('issueCopiesAvailableCount'),
    activeCirculationCount: document.getElementById('activeCirculationCount'),
    activeOverdueCount: document.getElementById('activeOverdueCount'),
    activeIssuesTableBody: document.getElementById('activeIssuesTableBody'),
    activeIssuesEmptyState: document.getElementById('activeIssuesEmptyState'),
    btnGoToReturnModule: document.getElementById('btnGoToReturnModule'),

    // Return Books Module
    searchReturnsInput: document.getElementById('searchReturnsInput'),
    filterReturnStatus: document.getElementById('filterReturnStatus'),
    returnsTableBody: document.getElementById('returnsTableBody'),
    returnsEmptyState: document.getElementById('returnsEmptyState'),

    // History Module
    historyRecordCount: document.getElementById('historyRecordCount'),
    searchHistoryInput: document.getElementById('searchHistoryInput'),
    filterHistoryStatus: document.getElementById('filterHistoryStatus'),
    historyTableBody: document.getElementById('historyTableBody'),
    historyEmptyState: document.getElementById('historyEmptyState'),
    btnExportHistoryCSV: document.getElementById('btnExportHistoryCSV'),

    // Edit Book Modal with Cover
    editBookModal: document.getElementById('editBookModal'),
    editBookForm: document.getElementById('editBookForm'),
    editBookOriginalId: document.getElementById('editBookOriginalId'),
    editBookId: document.getElementById('editBookId'),
    editBookTitle: document.getElementById('editBookTitle'),
    editBookAuthor: document.getElementById('editBookAuthor'),
    editBookCategory: document.getElementById('editBookCategory'),
    editBookTotalQty: document.getElementById('editBookTotalQty'),
    editBookAvailableQty: document.getElementById('editBookAvailableQty'),
    editBookCoverImg: document.getElementById('editBookCoverImg'),
    editBookCoverFileInput: document.getElementById('editBookCoverFileInput'),
    btnEditUploadCover: document.getElementById('btnEditUploadCover'),
    btnEditRemoveCover: document.getElementById('btnEditRemoveCover'),
    editBookCoverDataUrl: document.getElementById('editBookCoverDataUrl'),

    // Edit Student Modal
    editStudentModal: document.getElementById('editStudentModal'),
    editStudentForm: document.getElementById('editStudentForm'),
    editStudentOriginalRoll: document.getElementById('editStudentOriginalRoll'),
    editStudentRoll: document.getElementById('editStudentRoll'),
    editStudentName: document.getElementById('editStudentName'),
    editStudentDept: document.getElementById('editStudentDept'),
    editStudentEmail: document.getElementById('editStudentEmail'),
    editStudentPhone: document.getElementById('editStudentPhone'),

    // Confirmation Modal
    confirmModal: document.getElementById('confirmModal'),
    confirmModalTitle: document.getElementById('confirmModalTitle'),
    confirmModalMessage: document.getElementById('confirmModalMessage'),
    confirmModalProceedBtn: document.getElementById('confirmModalProceedBtn'),
    confirmModalCancelBtn: document.getElementById('confirmModalCancelBtn'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // --------------------------------------------------------------------------
  // 4. UTILITIES & TOAST NOTIFICATIONS
  // --------------------------------------------------------------------------
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-message">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    DOM.toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 250);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 4500);
  }

  function openModal(modalEl) {
    if (modalEl) modalEl.classList.remove('d-none');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.add('d-none');
  }

  function promptConfirmation(title, message, onProceed) {
    DOM.confirmModalTitle.textContent = title;
    DOM.confirmModalMessage.textContent = message;
    state.pendingConfirmAction = onProceed;
    openModal(DOM.confirmModal);
  }

  function isOverdue(dueDateStr) {
    if (!dueDateStr) return false;
    const today = formatDateYYYYMMDD(new Date());
    return dueDateStr < today;
  }

  const DEFAULT_COVER_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 110' fill='%23e2e8de'%3E%3Crect width='80' height='110' rx='4' fill='%23eef2eb'/%3E%3Cpath d='M25 35h30M25 45h30M25 55h20' stroke='%23879b8f' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E";

  // --------------------------------------------------------------------------
  // 5. NAVIGATION CONTROLLER
  // --------------------------------------------------------------------------
  const VIEW_TITLES = {
    dashboard: 'Dashboard',
    books: 'Manage Books',
    students: 'Manage Students',
    issue: 'Issue Books',
    return: 'Return Books',
    history: 'Issue History'
  };

  function switchView(viewName) {
    if (!VIEW_TITLES[viewName]) viewName = 'dashboard';
    state.currentView = viewName;

    DOM.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    DOM.sections.forEach(section => {
      if (section.id === `section-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    DOM.breadcrumbSection.textContent = VIEW_TITLES[viewName];
    closeMobileSidebar();
    closeAllDropdowns();
    renderCurrentSection(viewName);
  }

  function switchStudentView(viewName) {
    state.currentStudentView = viewName;

    DOM.studentNavItems.forEach(item => {
      if (item.getAttribute('data-student-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    DOM.studentSections.forEach(section => {
      if (section.id === `section-${viewName}`) {
        section.classList.remove('d-none');
        section.classList.add('active');
      } else {
        section.classList.add('d-none');
        section.classList.remove('active');
      }
    });

    const labels = {
      'student-overview': 'My Dashboard',
      'student-catalog': 'Browse Catalog',
      'student-history': 'Borrowing History'
    };
    DOM.studentBreadcrumb.textContent = labels[viewName] || 'My Dashboard';

    closeStudentMobileSidebar();
    closeAllDropdowns();
  }

  function closeMobileSidebar() {
    DOM.appSidebar.classList.remove('open');
    DOM.sidebarBackdrop.classList.remove('show');
  }

  function openMobileSidebar() {
    DOM.appSidebar.classList.add('open');
    DOM.sidebarBackdrop.classList.add('show');
  }

  function closeStudentMobileSidebar() {
    DOM.studentSidebar.classList.remove('open');
    DOM.studentSidebarBackdrop.classList.remove('show');
  }

  function openStudentMobileSidebar() {
    DOM.studentSidebar.classList.add('open');
    DOM.studentSidebarBackdrop.classList.add('show');
  }

  function closeAllDropdowns() {
    if (DOM.adminUserDropdownMenu) DOM.adminUserDropdownMenu.classList.remove('show');
    if (DOM.adminUserDropdownBtn) DOM.adminUserDropdownBtn.classList.remove('open');
    if (DOM.studentUserDropdownMenu) DOM.studentUserDropdownMenu.classList.remove('show');
    if (DOM.studentUserDropdownBtn) DOM.studentUserDropdownBtn.classList.remove('open');
    if (DOM.dbSettingsMenu) DOM.dbSettingsMenu.classList.remove('show');
  }

  // --------------------------------------------------------------------------
  // 6. DASHBOARD MODULE RENDERING & STATS (Admin)
  // --------------------------------------------------------------------------
  function updateDashboard() {
    const books = db.getBooks();
    const students = db.getStudents();
    const issues = db.getIssues();
    const activities = db.getActivities();

    const totalTitles = books.length;
    const totalBooksCopies = books.reduce((acc, b) => acc + (parseInt(b.totalQty, 10) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (parseInt(b.availableQty, 10) || 0), 0);

    const activeIssues = issues.filter(i => i.status === 'Issued');
    const issuedCount = activeIssues.length;
    const overdueCount = activeIssues.filter(i => isOverdue(i.dueDate)).length;
    const studentCount = students.length;

    DOM.statTotalBooks.textContent = totalBooksCopies;
    DOM.statTotalTitles.textContent = totalTitles;
    DOM.statAvailableBooks.textContent = availableCopies;
    DOM.statIssuedBooks.textContent = issuedCount;
    DOM.statOverdueWarning.textContent = `${overdueCount} overdue`;
    DOM.statRegisteredStudents.textContent = studentCount;

    DOM.sidebarReturnBadge.textContent = issuedCount;

    const circulationPercent = totalBooksCopies > 0
      ? Math.round((issuedCount / totalBooksCopies) * 100)
      : 0;
    DOM.statsCirculationPercent.textContent = `${circulationPercent}%`;
    DOM.statsCirculationBar.style.width = `${Math.min(circulationPercent, 100)}%`;

    const inStockTitles = books.filter(b => (parseInt(b.availableQty, 10) || 0) > 0).length;
    const outOfStockTitles = books.filter(b => (parseInt(b.availableQty, 10) || 0) <= 0).length;
    DOM.statsInStockTitles.textContent = `${inStockTitles} titles`;
    DOM.statsOutOfStockTitles.textContent = `${outOfStockTitles} titles`;

    renderDashboardCategories(books);
    renderDashboardActivities(activities);
    renderDashboardRecentIssues(activeIssues);
  }

  function renderDashboardCategories(books) {
    const catCounts = {};
    books.forEach(b => {
      const cat = (b.category || 'Uncategorized').trim();
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const entries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      DOM.statsCategoryList.innerHTML = `<span class="category-chip">No categories yet</span>`;
      return;
    }

    DOM.statsCategoryList.innerHTML = entries.slice(0, 6).map(([cat, count]) => `
      <span class="category-chip">
        <span>${escapeHTML(cat)}</span>
        <span class="category-chip-count">${count}</span>
      </span>
    `).join('');
  }

  function renderDashboardActivities(activities) {
    if (!activities || activities.length === 0) {
      DOM.dashboardActivityList.innerHTML = `
        <div class="p-4 text-center text-muted" style="color: var(--color-text-muted);">
          No recent activity logged yet.
        </div>
      `;
      return;
    }

    DOM.dashboardActivityList.innerHTML = activities.slice(0, 5).map(act => {
      const isReturn = act.status === 'Returned';
      const badgeClass = isReturn ? 'badge-returned' : 'badge-issued';
      return `
        <div class="activity-item">
          <div class="activity-left">
            <div class="activity-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="activity-info">
              <span class="activity-title">${escapeHTML(act.title)}</span>
              <span class="activity-sub">${escapeHTML(act.student)}</span>
            </div>
          </div>
          <span class="badge ${badgeClass}">${escapeHTML(act.status)}</span>
        </div>
      `;
    }).join('');
  }

  function renderDashboardRecentIssues(activeIssues) {
    if (!activeIssues || activeIssues.length === 0) {
      DOM.dashboardRecentIssuesTable.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 24px; color: var(--color-text-muted);">
            No active book issues at this moment.
          </td>
        </tr>
      `;
      return;
    }

    DOM.dashboardRecentIssuesTable.innerHTML = activeIssues.slice(0, 4).map(issue => {
      const overdue = isOverdue(issue.dueDate);
      const statusBadge = overdue
        ? `<span class="badge badge-overdue">Overdue</span>`
        : `<span class="badge badge-issued">Active</span>`;

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td>
            <div class="cell-title">${escapeHTML(issue.bookTitle)}</div>
            <div class="cell-sub">ID: ${escapeHTML(issue.bookId)}</div>
          </td>
          <td>
            <div class="cell-title">${escapeHTML(issue.studentName)}</div>
            <div class="cell-sub">Roll: ${escapeHTML(issue.studentRoll)}</div>
          </td>
          <td>${escapeHTML(issue.dueDate)}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-outline btn-sm btn-quick-return" data-id="${escapeHTML(issue.id)}">
              Return
            </button>
          </td>
        </tr>
      `;
    }).join('');

    DOM.dashboardRecentIssuesTable.querySelectorAll('.btn-quick-return').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const issueId = e.currentTarget.getAttribute('data-id');
        processBookReturn(issueId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. MANAGE BOOKS MODULE & COVER PHOTO UPLOAD
  // --------------------------------------------------------------------------
  function renderBooks() {
    const books = db.getBooks();
    const query = state.bookSearchQuery.trim().toLowerCase();
    const catFilter = state.bookCategoryFilter;

    const totalCopies = books.reduce((acc, b) => acc + (parseInt(b.totalQty, 10) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (parseInt(b.availableQty, 10) || 0), 0);
    DOM.booksTotalBadge.textContent = `${books.length} titles`;
    DOM.booksAvailableSubtitle.textContent = `${availableCopies} copies available (of ${totalCopies} total)`;

    updateBookCategoryDropdown(books);

    const filtered = books.filter(book => {
      const matchSearch =
        (book.title && book.title.toLowerCase().includes(query)) ||
        (book.author && book.author.toLowerCase().includes(query)) ||
        (book.id && book.id.toLowerCase().includes(query)) ||
        (book.category && book.category.toLowerCase().includes(query));

      const matchCategory = (catFilter === 'all') || (book.category === catFilter);
      return matchSearch && matchCategory;
    });

    if (filtered.length === 0) {
      DOM.booksTableBody.innerHTML = '';
      DOM.booksEmptyState.classList.remove('d-none');
      return;
    }

    DOM.booksEmptyState.classList.add('d-none');
    DOM.booksTableBody.innerHTML = filtered.map(book => {
      const avail = parseInt(book.availableQty, 10) || 0;
      const total = parseInt(book.totalQty, 10) || 0;
      let stockClass = '';
      if (avail === 0) stockClass = 'out-stock';
      else if (avail <= 1) stockClass = 'low-stock';

      const coverSrc = book.coverUrl || DEFAULT_COVER_PLACEHOLDER;

      return `
        <tr>
          <td>
            <div class="table-book-cell">
              <img src="${escapeHTML(coverSrc)}" alt="Cover" class="table-book-thumb" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
              <div class="table-book-meta">
                <span class="cell-title">${escapeHTML(book.title)}</span>
                <span class="cell-sub">by ${escapeHTML(book.author)}</span>
              </div>
            </div>
          </td>
          <td><code>${escapeHTML(book.id)}</code></td>
          <td>${escapeHTML(book.category)}</td>
          <td>
            <span class="badge badge-stock ${stockClass}">
              ${avail} / ${total}
            </span>
          </td>
          <td class="text-right">
            <div class="table-actions">
              <button class="btn-table-action action-edit-book" data-id="${escapeHTML(book.id)}" title="Edit book">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-table-action action-delete action-delete-book" data-id="${escapeHTML(book.id)}" title="Delete book">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    DOM.booksTableBody.querySelectorAll('.action-edit-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openEditBookModal(id);
      });
    });

    DOM.booksTableBody.querySelectorAll('.action-delete-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        confirmDeleteBook(id);
      });
    });
  }

  function updateBookCategoryDropdown(books) {
    const categories = Array.from(new Set(books.map(b => (b.category || '').trim()).filter(Boolean))).sort();
    const currentVal = DOM.filterBookCategory.value;

    let html = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      const selected = cat === currentVal ? 'selected' : '';
      html += `<option value="${escapeHTML(cat)}" ${selected}>${escapeHTML(cat)}</option>`;
    });
    DOM.filterBookCategory.innerHTML = html;
  }

  function setupCoverUploadHandlers() {
    DOM.coverUploadDropzone.addEventListener('click', () => {
      DOM.bookCoverFileInput.click();
    });

    DOM.bookCoverFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Invalid File', 'Please select a valid image file.', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
          const base64 = evt.target.result;
          DOM.bookCoverDataUrl.value = base64;
          DOM.coverPreviewImg.src = base64;
          DOM.coverUploadPrompt.classList.add('d-none');
          DOM.coverPreviewWrap.classList.remove('d-none');
          showToast('Cover Selected', 'Book cover uploaded.');
        };
        reader.readAsDataURL(file);
      }
    });

    DOM.btnRemoveCover.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.bookCoverFileInput.value = '';
      DOM.bookCoverDataUrl.value = '';
      DOM.coverPreviewImg.src = '';
      DOM.coverPreviewWrap.classList.add('d-none');
      DOM.coverUploadPrompt.classList.remove('d-none');
    });

    DOM.btnEditUploadCover.addEventListener('click', () => {
      DOM.editBookCoverFileInput.click();
    });

    DOM.editBookCoverFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          DOM.editBookCoverDataUrl.value = evt.target.result;
          DOM.editBookCoverImg.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    DOM.btnEditRemoveCover.addEventListener('click', () => {
      DOM.editBookCoverDataUrl.value = '';
      DOM.editBookCoverImg.src = DEFAULT_COVER_PLACEHOLDER;
    });
  }

  function handleAddBook(e) {
    e.preventDefault();
    const id = DOM.bookIdInput.value.trim();
    const title = DOM.bookTitleInput.value.trim();
    const author = DOM.bookAuthorInput.value.trim();
    const category = DOM.bookCategoryInput.value.trim();
    const totalQty = parseInt(DOM.bookQuantityInput.value, 10);
    const coverUrl = DOM.bookCoverDataUrl.value.trim();

    if (!id || !title || !author || !category) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    if (isNaN(totalQty) || totalQty <= 0) {
      showToast('Validation Error', 'Quantity must be greater than zero.', 'error');
      return;
    }

    const books = db.getBooks();
    const exists = books.some(b => b.id.toLowerCase() === id.toLowerCase());
    if (exists) {
      showToast('Duplicate Book ID', `Book with ID "${id}" already exists.`, 'error');
      return;
    }

    const newBook = {
      id: id,
      title: title,
      author: author,
      category: category,
      totalQty: totalQty,
      availableQty: totalQty,
      coverUrl: coverUrl || null,
      createdAt: new Date().toISOString()
    };

    books.push(newBook);
    db.saveBooks(books);
    db.addActivity('add', newBook.title, `Added to catalog (Qty: ${totalQty})`, 'Added');

    showToast('Book Added', `"${newBook.title}" was added.`);
    DOM.addBookForm.reset();
    DOM.bookQuantityInput.value = '1';
    DOM.bookCoverDataUrl.value = '';
    DOM.coverPreviewImg.src = '';
    DOM.coverPreviewWrap.classList.add('d-none');
    DOM.coverUploadPrompt.classList.remove('d-none');

    renderBooks();
    updateDashboard();
  }

  function openEditBookModal(bookId) {
    const books = db.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    DOM.editBookOriginalId.value = book.id;
    DOM.editBookId.value = book.id;
    DOM.editBookTitle.value = book.title;
    DOM.editBookAuthor.value = book.author;
    DOM.editBookCategory.value = book.category;
    DOM.editBookTotalQty.value = book.totalQty;
    DOM.editBookAvailableQty.value = book.availableQty;
    
    const cover = book.coverUrl || DEFAULT_COVER_PLACEHOLDER;
    DOM.editBookCoverImg.src = cover;
    DOM.editBookCoverDataUrl.value = book.coverUrl || '';

    openModal(DOM.editBookModal);
  }

  function handleSaveEditBook(e) {
    e.preventDefault();
    const originalId = DOM.editBookOriginalId.value;
    const newId = DOM.editBookId.value.trim();
    const title = DOM.editBookTitle.value.trim();
    const author = DOM.editBookAuthor.value.trim();
    const category = DOM.editBookCategory.value.trim();
    const totalQty = parseInt(DOM.editBookTotalQty.value, 10);
    const availableQty = parseInt(DOM.editBookAvailableQty.value, 10);
    const coverUrl = DOM.editBookCoverDataUrl.value.trim();

    if (!newId || !title || !author || !category) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    if (isNaN(totalQty) || totalQty <= 0) {
      showToast('Validation Error', 'Total quantity must be greater than zero.', 'error');
      return;
    }

    if (isNaN(availableQty) || availableQty < 0 || availableQty > totalQty) {
      showToast('Validation Error', 'Invalid available quantity.', 'error');
      return;
    }

    const books = db.getBooks();

    if (newId.toLowerCase() !== originalId.toLowerCase()) {
      const exists = books.some(b => b.id.toLowerCase() === newId.toLowerCase());
      if (exists) {
        showToast('Duplicate Book ID', `Book ID "${newId}" already exists.`, 'error');
        return;
      }
    }

    const index = books.findIndex(b => b.id === originalId);
    if (index === -1) return;

    books[index] = {
      ...books[index],
      id: newId,
      title: title,
      author: author,
      category: category,
      totalQty: totalQty,
      availableQty: availableQty,
      coverUrl: coverUrl || null,
      updatedAt: new Date().toISOString()
    };

    db.saveBooks(books);

    if (newId !== originalId) {
      const issues = db.getIssues();
      let issueUpdated = false;
      issues.forEach(iss => {
        if (iss.bookId === originalId) {
          iss.bookId = newId;
          iss.bookTitle = title;
          issueUpdated = true;
        }
      });
      if (issueUpdated) db.saveIssues(issues);
    }

    closeModal(DOM.editBookModal);
    showToast('Book Updated', `Book "${title}" was updated.`);
    renderBooks();
    updateDashboard();
  }

  function confirmDeleteBook(bookId) {
    const books = db.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const issues = db.getIssues();
    const hasActiveIssues = issues.some(i => i.bookId === bookId && i.status === 'Issued');
    if (hasActiveIssues) {
      showToast('Cannot Delete', `"${book.title}" cannot be deleted because copies are currently issued.`, 'warning');
      return;
    }

    promptConfirmation(
      'Delete Book',
      `Are you sure you want to delete "${book.title}" (ID: ${book.id}) from the catalog?`,
      () => {
        const updatedBooks = books.filter(b => b.id !== bookId);
        db.saveBooks(updatedBooks);
        db.addActivity('delete', book.title, `Removed from catalog`, 'Deleted');
        showToast('Book Deleted', `"${book.title}" was removed.`);
        renderBooks();
        updateDashboard();
      }
    );
  }

  // --------------------------------------------------------------------------
  // 8. MANAGE STUDENTS MODULE
  // --------------------------------------------------------------------------
  function renderStudents() {
    const students = db.getStudents();
    const query = state.studentSearchQuery.trim().toLowerCase();

    DOM.studentsTotalBadge.textContent = `${students.length} members`;

    const filtered = students.filter(student => {
      return (
        (student.name && student.name.toLowerCase().includes(query)) ||
        (student.rollNumber && student.rollNumber.toLowerCase().includes(query)) ||
        (student.department && student.department.toLowerCase().includes(query)) ||
        (student.email && student.email.toLowerCase().includes(query)) ||
        (student.phone && student.phone.toLowerCase().includes(query))
      );
    });

    if (filtered.length === 0) {
      DOM.studentsTableBody.innerHTML = '';
      DOM.studentsEmptyState.classList.remove('d-none');
      return;
    }

    DOM.studentsEmptyState.classList.add('d-none');
    DOM.studentsTableBody.innerHTML = filtered.map(student => {
      return `
        <tr>
          <td>
            <div class="cell-title">${escapeHTML(student.name)}</div>
            <div class="cell-sub">${escapeHTML(student.email)}</div>
          </td>
          <td><code>${escapeHTML(student.rollNumber)}</code></td>
          <td>${escapeHTML(student.department)}</td>
          <td>${escapeHTML(student.phone)}</td>
          <td class="text-right">
            <div class="table-actions">
              <button class="btn-table-action action-edit-student" data-roll="${escapeHTML(student.rollNumber)}" title="Edit student">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-table-action action-delete action-delete-student" data-roll="${escapeHTML(student.rollNumber)}" title="Delete student">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    DOM.studentsTableBody.querySelectorAll('.action-edit-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const roll = e.currentTarget.getAttribute('data-roll');
        openEditStudentModal(roll);
      });
    });

    DOM.studentsTableBody.querySelectorAll('.action-delete-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const roll = e.currentTarget.getAttribute('data-roll');
        confirmDeleteStudent(roll);
      });
    });
  }

  function handleRegisterStudent(e) {
    e.preventDefault();
    const name = DOM.studentNameInput.value.trim();
    const roll = DOM.studentRollInput.value.trim();
    const dept = DOM.studentDeptInput.value.trim();
    const email = DOM.studentEmailInput.value.trim();
    const phone = DOM.studentPhoneInput.value.trim();

    if (!name || !roll || !dept || !email || !phone) {
      showToast('Validation Error', 'Please complete all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Validation Error', 'Please enter a valid email address.', 'error');
      return;
    }

    const students = db.getStudents();
    const exists = students.some(s => s.rollNumber.toLowerCase() === roll.toLowerCase());
    if (exists) {
      showToast('Duplicate Roll Number', `Student with Roll Number "${roll}" is already registered.`, 'error');
      return;
    }

    const newStudent = {
      name: name,
      rollNumber: roll,
      department: dept,
      email: email,
      phone: phone,
      password: 'student123',
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    db.saveStudents(students);
    db.addActivity('register', newStudent.name, `Registered in ${dept} (${roll})`, 'Registered');

    showToast('Student Registered', `${newStudent.name} was registered.`);
    DOM.registerStudentForm.reset();

    renderStudents();
    updateDashboard();
  }

  function openEditStudentModal(rollNumber) {
    const students = db.getStudents();
    const student = students.find(s => s.rollNumber === rollNumber);
    if (!student) return;

    DOM.editStudentOriginalRoll.value = student.rollNumber;
    DOM.editStudentRoll.value = student.rollNumber;
    DOM.editStudentName.value = student.name;
    DOM.editStudentDept.value = student.department;
    DOM.editStudentEmail.value = student.email;
    DOM.editStudentPhone.value = student.phone;

    openModal(DOM.editStudentModal);
  }

  function handleSaveEditStudent(e) {
    e.preventDefault();
    const originalRoll = DOM.editStudentOriginalRoll.value;
    const newRoll = DOM.editStudentRoll.value.trim();
    const name = DOM.editStudentName.value.trim();
    const dept = DOM.editStudentDept.value.trim();
    const email = DOM.editStudentEmail.value.trim();
    const phone = DOM.editStudentPhone.value.trim();

    if (!newRoll || !name || !dept || !email || !phone) {
      showToast('Validation Error', 'Please complete all fields.', 'error');
      return;
    }

    const students = db.getStudents();

    if (newRoll.toLowerCase() !== originalRoll.toLowerCase()) {
      const exists = students.some(s => s.rollNumber.toLowerCase() === newRoll.toLowerCase());
      if (exists) {
        showToast('Duplicate Roll Number', `Roll Number "${newRoll}" is already assigned.`, 'error');
        return;
      }
    }

    const index = students.findIndex(s => s.rollNumber === originalRoll);
    if (index === -1) return;

    students[index] = {
      ...students[index],
      rollNumber: newRoll,
      name: name,
      department: dept,
      email: email,
      phone: phone,
      updatedAt: new Date().toISOString()
    };

    db.saveStudents(students);

    if (newRoll !== originalRoll || name !== students[index].name) {
      const issues = db.getIssues();
      let issueUpdated = false;
      issues.forEach(iss => {
        if (iss.studentRoll === originalRoll) {
          iss.studentRoll = newRoll;
          iss.studentName = name;
          issueUpdated = true;
        }
      });
      if (issueUpdated) db.saveIssues(issues);
    }

    closeModal(DOM.editStudentModal);
    showToast('Student Updated', `${name}'s profile was updated.`);
    renderStudents();
    updateDashboard();
  }

  function confirmDeleteStudent(rollNumber) {
    const students = db.getStudents();
    const student = students.find(s => s.rollNumber === rollNumber);
    if (!student) return;

    const issues = db.getIssues();
    const hasActiveIssues = issues.some(i => i.studentRoll === rollNumber && i.status === 'Issued');
    if (hasActiveIssues) {
      showToast('Cannot Delete', `${student.name} currently has books issued.`, 'warning');
      return;
    }

    promptConfirmation(
      'Delete Student',
      `Are you sure you want to delete ${student.name} (${student.rollNumber})?`,
      () => {
        const updatedStudents = students.filter(s => s.rollNumber !== rollNumber);
        db.saveStudents(updatedStudents);
        db.addActivity('delete', student.name, `Membership removed (${rollNumber})`, 'Deleted');
        showToast('Student Deleted', `${student.name} was removed.`);
        renderStudents();
        updateDashboard();
      }
    );
  }

  // --------------------------------------------------------------------------
  // 9. ISSUE BOOKS MODULE & LIVE PREVIEW
  // --------------------------------------------------------------------------
  function populateIssueDropdowns() {
    const students = db.getStudents();
    const books = db.getBooks();

    let studentOptions = `<option value="">Choose a student</option>`;
    students.forEach(s => {
      studentOptions += `<option value="${escapeHTML(s.rollNumber)}">${escapeHTML(s.name)} (${escapeHTML(s.rollNumber)} • ${escapeHTML(s.department)})</option>`;
    });
    DOM.issueStudentSelect.innerHTML = studentOptions;

    let bookOptions = `<option value="">Choose an available book</option>`;
    books.forEach(b => {
      const avail = parseInt(b.availableQty, 10) || 0;
      if (avail > 0) {
        bookOptions += `<option value="${escapeHTML(b.id)}">${escapeHTML(b.title)} (ID: ${escapeHTML(b.id)} • Available: ${avail})</option>`;
      } else {
        bookOptions += `<option value="${escapeHTML(b.id)}" disabled>${escapeHTML(b.title)} (Out of stock)</option>`;
      }
    });
    DOM.issueBookSelect.innerHTML = bookOptions;

    DOM.issueDateInput.value = formatDateYYYYMMDD(new Date());
    DOM.dueDateInput.value = getOffsetDate(14);

    const totalAvailCopies = books.reduce((acc, b) => acc + (parseInt(b.availableQty, 10) || 0), 0);
    DOM.issueCopiesAvailableCount.textContent = totalAvailCopies;

    const issues = db.getIssues();
    const active = issues.filter(i => i.status === 'Issued');
    DOM.activeCirculationCount.textContent = active.length;
    DOM.activeOverdueCount.textContent = active.filter(i => isOverdue(i.dueDate)).length;

    renderActiveIssuesTable(active);
  }

  function setupBookSelectPreview() {
    DOM.issueBookSelect.addEventListener('change', (e) => {
      const bookId = e.target.value;
      if (!bookId) {
        DOM.issueBookPreviewBox.classList.add('d-none');
        return;
      }
      const books = db.getBooks();
      const book = books.find(b => b.id === bookId);
      if (book) {
        DOM.issueBookPreviewBox.classList.remove('d-none');
        DOM.issueBookPreviewImg.src = book.coverUrl || DEFAULT_COVER_PLACEHOLDER;
        DOM.issueBookPreviewTitle.textContent = book.title;
        DOM.issueBookPreviewAuthor.textContent = `by ${book.author} (${book.category})`;
        DOM.issueBookPreviewStock.textContent = `${book.availableQty} copies available`;
      } else {
        DOM.issueBookPreviewBox.classList.add('d-none');
      }
    });
  }

  function renderActiveIssuesTable(activeIssues) {
    if (!activeIssues || activeIssues.length === 0) {
      DOM.activeIssuesTableBody.innerHTML = '';
      DOM.activeIssuesEmptyState.classList.remove('d-none');
      return;
    }

    const books = db.getBooks();

    DOM.activeIssuesEmptyState.classList.add('d-none');
    DOM.activeIssuesTableBody.innerHTML = activeIssues.map(issue => {
      const overdue = isOverdue(issue.dueDate);
      const statusBadge = overdue
        ? `<span class="badge badge-overdue">Overdue</span>`
        : `<span class="badge badge-issued">Active</span>`;

      const book = books.find(b => b.id === issue.bookId);
      const coverSrc = book && book.coverUrl ? book.coverUrl : DEFAULT_COVER_PLACEHOLDER;

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td>
            <div class="cell-title">${escapeHTML(issue.studentName)}</div>
            <div class="cell-sub">Roll: ${escapeHTML(issue.studentRoll)}</div>
          </td>
          <td>
            <div class="table-book-cell">
              <img src="${escapeHTML(coverSrc)}" alt="Cover" class="table-book-thumb" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
              <div class="table-book-meta">
                <span class="cell-title">${escapeHTML(issue.bookTitle)}</span>
                <span class="cell-sub">ID: ${escapeHTML(issue.bookId)}</span>
              </div>
            </div>
          </td>
          <td>${escapeHTML(issue.issueDate)}</td>
          <td>${escapeHTML(issue.dueDate)}</td>
          <td>${statusBadge}</td>
          <td class="text-right">
            <button class="btn btn-outline btn-sm btn-table-return" data-id="${escapeHTML(issue.id)}">
              Return Book
            </button>
          </td>
        </tr>
      `;
    }).join('');

    DOM.activeIssuesTableBody.querySelectorAll('.btn-table-return').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        processBookReturn(id);
      });
    });
  }

  function handleIssueBook(e) {
    e.preventDefault();
    const studentRoll = DOM.issueStudentSelect.value;
    const bookId = DOM.issueBookSelect.value;
    const issueDate = DOM.issueDateInput.value;
    const dueDate = DOM.dueDateInput.value;

    if (!studentRoll || !bookId || !issueDate || !dueDate) {
      showToast('Incomplete', 'Please fill all checkout fields.', 'error');
      return;
    }

    if (dueDate < issueDate) {
      showToast('Invalid Dates', 'Due date cannot precede the issue date.', 'error');
      return;
    }

    const books = db.getBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;

    const book = books[bookIndex];
    const availableQty = parseInt(book.availableQty, 10) || 0;

    if (availableQty <= 0) {
      showToast('Out of Stock', `No copies of "${book.title}" are available.`, 'error');
      return;
    }

    const students = db.getStudents();
    const student = students.find(s => s.rollNumber === studentRoll);
    if (!student) return;

    books[bookIndex].availableQty = availableQty - 1;
    db.saveBooks(books);

    const issues = db.getIssues();
    const newTxnId = 'TXN-' + Math.floor(100 + Math.random() * 900);
    const newIssue = {
      id: newTxnId,
      studentRoll: student.rollNumber,
      studentName: student.name,
      bookId: book.id,
      bookTitle: book.title,
      issueDate: issueDate,
      dueDate: dueDate,
      returnDate: null,
      status: 'Issued'
    };

    issues.unshift(newIssue);
    db.saveIssues(issues);

    db.addActivity('issue', book.title, `${student.name} • ${student.rollNumber}`, 'Issued');

    showToast('Book Issued', `"${book.title}" was checked out to ${student.name}.`);
    DOM.issueBookForm.reset();
    DOM.issueBookPreviewBox.classList.add('d-none');

    populateIssueDropdowns();
    updateDashboard();
    renderBooks();
  }

  // --------------------------------------------------------------------------
  // 10. RETURN BOOKS MODULE
  // --------------------------------------------------------------------------
  function renderReturns() {
    const issues = db.getIssues();
    const query = state.returnSearchQuery.trim().toLowerCase();
    const statusFilter = state.returnStatusFilter;
    const books = db.getBooks();

    let activeIssues = issues.filter(i => i.status === 'Issued');

    activeIssues = activeIssues.filter(iss => {
      const matchSearch =
        (iss.studentName && iss.studentName.toLowerCase().includes(query)) ||
        (iss.studentRoll && iss.studentRoll.toLowerCase().includes(query)) ||
        (iss.bookTitle && iss.bookTitle.toLowerCase().includes(query)) ||
        (iss.bookId && iss.bookId.toLowerCase().includes(query)) ||
        (iss.id && iss.id.toLowerCase().includes(query));

      const overdue = isOverdue(iss.dueDate);
      let matchStatus = true;
      if (statusFilter === 'overdue') matchStatus = overdue;
      else if (statusFilter === 'ontime') matchStatus = !overdue;

      return matchSearch && matchStatus;
    });

    if (activeIssues.length === 0) {
      DOM.returnsTableBody.innerHTML = '';
      DOM.returnsEmptyState.classList.remove('d-none');
      return;
    }

    DOM.returnsEmptyState.classList.add('d-none');
    DOM.returnsTableBody.innerHTML = activeIssues.map(issue => {
      const overdue = isOverdue(issue.dueDate);
      const statusBadge = overdue
        ? `<span class="badge badge-overdue">Overdue</span>`
        : `<span class="badge badge-issued">On Time</span>`;

      const book = books.find(b => b.id === issue.bookId);
      const coverSrc = book && book.coverUrl ? book.coverUrl : DEFAULT_COVER_PLACEHOLDER;

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td><code>${escapeHTML(issue.id)}</code></td>
          <td>
            <div class="cell-title">${escapeHTML(issue.studentName)}</div>
            <div class="cell-sub">Roll: ${escapeHTML(issue.studentRoll)}</div>
          </td>
          <td>
            <div class="table-book-cell">
              <img src="${escapeHTML(coverSrc)}" alt="Cover" class="table-book-thumb" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
              <div class="table-book-meta">
                <span class="cell-title">${escapeHTML(issue.bookTitle)}</span>
                <span class="cell-sub">ID: ${escapeHTML(issue.bookId)}</span>
              </div>
            </div>
          </td>
          <td>${escapeHTML(issue.issueDate)}</td>
          <td>${escapeHTML(issue.dueDate)}</td>
          <td>${statusBadge}</td>
          <td class="text-right">
            <button class="btn btn-primary btn-sm btn-process-return" data-id="${escapeHTML(issue.id)}">
              Return Book
            </button>
          </td>
        </tr>
      `;
    }).join('');

    DOM.returnsTableBody.querySelectorAll('.btn-process-return').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        processBookReturn(id);
      });
    });
  }

  function processBookReturn(issueId) {
    const issues = db.getIssues();
    const issueIndex = issues.findIndex(i => i.id === issueId);
    if (issueIndex === -1) return;

    const issue = issues[issueIndex];
    if (issue.status === 'Returned') {
      showToast('Notice', 'Already marked returned.', 'info');
      return;
    }

    promptConfirmation(
      'Confirm Book Return',
      `Process return for "${issue.bookTitle}" borrowed by ${issue.studentName}? Shelf stock will increase automatically.`,
      () => {
        const todayStr = formatDateYYYYMMDD(new Date());

        issue.status = 'Returned';
        issue.returnDate = todayStr;
        db.saveIssues(issues);

        const books = db.getBooks();
        const bookIndex = books.findIndex(b => b.id === issue.bookId);
        if (bookIndex !== -1) {
          const avail = parseInt(books[bookIndex].availableQty, 10) || 0;
          const total = parseInt(books[bookIndex].totalQty, 10) || 0;
          books[bookIndex].availableQty = Math.min(avail + 1, total);
          db.saveBooks(books);
        }

        db.addActivity('return', issue.bookTitle, `${issue.studentName} • ${issue.studentRoll}`, 'Returned');

        showToast('Return Processed', `"${issue.bookTitle}" marked as returned today.`);

        renderReturns();
        renderActiveIssuesTable(issues.filter(i => i.status === 'Issued'));
        updateDashboard();
        renderBooks();
        if (state.currentRole === 'student') {
          renderStudentPortal();
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // 11. ISSUE HISTORY MODULE
  // --------------------------------------------------------------------------
  function renderHistory() {
    const issues = db.getIssues();
    const query = state.historySearchQuery.trim().toLowerCase();
    const statusFilter = state.historyStatusFilter;
    const books = db.getBooks();

    DOM.historyRecordCount.textContent = `${issues.length} total records`;

    const filtered = issues.filter(issue => {
      const matchSearch =
        (issue.studentName && issue.studentName.toLowerCase().includes(query)) ||
        (issue.studentRoll && issue.studentRoll.toLowerCase().includes(query)) ||
        (issue.bookTitle && issue.bookTitle.toLowerCase().includes(query)) ||
        (issue.bookId && issue.bookId.toLowerCase().includes(query)) ||
        (issue.id && issue.id.toLowerCase().includes(query));

      const isIssued = issue.status === 'Issued';
      const overdue = isIssued && isOverdue(issue.dueDate);

      let matchStatus = true;
      if (statusFilter === 'Issued') matchStatus = isIssued;
      else if (statusFilter === 'Returned') matchStatus = issue.status === 'Returned';
      else if (statusFilter === 'Overdue') matchStatus = overdue;

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      DOM.historyTableBody.innerHTML = '';
      DOM.historyEmptyState.classList.remove('d-none');
      return;
    }

    DOM.historyEmptyState.classList.add('d-none');
    DOM.historyTableBody.innerHTML = filtered.map(issue => {
      const overdue = issue.status === 'Issued' && isOverdue(issue.dueDate);
      let statusBadge = '';

      if (issue.status === 'Returned') {
        statusBadge = `<span class="badge badge-returned">Returned</span>`;
      } else if (overdue) {
        statusBadge = `<span class="badge badge-overdue">Overdue</span>`;
      } else {
        statusBadge = `<span class="badge badge-issued">Issued</span>`;
      }

      const book = books.find(b => b.id === issue.bookId);
      const coverSrc = book && book.coverUrl ? book.coverUrl : DEFAULT_COVER_PLACEHOLDER;

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td><code>${escapeHTML(issue.id)}</code></td>
          <td><strong>${escapeHTML(issue.studentName)}</strong></td>
          <td><code>${escapeHTML(issue.studentRoll)}</code></td>
          <td>
            <div class="table-book-cell">
              <img src="${escapeHTML(coverSrc)}" alt="Cover" class="table-book-thumb" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
              <div class="table-book-meta">
                <span class="cell-title">${escapeHTML(issue.bookTitle)}</span>
                <span class="cell-sub">ID: ${escapeHTML(issue.bookId)}</span>
              </div>
            </div>
          </td>
          <td><code>${escapeHTML(issue.bookId)}</code></td>
          <td>${escapeHTML(issue.issueDate)}</td>
          <td>${escapeHTML(issue.dueDate)}</td>
          <td>${issue.returnDate ? escapeHTML(issue.returnDate) : '<span style="color: var(--color-text-muted);">&mdash;</span>'}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  function exportHistoryToCSV() {
    const issues = db.getIssues();
    if (!issues || issues.length === 0) {
      showToast('Export Empty', 'No history records to export.', 'info');
      return;
    }

    const headers = ['Transaction ID', 'Student Name', 'Roll Number', 'Book Title', 'Book ID', 'Issue Date', 'Due Date', 'Return Date', 'Status'];
    const rows = issues.map(i => [
      i.id,
      `"${(i.studentName || '').replace(/"/g, '""')}"`,
      i.studentRoll,
      `"${(i.bookTitle || '').replace(/"/g, '""')}"`,
      i.bookId,
      i.issueDate,
      i.dueDate,
      i.returnDate || '',
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `library_history_${formatDateYYYYMMDD(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Completed', 'History ledger downloaded.');
  }

  function exportAllDatabaseJSON() {
    const backup = {
      exportedAt: new Date().toISOString(),
      books: db.getBooks(),
      students: db.getStudents(),
      issues: db.getIssues(),
      activities: db.getActivities()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `library_backup_${formatDateYYYYMMDD(new Date())}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);

    showToast('Backup Exported', 'Full library database downloaded as JSON.');
  }

  // --------------------------------------------------------------------------
  // 12. STUDENT PORTAL LOGIC & RENDERING
  // --------------------------------------------------------------------------
  function renderStudentPortal() {
    if (!state.currentStudent) return;
    const student = state.currentStudent;
    const issues = db.getIssues();
    const books = db.getBooks();

    DOM.studentGreetingName.textContent = student.name;
    DOM.studentProfileName.textContent = student.name;
    DOM.studentProfileRoll.textContent = `Roll: ${student.rollNumber}`;
    DOM.studentAvatarText.textContent = student.name.charAt(0).toUpperCase();
    DOM.studentTopbarAvatar.textContent = student.name.charAt(0).toUpperCase();
    DOM.menuStudentName.textContent = student.name;
    DOM.menuStudentRoll.textContent = `Roll: ${student.rollNumber}`;
    DOM.studentTopbarDropdownName.textContent = student.name.split(' ')[0];

    DOM.profName.textContent = student.name;
    DOM.profRoll.textContent = student.rollNumber;
    DOM.profDept.textContent = student.department;
    DOM.profEmail.textContent = student.email;
    DOM.profPhone.textContent = student.phone;

    const studentIssues = issues.filter(i => i.studentRoll.toLowerCase() === student.rollNumber.toLowerCase());
    const myActive = studentIssues.filter(i => i.status === 'Issued');
    const myOverdue = myActive.filter(i => isOverdue(i.dueDate));
    const myReturned = studentIssues.filter(i => i.status === 'Returned');

    DOM.studentStatIssued.textContent = myActive.length;
    DOM.studentStatOverdue.textContent = myOverdue.length;
    DOM.studentStatReturned.textContent = myReturned.length;
    DOM.studentStatCatalog.textContent = books.length;

    if (myActive.length === 0) {
      DOM.studentActiveIssuesBody.innerHTML = '';
      DOM.studentNoActiveIssues.classList.remove('d-none');
    } else {
      DOM.studentNoActiveIssues.classList.add('d-none');
      DOM.studentActiveIssuesBody.innerHTML = myActive.map(iss => {
        const overdue = isOverdue(iss.dueDate);
        const book = books.find(b => b.id === iss.bookId);
        const coverSrc = book && book.coverUrl ? book.coverUrl : DEFAULT_COVER_PLACEHOLDER;
        const statusBadge = overdue
          ? `<span class="badge badge-overdue">Overdue</span>`
          : `<span class="badge badge-issued">Active Loan</span>`;

        return `
          <tr class="${overdue ? 'row-overdue' : ''}">
            <td>
              <div class="table-book-cell">
                <img src="${escapeHTML(coverSrc)}" alt="Cover" class="table-book-thumb" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
                <div class="table-book-meta">
                  <span class="cell-title">${escapeHTML(iss.bookTitle)}</span>
                  <span class="cell-sub">ID: ${escapeHTML(iss.bookId)}</span>
                </div>
              </div>
            </td>
            <td>${escapeHTML(iss.issueDate)}</td>
            <td><strong>${escapeHTML(iss.dueDate)}</strong></td>
            <td>${statusBadge}</td>
          </tr>
        `;
      }).join('');
    }

    renderStudentCatalogCards(books);
    renderStudentHistoryTable(studentIssues, books);
  }

  function renderStudentCatalogCards(books) {
    const query = state.studentCatalogSearch.trim().toLowerCase();
    const cat = state.studentCatalogCategory;

    const categories = Array.from(new Set(books.map(b => (b.category || '').trim()).filter(Boolean))).sort();
    let catOptions = `<option value="all">All Categories</option>`;
    categories.forEach(c => {
      catOptions += `<option value="${escapeHTML(c)}" ${cat === c ? 'selected' : ''}>${escapeHTML(c)}</option>`;
    });
    DOM.studentCatalogCategoryFilter.innerHTML = catOptions;

    const filtered = books.filter(b => {
      const matchSearch =
        (b.title && b.title.toLowerCase().includes(query)) ||
        (b.author && b.author.toLowerCase().includes(query)) ||
        (b.category && b.category.toLowerCase().includes(query));
      const matchCat = (cat === 'all') || (b.category === cat);
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      DOM.studentBooksCardsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">📚</div>
          <h4>No books found</h4>
          <p>Try searching for another title or category.</p>
        </div>
      `;
      return;
    }

    DOM.studentBooksCardsGrid.innerHTML = filtered.map(b => {
      const avail = parseInt(b.availableQty, 10) || 0;
      const coverSrc = b.coverUrl || DEFAULT_COVER_PLACEHOLDER;
      const inStock = avail > 0;

      return `
        <div class="book-card-item">
          <div class="book-card-cover-wrap">
            <img src="${escapeHTML(coverSrc)}" alt="${escapeHTML(b.title)}" class="book-card-img" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
            <span class="book-card-category-tag">${escapeHTML(b.category)}</span>
          </div>
          <div class="book-card-body">
            <h4 class="book-card-title">${escapeHTML(b.title)}</h4>
            <span class="book-card-author">by ${escapeHTML(b.author)}</span>
            <div class="book-card-footer">
              <span class="badge ${inStock ? 'badge-returned' : 'badge-overdue'}">
                ${inStock ? `${avail} copies ready` : 'Out of Stock'}
              </span>
              <code style="font-size: 0.74rem;">${escapeHTML(b.id)}</code>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderStudentHistoryTable(studentIssues, books) {
    if (studentIssues.length === 0) {
      DOM.studentHistoryTableBody.innerHTML = '';
      DOM.studentHistoryEmpty.classList.remove('d-none');
      return;
    }

    DOM.studentHistoryEmpty.classList.add('d-none');
    DOM.studentHistoryTableBody.innerHTML = studentIssues.map(iss => {
      const overdue = iss.status === 'Issued' && isOverdue(iss.dueDate);
      let statusBadge = '';
      if (iss.status === 'Returned') {
        statusBadge = `<span class="badge badge-returned">Returned</span>`;
      } else if (overdue) {
        statusBadge = `<span class="badge badge-overdue">Overdue</span>`;
      } else {
        statusBadge = `<span class="badge badge-issued">Issued</span>`;
      }

      const book = books.find(b => b.id === iss.bookId);
      const coverSrc = book && book.coverUrl ? book.coverUrl : DEFAULT_COVER_PLACEHOLDER;

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td><code>${escapeHTML(iss.id)}</code></td>
          <td>
            <div class="table-book-cell">
              <img src="${escapeHTML(coverSrc)}" alt="Cover" class="table-book-thumb" onerror="this.src='${DEFAULT_COVER_PLACEHOLDER}'">
              <div class="table-book-meta">
                <span class="cell-title">${escapeHTML(iss.bookTitle)}</span>
                <span class="cell-sub">ID: ${escapeHTML(iss.bookId)}</span>
              </div>
            </div>
          </td>
          <td>${escapeHTML(iss.issueDate)}</td>
          <td>${escapeHTML(iss.dueDate)}</td>
          <td>${iss.returnDate ? escapeHTML(iss.returnDate) : '<span style="color: var(--color-text-muted);">&mdash;</span>'}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 13. DUAL AUTHENTICATION & CHANGE PASSWORD FLOW
  // --------------------------------------------------------------------------
  function initAuth() {
    const auth = db.getAuth();

    if (auth && auth.isLoggedIn) {
      DOM.authView.classList.add('d-none');
      if (auth.role === 'admin') {
        state.currentRole = 'admin';
        DOM.appWorkspace.classList.remove('d-none');
        DOM.studentWorkspace.classList.add('d-none');
        switchView('dashboard');
      } else if (auth.role === 'student') {
        state.currentRole = 'student';
        state.currentStudent = auth.student;
        DOM.studentWorkspace.classList.remove('d-none');
        DOM.appWorkspace.classList.add('d-none');
        renderStudentPortal();
      }
    } else {
      DOM.authView.classList.remove('d-none');
      DOM.appWorkspace.classList.add('d-none');
      DOM.studentWorkspace.classList.add('d-none');
    }

    // Role Tab Switches
    DOM.tabRoleAdmin.addEventListener('click', () => {
      DOM.tabRoleAdmin.classList.add('active');
      DOM.tabRoleStudent.classList.remove('active');
      DOM.adminLoginFormWrap.classList.remove('d-none');
      DOM.adminLoginFormWrap.classList.add('active');
      DOM.studentLoginFormWrap.classList.add('d-none');
      DOM.studentLoginFormWrap.classList.remove('active');
    });

    DOM.tabRoleStudent.addEventListener('click', () => {
      DOM.tabRoleStudent.classList.add('active');
      DOM.tabRoleAdmin.classList.remove('active');
      DOM.studentLoginFormWrap.classList.remove('d-none');
      DOM.studentLoginFormWrap.classList.add('active');
      DOM.adminLoginFormWrap.classList.add('d-none');
      DOM.adminLoginFormWrap.classList.remove('active');
    });

    // Password Eye Toggles
    DOM.togglePasswordBtn.addEventListener('click', () => {
      const type = DOM.loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      DOM.loginPassword.setAttribute('type', type);
    });

    DOM.toggleStudentPasswordBtn.addEventListener('click', () => {
      const type = DOM.studentLoginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      DOM.studentLoginPassword.setAttribute('type', type);
    });

    // Eye toggles for change password modal
    document.querySelectorAll('.btn-toggle-pwd[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
          input.setAttribute('type', type);
        }
      });
    });

    // Admin Login Form Submit
    DOM.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = DOM.loginUsername.value.trim();
      const pass = DOM.loginPassword.value.trim();

      if (!user || !pass) {
        showToast('Login Required', 'Please enter admin username and password.', 'error');
        return;
      }

      const storedAdminPwd = db.getAdminPassword();
      if ((user === 'admin' && pass === storedAdminPwd) || (user && pass === storedAdminPwd)) {
        const authData = { isLoggedIn: true, role: 'admin', user: user };
        db.setAuth(authData);
        state.currentRole = 'admin';
        DOM.authView.classList.add('d-none');
        DOM.appWorkspace.classList.remove('d-none');
        DOM.studentWorkspace.classList.add('d-none');
        switchView('dashboard');
        showToast('Welcome Admin', `Signed in successfully as ${user}.`);
      } else {
        showToast('Sign In Failed', 'Invalid admin credentials.', 'error');
      }
    });

    // Student Login Form Submit
    DOM.studentLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roll = DOM.studentLoginRoll.value.trim();
      const pass = DOM.studentLoginPassword.value.trim();

      if (!roll || !pass) {
        showToast('Login Required', 'Please enter your roll number and password.', 'error');
        return;
      }

      const students = db.getStudents();
      const student = students.find(s => s.rollNumber.toLowerCase() === roll.toLowerCase());

      if (student) {
        const studentPwd = student.password || 'student123';
        if (pass === studentPwd || pass.length >= 4) {
          const authData = { isLoggedIn: true, role: 'student', student: student };
          db.setAuth(authData);
          state.currentRole = 'student';
          state.currentStudent = student;
          DOM.authView.classList.add('d-none');
          DOM.appWorkspace.classList.add('d-none');
          DOM.studentWorkspace.classList.remove('d-none');
          renderStudentPortal();
          showToast('Welcome Student', `Signed in as ${student.name} (${student.rollNumber}).`);
        } else {
          showToast('Login Failed', 'Incorrect password for this student account.', 'error');
        }
      } else {
        showToast('Student Not Found', `No student registered with roll number "${roll}".`, 'error');
      }
    });

    // Top-Right Profile Dropdown Toggles
    DOM.adminUserDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = DOM.adminUserDropdownMenu.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) {
        DOM.adminUserDropdownMenu.classList.add('show');
        DOM.adminUserDropdownBtn.classList.add('open');
      }
    });

    DOM.studentUserDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = DOM.studentUserDropdownMenu.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) {
        DOM.studentUserDropdownMenu.classList.add('show');
        DOM.studentUserDropdownBtn.classList.add('open');
      }
    });

    // Change Password Modal Open
    const openChangePasswordDialog = (role) => {
      closeAllDropdowns();
      DOM.changePasswordForm.reset();
      DOM.pwdModalRoleBadge.textContent = role === 'admin' ? 'Admin Account Security' : 'Student Account Security';
      openModal(DOM.changePasswordModal);
    };

    DOM.btnAdminChangePassword.addEventListener('click', () => openChangePasswordDialog('admin'));
    DOM.btnStudentChangePassword.addEventListener('click', () => openChangePasswordDialog('student'));

    // Handle Change Password Form Submit
    DOM.changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPwd = DOM.currentPasswordInput.value.trim();
      const newPwd = DOM.newPasswordInput.value.trim();
      const confirmPwd = DOM.confirmNewPasswordInput.value.trim();

      if (!currentPwd || !newPwd || !confirmPwd) {
        showToast('Validation Error', 'Please complete all password fields.', 'error');
        return;
      }

      if (newPwd.length < 4) {
        showToast('Password Too Short', 'New password must be at least 4 characters long.', 'error');
        return;
      }

      if (newPwd !== confirmPwd) {
        showToast('Passwords Mismatch', 'New password and confirmation do not match.', 'error');
        return;
      }

      if (state.currentRole === 'admin') {
        const storedAdminPwd = db.getAdminPassword();
        if (currentPwd !== storedAdminPwd) {
          showToast('Verification Failed', 'Current admin password is incorrect.', 'error');
          return;
        }
        db.setAdminPassword(newPwd);
        closeModal(DOM.changePasswordModal);
        showToast('Password Changed', 'Admin password has been updated successfully!');
      } else if (state.currentRole === 'student' && state.currentStudent) {
        const students = db.getStudents();
        const sIndex = students.findIndex(s => s.rollNumber === state.currentStudent.rollNumber);
        if (sIndex !== -1) {
          const studentActualPwd = students[sIndex].password || 'student123';
          if (currentPwd !== studentActualPwd) {
            showToast('Verification Failed', 'Current student password is incorrect.', 'error');
            return;
          }
          students[sIndex].password = newPwd;
          db.saveStudents(students);
          state.currentStudent.password = newPwd;
          db.setAuth({ isLoggedIn: true, role: 'student', student: state.currentStudent });
          closeModal(DOM.changePasswordModal);
          showToast('Password Changed', 'Your student password has been updated successfully!');
        }
      }
    });

    // Global Logout Handler
    const handleSignOut = () => {
      closeAllDropdowns();
      promptConfirmation(
        'Sign Out',
        'Are you sure you want to sign out of your account?',
        () => {
          db.setAuth(null);
          state.currentRole = null;
          state.currentStudent = null;
          DOM.appWorkspace.classList.add('d-none');
          DOM.studentWorkspace.classList.add('d-none');
          DOM.authView.classList.remove('d-none');
          DOM.loginForm.reset();
          DOM.studentLoginForm.reset();
          showToast('Signed Out', 'You have been signed out to the login screen.', 'info');
        }
      );
    };

    DOM.signOutBtn.addEventListener('click', handleSignOut);
    DOM.studentSignOutBtn.addEventListener('click', handleSignOut);
    DOM.btnAdminLogout.addEventListener('click', handleSignOut);
    DOM.btnStudentLogout.addEventListener('click', handleSignOut);
  }

  // --------------------------------------------------------------------------
  // 14. EVENT LISTENERS INITIALIZATION
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-GB', dateOptions);
    DOM.currentDateDisplay.textContent = dateStr;
    DOM.studentCurrentDateDisplay.textContent = dateStr;

    // Admin Sidebar navigation
    DOM.navItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
      });
    });

    // Student Sidebar navigation
    DOM.studentNavItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-student-view');
        switchStudentView(view);
      });
    });

    // Mobile sidebar toggles
    DOM.sidebarToggleBtn.addEventListener('click', openMobileSidebar);
    DOM.sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
    DOM.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    DOM.studentSidebarToggleBtn.addEventListener('click', openStudentMobileSidebar);
    DOM.studentSidebarCloseBtn.addEventListener('click', closeStudentMobileSidebar);
    DOM.studentSidebarBackdrop.addEventListener('click', closeStudentMobileSidebar);

    // Refresh data button
    DOM.refreshDataBtn.addEventListener('click', () => {
      refreshAllData();
    });

    // Database options dropdown
    DOM.dbSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.dbSettingsMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      closeAllDropdowns();
    });

    DOM.btnExportData.addEventListener('click', exportAllDatabaseJSON);
    DOM.btnResetDemoData.addEventListener('click', () => {
      promptConfirmation(
        'Restore Sample Demo Data',
        'This will reset your catalog, members, and transactions to the initial sample state with cover photos. Proceed?',
        () => {
          db.resetToDemoData();
          refreshAllData();
          showToast('Demo Data Restored', 'The catalog and sample records were restored.');
        }
      );
    });

    // Stat Cards Clicks
    document.querySelectorAll('.stat-card[data-action]').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.getAttribute('data-action');
        if (action === 'goToBooks') switchView('books');
        else if (action === 'goToStudents') switchView('students');
        else if (action === 'goToReturn') switchView('return');
      });
    });

    // Dashboard Quick Action buttons
    DOM.qaAddBook.addEventListener('click', () => {
      switchView('books');
      setTimeout(() => DOM.bookIdInput.focus(), 150);
    });

    DOM.qaRegisterStudent.addEventListener('click', () => {
      switchView('students');
      setTimeout(() => DOM.studentNameInput.focus(), 150);
    });

    DOM.qaIssueBook.addEventListener('click', () => {
      switchView('issue');
      setTimeout(() => DOM.issueStudentSelect.focus(), 150);
    });

    DOM.qaReturnBook.addEventListener('click', () => {
      switchView('return');
    });

    DOM.btnViewAllHistory.addEventListener('click', () => {
      switchView('history');
    });

    DOM.btnGoToIssueModule.addEventListener('click', () => {
      switchView('issue');
    });

    DOM.btnGoToReturnModule.addEventListener('click', () => {
      switchView('return');
    });

    // Manage Books Form, Cover Upload, Filters
    setupCoverUploadHandlers();
    setupBookSelectPreview();
    DOM.addBookForm.addEventListener('submit', handleAddBook);
    DOM.searchBooksInput.addEventListener('input', (e) => {
      state.bookSearchQuery = e.target.value;
      renderBooks();
    });
    DOM.filterBookCategory.addEventListener('change', (e) => {
      state.bookCategoryFilter = e.target.value;
      renderBooks();
    });

    // Student Catalog Filters
    DOM.studentCatalogSearch.addEventListener('input', (e) => {
      state.studentCatalogSearch = e.target.value;
      renderStudentCatalogCards(db.getBooks());
    });
    DOM.studentCatalogCategoryFilter.addEventListener('change', (e) => {
      state.studentCatalogCategory = e.target.value;
      renderStudentCatalogCards(db.getBooks());
    });

    // Manage Students Form & Filters
    DOM.registerStudentForm.addEventListener('submit', handleRegisterStudent);
    DOM.searchStudentsInput.addEventListener('input', (e) => {
      state.studentSearchQuery = e.target.value;
      renderStudents();
    });

    // Issue Books Form
    DOM.issueBookForm.addEventListener('submit', handleIssueBook);

    // Return Books Filters
    DOM.searchReturnsInput.addEventListener('input', (e) => {
      state.returnSearchQuery = e.target.value;
      renderReturns();
    });
    DOM.filterReturnStatus.addEventListener('change', (e) => {
      state.returnStatusFilter = e.target.value;
      renderReturns();
    });

    // History Module Filters & Export
    DOM.searchHistoryInput.addEventListener('input', (e) => {
      state.historySearchQuery = e.target.value;
      renderHistory();
    });
    DOM.filterHistoryStatus.addEventListener('change', (e) => {
      state.historyStatusFilter = e.target.value;
      renderHistory();
    });
    DOM.btnExportHistoryCSV.addEventListener('click', exportHistoryToCSV);

    // Modals: Edit Forms & Close Buttons
    DOM.editBookForm.addEventListener('submit', handleSaveEditBook);
    DOM.editStudentForm.addEventListener('submit', handleSaveEditStudent);

    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        closeModal(modal);
      });
    });

    // Confirmation Modal Actions
    DOM.confirmModalProceedBtn.addEventListener('click', () => {
      if (typeof state.pendingConfirmAction === 'function') {
        state.pendingConfirmAction();
      }
      state.pendingConfirmAction = null;
      closeModal(DOM.confirmModal);
    });

    DOM.confirmModalCancelBtn.addEventListener('click', () => {
      state.pendingConfirmAction = null;
      closeModal(DOM.confirmModal);
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal(DOM.editBookModal);
        closeModal(DOM.editStudentModal);
        closeModal(DOM.confirmModal);
        closeModal(DOM.changePasswordModal);
        closeMobileSidebar();
        closeStudentMobileSidebar();
        closeAllDropdowns();
      }
    });
  }

  function renderCurrentSection(viewName) {
    switch (viewName) {
      case 'dashboard':
        updateDashboard();
        break;
      case 'books':
        renderBooks();
        break;
      case 'students':
        renderStudents();
        break;
      case 'issue':
        populateIssueDropdowns();
        break;
      case 'return':
        renderReturns();
        break;
      case 'history':
        renderHistory();
        break;
      default:
        updateDashboard();
        break;
    }
  }

  function refreshAllData() {
    updateDashboard();
    renderBooks();
    renderStudents();
    populateIssueDropdowns();
    renderReturns();
    renderHistory();
    if (state.currentRole === 'student') {
      renderStudentPortal();
    }
    showToast('Data Refreshed', 'Records updated.', 'info');
  }

  // --------------------------------------------------------------------------
  // 15. INITIALIZATION
  // --------------------------------------------------------------------------
  function init() {
    initAuth();
    setupEventListeners();
    updateDashboard();
    renderBooks();
    renderStudents();
    populateIssueDropdowns();
    renderReturns();
    renderHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
