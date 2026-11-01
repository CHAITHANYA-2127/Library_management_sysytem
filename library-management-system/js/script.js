/**
 * ============================================================================
 * PAGETURN — Professional Library Management System
 * Vanilla JavaScript Application Logic & LocalStorage Database
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STORAGE KEYS & INITIAL DEMO DATA
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    BOOKS: 'pageturn_lms_books_v1',
    STUDENTS: 'pageturn_lms_students_v1',
    ISSUES: 'pageturn_lms_issues_v1',
    ACTIVITIES: 'pageturn_lms_activities_v1',
    AUTH: 'pageturn_lms_auth_v1'
  };

  /**
   * Helper to format a Date into YYYY-MM-DD
   */
  function formatDateYYYYMMDD(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  /**
   * Get an offset date string from today
   */
  function getOffsetDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return formatDateYYYYMMDD(d);
  }

  // Pre-seed sample datasets matching the provided UI screenshots
  const DEFAULT_BOOKS = [
    {
      id: 'BK-101',
      title: 'The Book of Life',
      author: 'Chaithanya',
      category: 'Moral Values',
      totalQty: 6,
      availableQty: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-102',
      title: 'The Art',
      author: 'Suhana',
      category: 'Art',
      totalQty: 6,
      availableQty: 6,
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-103',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Programming',
      totalQty: 5,
      availableQty: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'BK-104',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      category: 'Fiction',
      totalQty: 4,
      availableQty: 4,
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
      createdAt: new Date().toISOString()
    },
    {
      rollNumber: '123',
      name: 'Suhana',
      department: 'CSE',
      email: 'suhana@example.com',
      phone: '+1 555-014-9823',
      createdAt: new Date().toISOString()
    },
    {
      rollNumber: '23CSE101',
      name: 'Alex Morgan',
      department: 'CSE',
      email: 'alex.morgan@campus.edu',
      phone: '+1 555-012-3456',
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
      dueDate: getOffsetDate(-6), // Overdue!
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
      // Initialize only if empty, never overwrite existing user data
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
    }

    resetToDemoData() {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(DEFAULT_BOOKS));
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(DEFAULT_ISSUES));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
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
      // Keep only top 30 activities
      if (activities.length > 30) activities.pop();
      this.saveActivities(activities);
    }

    getAuth() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || { isLoggedIn: true, user: 'admin' };
      } catch (e) {
        return { isLoggedIn: true, user: 'admin' };
      }
    }

    setAuth(authData) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    }
  }

  const db = new Database();

  // --------------------------------------------------------------------------
  // 3. UI STATE & DOM REFERENCES
  // --------------------------------------------------------------------------
  const state = {
    currentView: 'dashboard',
    bookSearchQuery: '',
    bookCategoryFilter: 'all',
    studentSearchQuery: '',
    returnSearchQuery: '',
    returnStatusFilter: 'all',
    historySearchQuery: '',
    historyStatusFilter: 'all',
    pendingConfirmAction: null
  };

  const DOM = {
    // Auth elements
    authView: document.getElementById('authView'),
    appWorkspace: document.getElementById('appWorkspace'),
    loginForm: document.getElementById('loginForm'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    togglePasswordBtn: document.getElementById('togglePasswordBtn'),
    autoFillDemoBtn: document.getElementById('autoFillDemoBtn'),
    demoAccessBox: document.getElementById('demoAccessBox'),
    signOutBtn: document.getElementById('signOutBtn'),

    // Topbar & Navigation
    appSidebar: document.getElementById('appSidebar'),
    sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
    sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    breadcrumbSection: document.getElementById('breadcrumbSection'),
    currentDateDisplay: document.getElementById('currentDateDisplay'),
    refreshDataBtn: document.getElementById('refreshDataBtn'),
    sidebarReturnBadge: document.getElementById('sidebarReturnBadge'),
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.content-section'),

    // Database Actions Dropdown
    dbSettingsBtn: document.getElementById('dbSettingsBtn'),
    dbSettingsMenu: document.getElementById('dbSettingsMenu'),
    btnExportData: document.getElementById('btnExportData'),
    btnResetDemoData: document.getElementById('btnResetDemoData'),

    // Dashboard elements
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

    // Books Module
    booksTotalBadge: document.getElementById('booksTotalBadge'),
    booksAvailableSubtitle: document.getElementById('booksAvailableSubtitle'),
    addBookForm: document.getElementById('addBookForm'),
    bookIdInput: document.getElementById('bookIdInput'),
    bookTitleInput: document.getElementById('bookTitleInput'),
    bookAuthorInput: document.getElementById('bookAuthorInput'),
    bookCategoryInput: document.getElementById('bookCategoryInput'),
    bookQuantityInput: document.getElementById('bookQuantityInput'),
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

    // Issue Books Module
    issueBookForm: document.getElementById('issueBookForm'),
    issueStudentSelect: document.getElementById('issueStudentSelect'),
    issueBookSelect: document.getElementById('issueBookSelect'),
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

    // Modals
    editBookModal: document.getElementById('editBookModal'),
    editBookForm: document.getElementById('editBookForm'),
    editBookOriginalId: document.getElementById('editBookOriginalId'),
    editBookId: document.getElementById('editBookId'),
    editBookTitle: document.getElementById('editBookTitle'),
    editBookAuthor: document.getElementById('editBookAuthor'),
    editBookCategory: document.getElementById('editBookCategory'),
    editBookTotalQty: document.getElementById('editBookTotalQty'),
    editBookAvailableQty: document.getElementById('editBookAvailableQty'),

    editStudentModal: document.getElementById('editStudentModal'),
    editStudentForm: document.getElementById('editStudentForm'),
    editStudentOriginalRoll: document.getElementById('editStudentOriginalRoll'),
    editStudentRoll: document.getElementById('editStudentRoll'),
    editStudentName: document.getElementById('editStudentName'),
    editStudentDept: document.getElementById('editStudentDept'),
    editStudentEmail: document.getElementById('editStudentEmail'),
    editStudentPhone: document.getElementById('editStudentPhone'),

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

  /**
   * Helper to check if a due date is overdue compared to today
   */
  function isOverdue(dueDateStr) {
    if (!dueDateStr) return false;
    const today = formatDateYYYYMMDD(new Date());
    return dueDateStr < today;
  }

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

    // Update active nav button
    DOM.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active content section
    DOM.sections.forEach(section => {
      if (section.id === `section-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update breadcrumb
    DOM.breadcrumbSection.textContent = VIEW_TITLES[viewName];

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Re-render data for the newly opened section
    renderCurrentSection(viewName);
  }

  function closeMobileSidebar() {
    DOM.appSidebar.classList.remove('open');
    DOM.sidebarBackdrop.classList.remove('show');
  }

  function openMobileSidebar() {
    DOM.appSidebar.classList.add('open');
    DOM.sidebarBackdrop.classList.add('show');
  }

  // --------------------------------------------------------------------------
  // 6. DASHBOARD MODULE RENDERING & STATS
  // --------------------------------------------------------------------------
  function updateDashboard() {
    const books = db.getBooks();
    const students = db.getStudents();
    const issues = db.getIssues();
    const activities = db.getActivities();

    // 1. Total copies and unique titles
    const totalTitles = books.length;
    const totalBooksCopies = books.reduce((acc, b) => acc + (parseInt(b.totalQty, 10) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (parseInt(b.availableQty, 10) || 0), 0);

    // Active issues (status === 'Issued')
    const activeIssues = issues.filter(i => i.status === 'Issued');
    const issuedCount = activeIssues.length;

    // Overdue count
    const overdueCount = activeIssues.filter(i => isOverdue(i.dueDate)).length;

    // Registered students count
    const studentCount = students.length;

    // Update Stat Cards (Requirement 2)
    DOM.statTotalBooks.textContent = totalBooksCopies;
    DOM.statTotalTitles.textContent = totalTitles;
    DOM.statAvailableBooks.textContent = availableCopies;
    DOM.statIssuedBooks.textContent = issuedCount;
    DOM.statOverdueWarning.textContent = `${overdueCount} overdue`;
    DOM.statRegisteredStudents.textContent = studentCount;

    // Sidebar badge for active returns awaiting
    DOM.sidebarReturnBadge.textContent = issuedCount;

    // Circulation percentage
    const circulationPercent = totalBooksCopies > 0
      ? Math.round((issuedCount / totalBooksCopies) * 100)
      : 0;
    DOM.statsCirculationPercent.textContent = `${circulationPercent}%`;
    DOM.statsCirculationBar.style.width = `${Math.min(circulationPercent, 100)}%`;

    // In Stock vs Out of Stock Titles
    const inStockTitles = books.filter(b => (parseInt(b.availableQty, 10) || 0) > 0).length;
    const outOfStockTitles = books.filter(b => (parseInt(b.availableQty, 10) || 0) <= 0).length;
    DOM.statsInStockTitles.textContent = `${inStockTitles} titles`;
    DOM.statsOutOfStockTitles.textContent = `${outOfStockTitles} titles`;

    // Category breakdown
    renderDashboardCategories(books);

    // Recent Activity List
    renderDashboardActivities(activities);

    // Recent Book Issues Table
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

    // Attach event listeners for inline return buttons
    DOM.dashboardRecentIssuesTable.querySelectorAll('.btn-quick-return').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const issueId = e.currentTarget.getAttribute('data-id');
        processBookReturn(issueId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. MANAGE BOOKS MODULE
  // --------------------------------------------------------------------------
  function renderBooks() {
    const books = db.getBooks();
    const query = state.bookSearchQuery.trim().toLowerCase();
    const catFilter = state.bookCategoryFilter;

    // Update available copies subtitle and total badge
    const totalCopies = books.reduce((acc, b) => acc + (parseInt(b.totalQty, 10) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (parseInt(b.availableQty, 10) || 0), 0);
    DOM.booksTotalBadge.textContent = `${books.length} titles`;
    DOM.booksAvailableSubtitle.textContent = `${availableCopies} copies available (of ${totalCopies} total)`;

    // Populate Category Filter dropdown dynamically
    updateBookCategoryDropdown(books);

    // Filter books
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

      return `
        <tr>
          <td>
            <div class="cell-title">${escapeHTML(book.title)}</div>
            <div class="cell-sub">by ${escapeHTML(book.author)}</div>
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

    // Attach row action listeners
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

  function handleAddBook(e) {
    e.preventDefault();
    const id = DOM.bookIdInput.value.trim();
    const title = DOM.bookTitleInput.value.trim();
    const author = DOM.bookAuthorInput.value.trim();
    const category = DOM.bookCategoryInput.value.trim();
    const totalQty = parseInt(DOM.bookQuantityInput.value, 10);

    // Validation
    if (!id || !title || !author || !category) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    if (isNaN(totalQty) || totalQty <= 0) {
      showToast('Validation Error', 'Quantity must be a positive integer greater than zero.', 'error');
      return;
    }

    const books = db.getBooks();

    // Prevent duplicate Book ID (Requirement 4)
    const exists = books.some(b => b.id.toLowerCase() === id.toLowerCase());
    if (exists) {
      showToast('Duplicate Book ID', `A book with ID "${id}" already exists. Please choose a unique ID.`, 'error');
      return;
    }

    const newBook = {
      id: id,
      title: title,
      author: author,
      category: category,
      totalQty: totalQty,
      availableQty: totalQty,
      createdAt: new Date().toISOString()
    };

    books.push(newBook);
    db.saveBooks(books);
    db.addActivity('add', newBook.title, `Added to catalog (Qty: ${totalQty})`, 'Added');

    showToast('Book Added', `"${newBook.title}" has been added to the library catalog.`);
    DOM.addBookForm.reset();
    DOM.bookQuantityInput.value = '1';

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

    if (!newId || !title || !author || !category) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    if (isNaN(totalQty) || totalQty <= 0) {
      showToast('Validation Error', 'Total quantity must be greater than zero.', 'error');
      return;
    }

    if (isNaN(availableQty) || availableQty < 0) {
      showToast('Validation Error', 'Available quantity cannot be negative.', 'error');
      return;
    }

    if (availableQty > totalQty) {
      showToast('Validation Error', 'Available quantity cannot exceed total quantity.', 'error');
      return;
    }

    const books = db.getBooks();

    // Check for ID collision if changed
    if (newId.toLowerCase() !== originalId.toLowerCase()) {
      const exists = books.some(b => b.id.toLowerCase() === newId.toLowerCase());
      if (exists) {
        showToast('Duplicate Book ID', `Book ID "${newId}" is already taken by another book.`, 'error');
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
      updatedAt: new Date().toISOString()
    };

    db.saveBooks(books);

    // If ID changed, update linked records in issues & history
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
    showToast('Book Updated', `Book "${title}" has been successfully updated.`);
    renderBooks();
    updateDashboard();
  }

  function confirmDeleteBook(bookId) {
    const books = db.getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Check if book has active issued copies
    const issues = db.getIssues();
    const hasActiveIssues = issues.some(i => i.bookId === bookId && i.status === 'Issued');
    if (hasActiveIssues) {
      showToast('Cannot Delete', `"${book.title}" cannot be deleted because copies are currently issued to students. Return them first.`, 'warning');
      return;
    }

    promptConfirmation(
      'Delete Book',
      `Are you sure you want to delete "${book.title}" (ID: ${book.id}) from the catalog? This action cannot be undone.`,
      () => {
        const updatedBooks = books.filter(b => b.id !== bookId);
        db.saveBooks(updatedBooks);
        db.addActivity('delete', book.title, `Removed from catalog`, 'Deleted');
        showToast('Book Deleted', `"${book.title}" was removed from the catalog.`);
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

    // Attach row action listeners
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

    // Validation
    if (!name || !roll || !dept || !email || !phone) {
      showToast('Validation Error', 'Please complete all student information fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Validation Error', 'Please enter a valid email address.', 'error');
      return;
    }

    const students = db.getStudents();

    // Prevent duplicate Roll Number (Requirement 5)
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
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    db.saveStudents(students);
    db.addActivity('register', newStudent.name, `Registered in ${dept} (${roll})`, 'Registered');

    showToast('Student Registered', `${newStudent.name} (${roll}) was successfully registered.`);
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
      showToast('Validation Error', 'Please complete all student information fields.', 'error');
      return;
    }

    const students = db.getStudents();

    if (newRoll.toLowerCase() !== originalRoll.toLowerCase()) {
      const exists = students.some(s => s.rollNumber.toLowerCase() === newRoll.toLowerCase());
      if (exists) {
        showToast('Duplicate Roll Number', `Roll Number "${newRoll}" is already assigned to another student.`, 'error');
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

    // Update issues if roll or name changed
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
    showToast('Student Updated', `${name}'s profile was successfully updated.`);
    renderStudents();
    updateDashboard();
  }

  function confirmDeleteStudent(rollNumber) {
    const students = db.getStudents();
    const student = students.find(s => s.rollNumber === rollNumber);
    if (!student) return;

    // Check if student has active issued books
    const issues = db.getIssues();
    const hasActiveIssues = issues.some(i => i.studentRoll === rollNumber && i.status === 'Issued');
    if (hasActiveIssues) {
      showToast('Cannot Delete', `${student.name} currently has books issued. They must return all borrowed books first.`, 'warning');
      return;
    }

    promptConfirmation(
      'Delete Student',
      `Are you sure you want to delete ${student.name} (${student.rollNumber})? This will remove their library membership.`,
      () => {
        const updatedStudents = students.filter(s => s.rollNumber !== rollNumber);
        db.saveStudents(updatedStudents);
        db.addActivity('delete', student.name, `Membership removed (${rollNumber})`, 'Deleted');
        showToast('Student Deleted', `${student.name} was removed from the member directory.`);
        renderStudents();
        updateDashboard();
      }
    );
  }

  // --------------------------------------------------------------------------
  // 9. ISSUE BOOKS MODULE
  // --------------------------------------------------------------------------
  function populateIssueDropdowns() {
    const students = db.getStudents();
    const books = db.getBooks();

    // Populate Students Dropdown
    let studentOptions = `<option value="">Choose a student</option>`;
    students.forEach(s => {
      studentOptions += `<option value="${escapeHTML(s.rollNumber)}">${escapeHTML(s.name)} (${escapeHTML(s.rollNumber)} • ${escapeHTML(s.department)})</option>`;
    });
    DOM.issueStudentSelect.innerHTML = studentOptions;

    // Populate Books Dropdown (Show only books with availableQty > 0 per Requirement 6)
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

    // Set default dates: Issue = today, Due = today + 14 days
    DOM.issueDateInput.value = formatDateYYYYMMDD(new Date());
    DOM.dueDateInput.value = getOffsetDate(14);

    // Update Right Panel Good to Know Stats
    const totalAvailCopies = books.reduce((acc, b) => acc + (parseInt(b.availableQty, 10) || 0), 0);
    DOM.issueCopiesAvailableCount.textContent = totalAvailCopies;

    const issues = db.getIssues();
    const active = issues.filter(i => i.status === 'Issued');
    DOM.activeCirculationCount.textContent = active.length;
    DOM.activeOverdueCount.textContent = active.filter(i => isOverdue(i.dueDate)).length;

    renderActiveIssuesTable(active);
  }

  function renderActiveIssuesTable(activeIssues) {
    if (!activeIssues || activeIssues.length === 0) {
      DOM.activeIssuesTableBody.innerHTML = '';
      DOM.activeIssuesEmptyState.classList.remove('d-none');
      return;
    }

    DOM.activeIssuesEmptyState.classList.add('d-none');
    DOM.activeIssuesTableBody.innerHTML = activeIssues.map(issue => {
      const overdue = isOverdue(issue.dueDate);
      const statusBadge = overdue
        ? `<span class="badge badge-overdue">Overdue</span>`
        : `<span class="badge badge-issued">Active</span>`;

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td>
            <div class="cell-title">${escapeHTML(issue.studentName)}</div>
            <div class="cell-sub">Roll: ${escapeHTML(issue.studentRoll)}</div>
          </td>
          <td>
            <div class="cell-title">${escapeHTML(issue.bookTitle)}</div>
            <div class="cell-sub">ID: ${escapeHTML(issue.bookId)}</div>
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

    if (!studentRoll) {
      showToast('Selection Missing', 'Please select a registered student.', 'error');
      return;
    }

    if (!bookId) {
      showToast('Selection Missing', 'Please select a book to issue.', 'error');
      return;
    }

    if (!issueDate || !dueDate) {
      showToast('Date Missing', 'Please specify both issue and due dates.', 'error');
      return;
    }

    if (dueDate < issueDate) {
      showToast('Invalid Dates', 'Due date cannot be earlier than the issue date.', 'error');
      return;
    }

    const books = db.getBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      showToast('Error', 'Selected book was not found.', 'error');
      return;
    }

    const book = books[bookIndex];
    const availableQty = parseInt(book.availableQty, 10) || 0;

    // Prevent issuing books when stock is zero (Requirement 6)
    if (availableQty <= 0) {
      showToast('Out of Stock', `No copies of "${book.title}" are currently available.`, 'error');
      return;
    }

    const students = db.getStudents();
    const student = students.find(s => s.rollNumber === studentRoll);
    if (!student) {
      showToast('Error', 'Selected student was not found.', 'error');
      return;
    }

    // Automatically decrease available quantity
    books[bookIndex].availableQty = availableQty - 1;
    db.saveBooks(books);

    // Create new issue record
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

    // Log recent activity
    db.addActivity('issue', book.title, `${student.name} • ${student.rollNumber}`, 'Issued');

    showToast('Book Issued', `"${book.title}" has been checked out to ${student.name}.`);
    DOM.issueBookForm.reset();

    // Refresh UI
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

    // Filter to active issues
    let activeIssues = issues.filter(i => i.status === 'Issued');

    // Filter by search query
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

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td><code>${escapeHTML(issue.id)}</code></td>
          <td>
            <div class="cell-title">${escapeHTML(issue.studentName)}</div>
            <div class="cell-sub">Roll: ${escapeHTML(issue.studentRoll)}</div>
          </td>
          <td>
            <div class="cell-title">${escapeHTML(issue.bookTitle)}</div>
            <div class="cell-sub">ID: ${escapeHTML(issue.bookId)}</div>
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
    if (issueIndex === -1) {
      showToast('Error', 'Transaction record not found.', 'error');
      return;
    }

    const issue = issues[issueIndex];

    // Prevent duplicate returns (Requirement 7)
    if (issue.status === 'Returned') {
      showToast('Notice', 'This book has already been marked as returned.', 'info');
      return;
    }

    promptConfirmation(
      'Confirm Book Return',
      `Process return for "${issue.bookTitle}" borrowed by ${issue.studentName} (${issue.studentRoll})? Available stock will be updated automatically.`,
      () => {
        const todayStr = formatDateYYYYMMDD(new Date());

        // Update issue status & return date
        issue.status = 'Returned';
        issue.returnDate = todayStr;
        db.saveIssues(issues);

        // Automatically increase available quantity (Requirement 7)
        const books = db.getBooks();
        const bookIndex = books.findIndex(b => b.id === issue.bookId);
        if (bookIndex !== -1) {
          const avail = parseInt(books[bookIndex].availableQty, 10) || 0;
          const total = parseInt(books[bookIndex].totalQty, 10) || 0;
          books[bookIndex].availableQty = Math.min(avail + 1, total);
          db.saveBooks(books);
        }

        // Add recent activity
        db.addActivity('return', issue.bookTitle, `${issue.studentName} • ${issue.studentRoll}`, 'Returned');

        showToast('Return Processed', `"${issue.bookTitle}" was marked as returned today.`);

        // Re-render
        renderReturns();
        renderActiveIssuesTable(issues.filter(i => i.status === 'Issued'));
        updateDashboard();
        renderBooks();
      }
    );
  }

  // --------------------------------------------------------------------------
  // 11. ISSUE HISTORY MODULE (Requirement 8)
  // --------------------------------------------------------------------------
  function renderHistory() {
    const issues = db.getIssues();
    const query = state.historySearchQuery.trim().toLowerCase();
    const statusFilter = state.historyStatusFilter;

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
      if (statusFilter === 'Issued') {
        matchStatus = isIssued;
      } else if (statusFilter === 'Returned') {
        matchStatus = issue.status === 'Returned';
      } else if (statusFilter === 'Overdue') {
        matchStatus = overdue;
      }

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

      return `
        <tr class="${overdue ? 'row-overdue' : ''}">
          <td><code>${escapeHTML(issue.id)}</code></td>
          <td><strong>${escapeHTML(issue.studentName)}</strong></td>
          <td><code>${escapeHTML(issue.studentRoll)}</code></td>
          <td>${escapeHTML(issue.bookTitle)}</td>
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
    link.setAttribute('download', `pageturn_library_history_${formatDateYYYYMMDD(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Completed', 'Issue history downloaded as CSV file.');
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
    dlAnchor.setAttribute('download', `pageturn_backup_${formatDateYYYYMMDD(new Date())}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);

    showToast('Backup Exported', 'Full library database downloaded as JSON.');
  }

  // --------------------------------------------------------------------------
  // 12. MASTER SECTION ROUTER & REFRESH
  // --------------------------------------------------------------------------
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
    showToast('Data Refreshed', 'All library records and statistics are up to date.', 'info');
  }

  // --------------------------------------------------------------------------
  // 13. AUTHENTICATION & LOGIN FLOW
  // --------------------------------------------------------------------------
  function initAuth() {
    const auth = db.getAuth();

    if (auth && auth.isLoggedIn) {
      DOM.authView.classList.add('d-none');
      DOM.appWorkspace.classList.remove('d-none');
      switchView('dashboard');
    } else {
      DOM.authView.classList.remove('d-none');
      DOM.appWorkspace.classList.add('d-none');
    }

    // Toggle password visibility
    DOM.togglePasswordBtn.addEventListener('click', () => {
      const type = DOM.loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      DOM.loginPassword.setAttribute('type', type);
    });

    // Auto-fill demo credentials
    DOM.autoFillDemoBtn.addEventListener('click', () => {
      DOM.loginUsername.value = 'admin';
      DOM.loginPassword.value = 'Library@123';
      showToast('Demo Credentials Filled', 'Username: admin | Password: Library@123', 'info');
    });

    // Handle Login Form Submit
    DOM.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = DOM.loginUsername.value.trim();
      const pass = DOM.loginPassword.value.trim();

      // Demo login validation
      if ((user === 'admin' && pass === 'Library@123') || (user && pass.length >= 4)) {
        db.setAuth({ isLoggedIn: true, user: user });
        DOM.authView.classList.add('d-none');
        DOM.appWorkspace.classList.remove('d-none');
        switchView('dashboard');
        showToast('Welcome back', `Signed in successfully as ${user}.`);
      } else {
        showToast('Sign In Failed', 'Invalid username or password. Check demo credentials.', 'error');
      }
    });

    // Sign out button
    DOM.signOutBtn.addEventListener('click', () => {
      promptConfirmation(
        'Sign Out',
        'Are you sure you want to sign out of the library admin workspace?',
        () => {
          db.setAuth({ isLoggedIn: false, user: null });
          DOM.appWorkspace.classList.add('d-none');
          DOM.authView.classList.remove('d-none');
          showToast('Signed Out', 'You have been logged out of the workspace.', 'info');
        }
      );
    });
  }

  // --------------------------------------------------------------------------
  // 14. EVENT LISTENERS INITIALIZATION
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Live date display in topbar
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    DOM.currentDateDisplay.textContent = new Date().toLocaleDateString('en-GB', dateOptions);

    // Sidebar navigation clicks
    DOM.navItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
      });
    });

    // Mobile sidebar toggle
    DOM.sidebarToggleBtn.addEventListener('click', openMobileSidebar);
    DOM.sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
    DOM.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

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
      DOM.dbSettingsMenu.classList.remove('show');
    });

    DOM.btnExportData.addEventListener('click', exportAllDatabaseJSON);
    DOM.btnResetDemoData.addEventListener('click', () => {
      promptConfirmation(
        'Restore Sample Demo Data',
        'This will reset your library database to the initial demo records. Any custom changes will be replaced. Proceed?',
        () => {
          db.resetToDemoData();
          refreshAllData();
          showToast('Demo Data Restored', 'The sample catalog, members, and circulation records were reset.');
        }
      );
    });

    // Stat Cards Clicks (navigate to corresponding section)
    document.querySelectorAll('.stat-card').forEach(card => {
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

    // Manage Books Form & Filters
    DOM.addBookForm.addEventListener('submit', handleAddBook);
    DOM.searchBooksInput.addEventListener('input', (e) => {
      state.bookSearchQuery = e.target.value;
      renderBooks();
    });
    DOM.filterBookCategory.addEventListener('change', (e) => {
      state.bookCategoryFilter = e.target.value;
      renderBooks();
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
        closeMobileSidebar();
      }
    });
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

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
