let allCategoriesCollapsed = false;  // false=已全部展开, true=已全部折叠
let allSpacesCollapsed = false;      // false=已全部展开, true=已全部折叠
let currentType = 'home';
let currentCategory = 'base';
let collapseStates = {
    home: {
        base: false,      // false=展开，true=折叠
        auxiliary: false,
        furniture: false,
        other: false
    },
    commercial: {
        base: false,
        auxiliary: false,
        furniture: false,
        other: false
    }
};



function ensureProjectData() {
    // 确保基本结构存在即可
    if (!projectData.spaces) {
        projectData.spaces = { home: [], commercial: [] };
    }
    if (!projectData.library) {
        projectData.library = [];
    }
}

function initPage() {
    console.log('页面初始化开始...');
    
    // 确保数据存在
    ensureProjectData();
    
    // 先加载本地数据
    if (typeof loadDataFromStorage === 'function') {
        loadDataFromStorage();
    }
    
    // 只需要确保数据已经初始化
    if (typeof initializeData === 'function') {
        initializeData();
    }
    
    // 检测设备类型并设置初始显示
    detectDeviceAndSetDisplay();
    
    // 监听窗口大小变化，调整显示
    window.addEventListener('resize', detectDeviceAndSetDisplay);
    
    // 确保数据正确初始化
    if (!projectData.home.other) projectData.home.other = [];
    if (!projectData.commercial.other) projectData.commercial.other = [];
    
    setupTabs();
    bindEventListeners();
    renderSpaceLibrary();
    updateAllSummaries();
    
    // 初始化项目名称输入框
    const projectNameInput1 = document.getElementById('projectNameInput');
    const projectNameInput2 = document.getElementById('projectNameInput2');
    if (projectNameInput1) projectNameInput1.value = projectData.projectName || '';
    if (projectNameInput2) projectNameInput2.value = projectData.projectName || '';
    
    // 渲染初始项目列表
    renderProjectList('home', 'base');
    renderProjectList('home', 'auxiliary');
    renderProjectList('home', 'furniture');
    renderProjectList('home', 'other');
    
    // 延迟初始化空间筛选器
    setTimeout(() => {
        initializeAllSpaceFilters();
    }, 300);
    
    // 初始化表格编辑功能
    setTimeout(() => {
        initTableEditing();
        console.log('表格编辑功能已启用');
    }, 500);
    
    // 添加：初始化折叠状态
    setTimeout(() => {
        initializeCollapseStates();
        
        // 初始化按钮状态
        const toggleAllBtn = document.getElementById('toggleAllCategoriesBtn');
        const toggleSpaceBtn = document.getElementById('toggleAllSpacesBtn');
        
        if (toggleAllBtn) {
            const icon = toggleAllBtn.querySelector('i');
            const text = toggleAllBtn.querySelector('.btn-text');
            if (icon && text) {
                icon.className = allCategoriesCollapsed ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up';
                text.textContent = allCategoriesCollapsed ? '全部展开' : '全部折叠';
            }
        }
        
        if (toggleSpaceBtn) {
            const icon = toggleSpaceBtn.querySelector('i');
            const text = toggleSpaceBtn.querySelector('.btn-text');
            if (icon && text) {
                icon.className = allSpacesCollapsed ? 'fas fa-layer-group' : 'fas fa-expand';
                text.textContent = allSpacesCollapsed ? '空间打开' : '空间折叠';
            }
        }
    }, 100);
    
    console.log('页面初始化完成');
    
    // === 关键修复：确保键盘事件绑定在页面完全加载后 ===
    setTimeout(() => {
        console.log('绑定键盘快捷键监听器...');
        setupKeyboardShortcuts();
    }, 500);
}

// 新的独立键盘快捷键设置函数
function setupKeyboardShortcuts() {
    // 移除可能存在的旧监听器
    document.removeEventListener('keydown', handleKeyboardShortcuts);
    window.removeEventListener('keydown', handleKeyboardShortcuts);
    
    // 添加新的监听器到window对象
    window.addEventListener('keydown', handleKeyboardShortcuts, true); // 使用捕获阶段
    
    console.log('键盘快捷键监听器已设置');
}
// 从本地存储加载数据
function loadDataFromStorage() {
    const saved = localStorage.getItem('decorProjectData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // 合并保存的数据，确保所有必要的字段都存在
            projectData = {
                ...projectData,
                ...parsed,
                home: { ...projectData.home, ...(parsed.home || {}) },
                commercial: { ...projectData.commercial, ...(parsed.commercial || {}) },
                spaces: { ...projectData.spaces, ...(parsed.spaces || {}) }
            };
        } catch (e) {
            console.error('加载数据失败:', e);
        }
    }
}

// 保存数据到本地存储
function saveDataToStorage() {
    try {
        localStorage.setItem('decorProjectData', JSON.stringify(projectData));
    } catch (e) {
        console.error('保存数据失败:', e);
    }
}

// 生成项目ID
function generateProjectId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}





// 登录功能脚本
// 登录功能脚本
document.addEventListener('DOMContentLoaded', function() {
    // 添加调试信息
    console.log('页面加载完成，检查登录状态');
    
    // 检查是否已登录
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    console.log('登录状态:', isLoggedIn);
    
    if (isLoggedIn === 'true') {
        console.log('已登录，显示主应用');
        showMainApp();
    } else {
        console.log('未登录，显示登录界面');
        // 显示登录界面
        document.getElementById('login-container').style.display = 'flex';
        
        // 绑定登录按钮事件
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
        }
        
        // 绑定回车键登录
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }
        
        // 绑定用户名输入框的回车键
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('password').focus();
                }
            });
        }
    }
});
// 修改后的登录处理函数
async function handleLogin() {
    console.log('处理登录...');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('login-button');
    const loginLoading = document.getElementById('login-loading');
    const loginError = document.getElementById('login-error');
    
    // 验证输入
    if (!username || !password) {
        loginError.textContent = '请输入用户名和密码';
        loginError.style.color = '#f59e0b';
        return;
    }
    
    // 显示加载中
    if (loginButton) loginButton.style.display = 'none';
    if (loginLoading) loginLoading.style.display = 'block';
    if (loginError) {
        loginError.textContent = '';
        loginError.style.color = '';
    }
    
    try {
        let cloudUsers = [];
        try {
            // 尝试从云端加载用户数据
            cloudUsers = await loadCloudUsers();
            console.log('从云端加载用户成功');
        } catch (cloudError) {
            console.warn('云端用户加载失败，使用本地用户:', cloudError);
            cloudUsers = [];
        }
        
        // 本地默认用户作为后备
        const localUsers = [
            
            { username: 'qiyu', password: '8418', name: '系统管理员', isAdmin: true },
            
        ];
        
        // 合并用户列表（云端用户优先）
        const validUsers = [...cloudUsers, ...localUsers];
        
        // 查找匹配的用户
        const user = validUsers.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log('登录成功:', user.name);
            
            // 设置登录状态
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userName', user.name);
            sessionStorage.setItem('userRole', user.isAdmin ? 'admin' : 'user');
            
            // 显示成功消息
            if (loginError) {
                loginError.textContent = '登录成功，正在跳转...';
                loginError.style.color = '#10b981';
            }
            
            // 延迟后显示主应用
            setTimeout(() => {
                showMainApp();
            }, 800);
        } else {
            console.log('登录失败：用户名或密码错误');
            if (loginError) {
                loginError.textContent = '用户名或密码错误';
                loginError.style.color = '#ef4444';
            }
            if (loginButton) loginButton.style.display = 'block';
            if (loginLoading) loginLoading.style.display = 'none';
        }
    } catch (error) {
        console.error('登录失败:', error);
        if (loginError) {
            loginError.textContent = '登录失败，请重试';
            loginError.style.color = '#ef4444';
        }
        if (loginButton) loginButton.style.display = 'block';
        if (loginLoading) loginLoading.style.display = 'none';
    }
}

// 优化 loadCloudUsers 函数，确保能正确提取用户数据
async function loadCloudUsers() {
    const cloudUrl = 'https://gist.githubusercontent.com/ebaizs/2769a9e28995f23cf9be60dd8f2891ca/raw/my-zhanghao.js';
    
    try {
        // 获取云端文件内容
        const response = await fetch(cloudUrl);
        const jsContent = await response.text();
        
        // 解析JS文件内容，提取 builtInUsers 数组
        const users = parseUsersFromJS(jsContent);
        
        // 如果从云端成功获取用户，则返回
        if (users && users.length > 0) {
            console.log('成功从云端加载用户');
            return users;
        }
        
        // 如果云端没有用户数据，返回本地默认用户
        console.log('云端无用户数据，使用本地默认用户');
        return getDefaultUsers();
        
    } catch (error) {
        console.error('加载云端账号失败:', error);
        // 失败时返回本地默认用户
        return getDefaultUsers();
    }
}





// 从JS文件内容中解析用户数据
function parseUsersFromJS(jsContent) {
    try {
        // 尝试通过多种方式提取 builtInUsers 数据
        const patterns = [
            // 匹配 const builtInUsers = [...]
            /const\s+builtInUsers\s*=\s*(\[[\s\S]*?\]);/,
            // 匹配 var builtInUsers = [...]
            /var\s+builtInUsers\s*=\s*(\[[\s\S]*?\]);/,
            // 匹配 let builtInUsers = [...]
            /let\s+builtInUsers\s*=\s*(\[[\s\S]*?\]);/,
            // 匹配 builtInUsers = [...]
            /builtInUsers\s*=\s*(\[[\s\S]*?\]);/
        ];
        
        let usersArray = null;
        
        for (const pattern of patterns) {
            const match = jsContent.match(pattern);
            if (match) {
                try {
                    // 安全地解析JSON数组
                    usersArray = JSON.parse(match[1].replace(/(\w+):/g, '"$1":'));
                    break;
                } catch (parseError) {
                    console.warn('使用正则匹配失败，尝试eval方式:', parseError);
                    continue;
                }
            }
        }
        
        // 如果正则失败，尝试使用eval提取（仅在可信源情况下）
        if (!usersArray) {
            try {
                // 创建一个安全的执行环境
                const jsWithReturn = jsContent + '; return builtInUsers || [];';
                const getUsers = new Function(jsWithReturn);
                usersArray = getUsers();
            } catch (evalError) {
                console.error('eval方式也失败了:', evalError);
            }
        }
        
        return usersArray || [];
    } catch (error) {
        console.error('解析用户数据失败:', error);
        return [];
    }
}

// 保留本地默认用户作为备用
function getDefaultUsers() {
    return [
        {
            "username": "qiyu",
            "password": "8418",
            "name": "系统管理员",
            "isLocal": true,
            "isAdmin": true
        }
    ];
}

// 修改显示主应用函数，添加更快的初始化
function showMainApp() {
    console.log('显示主应用');
    
    // 获取用户信息
    const userName = sessionStorage.getItem('userName') || '用户';
    const userRole = sessionStorage.getItem('userRole') || 'user';
    
    // 确保登录界面完全隐藏
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
        loginContainer.style.opacity = '0';
        loginContainer.style.display = 'none';
    }
    
    // 确保主应用显示
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
        mainContainer.style.display = 'block';
        mainContainer.style.opacity = '1';
    }
    
    // 在标题中显示用户信息
    const header = document.querySelector('header h1');
    if (header) {
        header.innerHTML = `<i class="fas fa-home"></i> 装饰项目清单报价系统 <small style="font-size: 12px; color: #cbd5e1; margin-left: 10px;">用户: ${userName}</small>`;
    }
    
    // 延迟初始化页面
    setTimeout(() => {
        if (typeof initPage === 'function') {
            console.log('开始初始化页面');
            initPage();
            showNotification('欢迎回来！', 'success');
        } else {
            console.error('initPage 函数未定义');
        }
        
        // 添加：确保键盘事件监听器已绑定
        setTimeout(() => {
            console.log('绑定键盘事件监听器');
            // 重新绑定事件监听器
            if (typeof bindEventListeners === 'function') {
                // 移除可能存在的重复监听器
                document.removeEventListener('keydown', handleKeyDown);
                // 重新绑定
                bindEventListeners();
            }
        }, 200);
    }, 100);
}

// 退出登录功能
function logout() {
    if (confirm('确定要退出登录吗？')) {
        sessionStorage.clear();
        location.reload();
    }
}
// 初始化折叠状态
function initializeCollapseStates() {
    Object.keys(collapseStates).forEach(type => {
        Object.keys(collapseStates[type]).forEach(category => {
            const contentId = `${type}-${category}-content`;
            const content = document.getElementById(contentId);
            const icon = document.getElementById(`collapse-${type}-${category}`);
            
            if (content && icon) {
                if (collapseStates[type][category]) {
                    content.classList.add('collapsed');
                    
                    icon.classList.remove('fa-chevron-down');
                } else {
                    content.classList.remove('collapsed');
                   
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
}

// 切换类别折叠状态
function toggleCategoryCollapse(type, category) {
    const contentId = `${type}-${category}-content`;
    const content = document.getElementById(contentId);
    const icon = document.getElementById(`collapse-${type}-${category}`);
    
    if (!content || !icon) return;
    
    // 切换状态
    collapseStates[type][category] = !collapseStates[type][category];
    
    // 更新显示
    if (collapseStates[type][category]) {
        content.classList.add('collapsed');
        icon.classList.remove('fa-chevron-down');
       
    } else {
        content.classList.remove('collapsed');
        
        icon.classList.add('fa-chevron-down');
    }
    
    saveDataToStorage();
}
// 修正 toggleAllCategories 函数
function toggleAllCategories() {
    console.log('toggleAllCategories 被调用, 当前状态:', allCategoriesCollapsed);
    
    const btn = document.getElementById('toggleAllCategoriesBtn');
    if (!btn) {
        console.error('找不到按钮: toggleAllCategoriesBtn');
        return;
    }
    
    const icon = btn.querySelector('i');
    const text = btn.querySelector('.btn-text');
    
    // 切换状态
    allCategoriesCollapsed = !allCategoriesCollapsed;
    console.log('切换后状态:', allCategoriesCollapsed);
    
    // 更新所有分类的折叠状态
    Object.keys(collapseStates).forEach(type => {
        Object.keys(collapseStates[type]).forEach(category => {
            collapseStates[type][category] = allCategoriesCollapsed;
            const contentId = `${type}-${category}-content`;
            const content = document.getElementById(contentId);
            const collapseIcon = document.getElementById(`collapse-${type}-${category}`);
            
            console.log(`处理: ${contentId}, 内容元素:`, content, '图标元素:', collapseIcon);
            
            if (content && collapseIcon) {
                if (allCategoriesCollapsed) {
                    // 折叠状态
                    content.classList.add('collapsed');
                    content.style.display = 'none';
                    collapseIcon.className = 'fas fa-chevron-right';
                } else {
                    // 展开状态
                    content.classList.remove('collapsed');
                    content.style.display = 'block';
                    collapseIcon.className = 'fas fa-chevron-down';
                }
            }
        });
    });
    
    // 更新按钮文本和图标
    if (btn && icon && text) {
        if (allCategoriesCollapsed) {
            icon.className = 'fas fa-angle-double-down';
            text.textContent = '全部展开';
            showNotification('所有类别已折叠', 'success');
        } else {
            icon.className = 'fas fa-angle-double-up';
            text.textContent = '全部折叠';
            showNotification('所有类别已展开', 'success');
        }
    }
    
    saveDataToStorage();
}
function toggleAllSpaces() {
    console.log('toggleAllSpaces 被调用, 当前状态:', allSpacesCollapsed);
    
    const btn = document.getElementById('toggleAllSpacesBtn');
    if (!btn) {
        console.error('找不到按钮: toggleAllSpacesBtn');
        return;
    }
    
    const icon = btn.querySelector('i');
    const text = btn.querySelector('.btn-text');
    
    // 切换状态
    allSpacesCollapsed = !allSpacesCollapsed;
    console.log('切换后状态:', allSpacesCollapsed);
    
    // 获取当前活跃的标签页
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    let changedCount = 0;
    
    // 在活跃标签页内查找空间组
    const spaceGroups = activeTab.querySelectorAll('.space-group');
    console.log('找到空间组数量:', spaceGroups.length);
    
    spaceGroups.forEach(group => {
        const spaceContent = group.querySelector('.space-content');
        const collapseIcon = group.querySelector('.space-collapse-icon');
        
        if (spaceContent && collapseIcon) {
            if (allSpacesCollapsed) {
                // 折叠所有空间
                if (!spaceContent.classList.contains('collapsed')) {
                    spaceContent.classList.add('collapsed');
                    spaceContent.style.display = 'none';
                    collapseIcon.className = 'fas fa-chevron-right';
                    changedCount++;
                }
            } else {
                // 展开所有空间
                if (spaceContent.classList.contains('collapsed')) {
                    spaceContent.classList.remove('collapsed');
                    spaceContent.style.display = 'block';
                    collapseIcon.className = 'fas fa-chevron-down';
                    changedCount++;
                }
            }
        }
    });
    
    // 更新按钮文本和图标
    if (btn && icon && text) {
        if (allSpacesCollapsed) {
            icon.className = 'fas fa-layer-group';
            text.textContent = '空间打开';
            showNotification(`${changedCount} 个空间组已折叠`, 'success');
        } else {
            icon.className = 'fas fa-expand';
            text.textContent = '空间折叠';
            showNotification(`${changedCount} 个空间组已展开`, 'success');
        }
    }
}
// 检测设备并设置显示
function detectDeviceAndSetDisplay() {
    const width = window.innerWidth;
    const tabsContainer = document.querySelector('.tabs-container');
    const mobileBottomBar = document.querySelector('.mobile-bottom-bar');
    const mobileTabs = document.querySelectorAll('.mobile-bottom-btn');
    const desktopTabs = document.querySelectorAll('.tab:not(.tab-export-btn)');
    
    // 确保移动工具栏初始显示正确
    if (mobileBottomBar) {
        mobileBottomBar.style.display = width <= 767 ? 'flex' : 'none';
    }
    
    // 确保桌面标签页容器初始显示正确
    if (tabsContainer) {
        tabsContainer.style.display = width > 767 ? 'block' : 'none';
    }
    
    // 如果移动工具栏显示，确保第一个按钮为激活状态
    if (width <= 767 && mobileTabs.length > 0) {
        mobileTabs.forEach((tab, index) => {
            tab.classList.remove('active');
            if (index === 0) {
                tab.classList.add('active');
            }
        });
    }
    
    // 如果桌面标签页显示，确保第一个标签为激活状态
    if (width > 767 && desktopTabs.length > 0) {
        desktopTabs.forEach((tab, index) => {
            tab.classList.remove('active');
            if (index === 0) {
                tab.classList.add('active');
            }
        });
    }
}

// 更新项目名称从输入框
function updateProjectNameFromInput(inputElement) {
    const value = inputElement.value.trim();
    projectData.projectName = value;
    saveDataToStorage();
    
    // 同步另一个输入框
    const otherInputId = inputElement.id === 'projectNameInput' ? 'projectNameInput2' : 'projectNameInput';
    const otherInput = document.getElementById(otherInputId);
    if (otherInput && otherInput.value !== value) {
        otherInput.value = value;
    }
    
    showNotification(`项目名称已更新: ${value}`, 'info');
}

// 设置标签切换
function setupTabs() {
    // 首先确保移动工具栏和标签页容器的初始显示状态
    detectDeviceAndSetDisplay();
    
    // 移除之前的标签事件监听器（避免重复绑定）
    const tabs = document.querySelectorAll('.tab:not(.tab-export-btn)');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobileBtns = document.querySelectorAll('.mobile-bottom-btn');
    
    // 设置第一个标签页为激活状态
    if (tabs.length > 0 && tabContents.length > 0) {
        // 移除所有active类
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        mobileBtns.forEach(b => b.classList.remove('active'));
        
        // 设置第一个标签页为激活
        tabs[0].classList.add('active');
        mobileBtns[0].classList.add('active');
        const firstTabName = tabs[0].getAttribute('data-tab');
        const firstTabContent = document.getElementById(`${firstTabName}-tab`);
        if (firstTabContent) {
            firstTabContent.classList.add('active');
            currentType = firstTabName;
        }
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchToTab(tabName);
        });
    });
    
    // 为导出按钮添加单独的事件处理
  // 修改为：
let isExporting = false; // 在文件顶部添加这个变量

function exportToExcel() {
    // 防止重复导出
    if (isExporting) {
        return;
    }
    
    isExporting = true;
    
    // 检查是否有数据
    const hasHomeData = Object.values(projectData.home).some(arr => arr.length > 0);
    const hasCommercialData = Object.values(projectData.commercial).some(arr => arr.length > 0);
    
    if (!hasHomeData && !hasCommercialData) {
        showNotification('没有可导出的数据，请先添加项目', 'warning');
        isExporting = false;
        return;
    }
    
    // 只创建一个工作表
    const wb = XLSX.utils.book_new();
    const data = prepareSheetData();
    const ws = XLSX.utils.aoa_to_sheet(data);
    applySheetStyles(ws, data);
    XLSX.utils.book_append_sheet(wb, ws, '装饰项目报价单');
    
    // 生成文件名
    const projectName = projectData.projectName || '未命名项目';
    const fileName = `${projectName}_装饰项目报价单_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    // 导出文件
    XLSX.writeFile(wb, fileName);
    
    showNotification('Excel表格导出成功！', 'success');
    
    // 设置定时器，防止短时间内重复点击
    setTimeout(() => {
        isExporting = false;
    }, 1000);
}
}
// 切换标签页
function switchToTab(tabName) {
    const width = window.innerWidth;
    
    // 移除所有active类
    document.querySelectorAll('.tab:not(.tab-export-btn)').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.mobile-bottom-btn').forEach(b => b.classList.remove('active'));
    
    // 根据设备类型设置对应的标签为激活状态
    if (width <= 767) {
        // 移动端：设置移动工具栏按钮为激活状态
        const mobileBtns = document.querySelectorAll('.mobile-bottom-btn');
        mobileBtns.forEach((btn, index) => {
            if (index === (tabName === 'home' ? 0 : tabName === 'commercial' ? 1 : 2)) {
                btn.classList.add('active');
            }
        });
    } else {
        // 桌面端：设置桌面标签页为激活状态
        const desktopTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (desktopTab) {
            desktopTab.classList.add('active');
        }
    }
    
    // 显示对应的内容
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
        
        // 根据标签页类型执行相应操作
        if (tabName === 'space') {
            renderSpaceLibrary();
        }
        
        // 更新当前类型
        if (tabName === 'home' || tabName === 'commercial') {
            currentType = tabName;
        }
    }
}

// 打开多项目添加模态框
function openAddMultiModal(type, category) {
    currentType = type;
    currentCategory = category;
    
    document.getElementById('selected-projects-list').innerHTML = '<div class="empty-state">未选择任何项目</div>';
    document.getElementById('multiSpaceArea').value = '';
    loadMultiSpaceOptions();
    openMultiSelectProjectLibrary();
    document.getElementById('addMultiModal').style.display = 'flex';
}

// 关闭多项目添加模态框
function closeMultiModal() {
    document.getElementById('addMultiModal').style.display = 'none';
}

// 加载多项目空间选项
function loadMultiSpaceOptions() {
    const spaceSelect = document.getElementById('multiSpaceArea');
    if (!spaceSelect) return;
    
    spaceSelect.innerHTML = '<option value="">请选择空间</option>';
    const spaces = projectData.spaces[currentType] || [];
    
    spaces.forEach(space => {
        const option = document.createElement('option');
        option.value = space;
        option.textContent = space;
        spaceSelect.appendChild(option);
    });
}

// 添加手动输入的项目到选择列表
function addManualProject() {
    const name = document.getElementById('manualProjectName').value.trim();
    const price = parseFloat(document.getElementById('manualProjectPrice').value) || 0;
    const unit = document.getElementById('manualProjectUnit').value.trim();
    const quantity = parseFloat(document.getElementById('manualProjectQuantity').value) || 1;
    const description = document.getElementById('manualProjectDescription').value.trim();
    const selectedSpace = document.getElementById('multiSpaceArea').value.trim();
    const space = selectedSpace || '';
    
    if (!name || !unit || price <= 0) {
        showNotification('请填写项目名称、单位和单价', 'warning');
        return;
    }
    
    if (!space) {
        showNotification('请选择空间区域', 'warning');
        return;
    }
    
    if (isProjectDuplicate(currentType, currentCategory, space, name)) {
        showNotification(`"${space}"中已存在项目"${name}"，请勿重复添加`, 'warning');
        return;
    }
    
    const selectedList = document.getElementById('selected-projects-list');
    const project = {
        id: generateProjectId(),
        name: name,
        space: space,
        unit: unit,
        quantity: quantity,
        price: price,
        total: price * quantity,
        description: description
    };
    
    addProjectToSelectedList(project);
    document.getElementById('manualProjectName').value = '';
    document.getElementById('manualProjectPrice').value = '';
    document.getElementById('manualProjectDescription').value = '';
    
    showNotification('项目已添加到列表', 'success');
}

// 辅助函数：添加项目到已选项目列表
function addProjectToSelectedList(project) {
    const selectedList = document.getElementById('selected-projects-list');
    
    if (selectedList.firstChild && selectedList.firstChild.classList.contains('empty-state')) {
        selectedList.innerHTML = '';
    }
    
    const projectDiv = document.createElement('div');
    projectDiv.className = 'selected-project-item';
    projectDiv.innerHTML = `
        <div>
            <strong>${project.name}</strong>
            <div style="font-size:0.8rem;color:#666;">
                ${project.space} | ${project.unit} | 数量:${project.quantity} | 单价:¥${project.price.toFixed(2)}<br>
                ${project.description ? project.description.substring(0, 30) + (project.description.length > 30 ? '...' : '') : ''}
            </div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="removeSelectedProject(this)" style="padding:2px 8px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    projectDiv.dataset.name = project.name;
    projectDiv.dataset.unit = project.unit;
    projectDiv.dataset.quantity = project.quantity;
    projectDiv.dataset.price = project.price;
    projectDiv.dataset.space = project.space;
    projectDiv.dataset.description = project.description || '';
    
    selectedList.appendChild(projectDiv);
}

// 打开多选项目库模态框
function openMultiSelectProjectLibrary() {
    const container = document.getElementById('multi-project-library-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 使用 quickAddExamples 作为项目库
    let filteredProjects = quickAddExamples;
    
    // 按类别筛选
    if (currentCategory) {
        filteredProjects = filteredProjects.filter(project => project.category === currentCategory);
    }
    
    // 显示项目
    if (filteredProjects.length === 0) {
        container.innerHTML = '<div class="empty-state">暂无相关项目</div>';
    } else {
        filteredProjects.forEach((project, index) => {
            const div = document.createElement('div');
            div.className = 'project-library-item multi-select';
            div.innerHTML = `
                <input type="checkbox" class="project-checkbox" id="multi-project-${index}" 
                       data-name="${project.name}" 
                       data-unit="${project.unit}" 
                       data-description="${project.description || ''}"
                       data-price="${project.price || 0}"
                       data-category="${project.category || 'base'}">
                <label for="multi-project-${index}" class="project-label">
                    <div class="project-name">${project.name}</div>
                    <div class="project-unit">${project.unit}</div>
                    <div class="project-price">¥${project.price.toFixed(2)}</div>
                    <div class="project-category">${getCategoryName(project.category)}</div>
                </label>
            `;
            container.appendChild(div);
        });
    }
    
    document.getElementById('multiSelectProjectLibraryModal').style.display = 'flex';
}

// 搜索多选项目
function searchMultiProjects() {
    const searchTerm = document.getElementById('multi-project-search').value.toLowerCase();
    const container = document.getElementById('multi-project-library-list');
    if (!container) return;
    
    // 使用 quickAddExamples 作为项目库
    let filteredProjects = quickAddExamples;
    
    // 按类别筛选
    if (currentCategory) {
        filteredProjects = filteredProjects.filter(project => project.category === currentCategory);
    }
    
    // 按搜索词筛选
    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project => 
            project.name.toLowerCase().includes(searchTerm) ||
            (project.description && project.description.toLowerCase().includes(searchTerm))
        );
    }
    
    container.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        container.innerHTML = '<div class="empty-state">未找到相关项目</div>';
    } else {
        filteredProjects.forEach((project, index) => {
            const div = document.createElement('div');
            div.className = 'project-library-item multi-select';
            div.innerHTML = `
                <input type="checkbox" class="project-checkbox" id="multi-project-${index}" 
                       data-name="${project.name}" 
                       data-unit="${project.unit}" 
                       data-description="${project.description || ''}"
                       data-price="${project.price || 0}"
                       data-category="${project.category || 'base'}">
                <label for="multi-project-${index}" class="project-label">
                    <div class="project-name">${project.name}</div>
                    <div class="project-unit">${project.unit}</div>
                    <div class="project-price">¥${project.price.toFixed(2)}</div>
                    <div class="project-category">${getCategoryName(project.category)}</div>
                </label>
            `;
            container.appendChild(div);
        });
    }
}

// 确认多选选择
function confirmMultiSelection() {
    const checkboxes = document.querySelectorAll('#multiSelectProjectLibraryModal .project-checkbox:checked');
    const selectedList = document.getElementById('selected-projects-list');
    
    selectedList.innerHTML = '';
    
    if (checkboxes.length === 0) {
        selectedList.innerHTML = '<div class="empty-state">未选择任何项目</div>';
    } else {
        checkboxes.forEach(checkbox => {
            const name = checkbox.dataset.name;
            const unit = checkbox.dataset.unit;
            const description = checkbox.dataset.description;
            const price = parseFloat(checkbox.dataset.price) || 0;
            const category = checkbox.dataset.category || 'base';
            
            const projectDiv = document.createElement('div');
            projectDiv.className = 'selected-project-item';
            projectDiv.innerHTML = `
                <div>
                    <strong>${name}</strong>
                    <div style="font-size:0.8rem;color:#666;">
                        ${unit} | ¥${price.toFixed(2)}<br>
                        类别: ${getCategoryName(category)}<br>
                        ${description ? description.substring(0, 30) + (description.length > 30 ? '...' : '') : ''}
                    </div>
                </div>
                <button class="btn btn-sm btn-outline" onclick="removeSelectedProject(this)" style="padding:2px 8px;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            projectDiv.dataset.name = name;
            projectDiv.dataset.unit = unit;
            projectDiv.dataset.description = description;
            projectDiv.dataset.price = price;
            projectDiv.dataset.category = category;
            
            selectedList.appendChild(projectDiv);
        });
    }
    
    closeMultiSelectProjectLibrary();
}

// 关闭多选项目库模态框
function closeMultiSelectProjectLibrary() {
    document.getElementById('multiSelectProjectLibraryModal').style.display = 'none';
}

// 移除已选项目
function removeSelectedProject(button) {
    const item = button.closest('.selected-project-item');
    item.remove();
    
    const selectedList = document.getElementById('selected-projects-list');
    if (selectedList.children.length === 0) {
        selectedList.innerHTML = '<div class="empty-state">未选择任何项目</div>';
    }
}



// 表格编辑功能
function initTableEditing() {
    console.log('初始化表格编辑功能...');
    
    document.addEventListener('dblclick', function(e) {
        handleDoubleClick(e);
    });
    
    // 移动端长按支持
    let longPressTimer = null;
    document.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = target.closest('[class*="item-col-"]');
        
        if (cell && !cell.classList.contains('item-header')) {
            longPressTimer = setTimeout(() => {
                handleDoubleClick({ target: cell });
            }, 800);
        }
    });
    
    document.addEventListener('touchend', function() {
        clearTimeout(longPressTimer);
    });
    
    console.log('表格编辑功能初始化完成');
}
// 1. renderProjectList 函数完整代码
function renderProjectList(type, category) {
    const listId = `${type}-${category}-list`;
    const container = document.getElementById(listId);
    if (!container) {
        console.error(`找不到容器: ${listId}`);
        return;
    }
    
    // 确保数据结构存在
    if (!projectData[type]) {
        projectData[type] = {
            base: [],
            auxiliary: [],
            furniture: [],
            other: []
        };
    }
    
    if (!projectData[type][category]) {
        projectData[type][category] = [];
    }
    
    const items = projectData[type][category] || [];
    
    // 清空容器
    container.innerHTML = '';
    
    if (items.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.textContent = '暂无项目，请添加';
        container.appendChild(emptyDiv);
        
        const countElement = document.getElementById(`${type}-${category}-count`);
        if (countElement) {
            countElement.textContent = '0个项目';
        }
        
        updateSpaceFilterOptions(type, category);
        return;
    }
    
    const spaceGroups = {};
    items.forEach(item => {
        const space = item.space || '未指定';
        if (!spaceGroups[space]) {
            spaceGroups[space] = [];
        }
        spaceGroups[space].push(item);
    });
    
    const spaceTotals = {};
    
    // 计算每个空间的总价
    Object.keys(spaceGroups).forEach(space => {
        const spaceItems = spaceGroups[space];
        const spaceTotal = spaceItems.reduce((sum, item) => sum + (item.total || 0), 0);
        spaceTotals[space] = spaceTotal;
    });
    
    Object.keys(spaceGroups).forEach(space => {
        const spaceGroup = document.createElement('div');
        spaceGroup.className = 'space-group';
        spaceGroup.dataset.space = space;
        
        // 空间名称行
        const spaceHeader = document.createElement('div');
        spaceHeader.className = 'space-header';
      // 修改后（移除 ondblclick）：
      spaceHeader.innerHTML = `
      <div class="space-name" onclick="toggleSpaceGroupCollapse(this)">
          <i class="fas fa-chevron-down space-collapse-icon"></i>
          <span class="space-label">${space}</span>
      </div>
      <div class="space-total">¥${(spaceTotals[space] || 0).toFixed(2)}</div>
      <div class="space-buttons">
          <button class="space-copy-btn" 
                  onclick="copySpaceProjects('${type}', '${category}', '${space}', this)"
                  title="复制该空间下所有项目到其他空间">
              <i class="fas fa-copy"></i>
              <span>复制</span>
          </button>
          <button class="space-move-btn" 
                  onclick="moveSpaceProjects('${type}', '${category}', '${space}', this)"
                  title="将该项目转移到其他空间">
              <i class="fas fa-exchange-alt"></i>
              <span>转移</span>
          </button>
          <button class="space-delete-btn" 
                  onclick="deleteSpaceProjects('${type}', '${category}', '${space}')"
                  title="删除该空间下所有项目">
              <i class="fas fa-trash-alt"></i>
              <span>删除空间</span>
          </button>
      </div>
  `;
        // 空间内容区域（包含表格）
        const spaceContent = document.createElement('div');
        spaceContent.className = 'space-content';
        
        // 表格头部（移动到空间内容区域）
        const headerRow = document.createElement('div');
        headerRow.className = 'item-row item-header';
        headerRow.innerHTML = `
            <div class="item-col-name">项目名称/工艺说明</div>
            <div class="item-col-unit">单位</div>
            <div class="item-col-quantity">数量</div>
            <div class="item-col-price">单价</div>
            <div class="item-col-total">小计</div>
            <div class="item-col-actions">操作</div>
        `;
        
        spaceContent.appendChild(headerRow);
        
        // 添加项目行
        spaceGroups[space].forEach(item => {
            const row = document.createElement('div');
            row.className = 'item-row';
            row.dataset.projectId = item.id;
            
            row.innerHTML = `
                <div class="item-col-name" title="${item.description || ''}" style="cursor:pointer;">
                    <div style="font-weight:500;">${item.name || '未命名项目'}</div>
                    ${item.description ? 
                        `<div style="font-size:0.8rem;color:#666;margin-top:2px;cursor:pointer;">${item.description.substring(0, 30)}${item.description.length > 30 ? '...' : ''}</div>` 
                        : ''
                    }
                </div>
                <div class="item-col-unit" style="cursor:pointer;">${item.unit || ''}</div>
                <div class="item-col-quantity" style="cursor:pointer;">${item.quantity || 0}</div>
                <div class="item-col-price" style="cursor:pointer;">¥${(item.price || 0).toFixed(2)}</div>
                <div class="item-col-total">¥${(item.total || 0).toFixed(2)}</div>
                <div class="item-col-actions">
                    <button class="btn btn-sm btn-danger" onclick="deleteProject('${type}', '${category}', '${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            spaceContent.appendChild(row);
        });
        
        // 组装空间组
        spaceGroup.appendChild(spaceHeader);
        spaceGroup.appendChild(spaceContent);
        container.appendChild(spaceGroup);
    });
}
// 转移空间项目到其他空间
function moveSpaceProjects(type, category, sourceSpace, buttonElement) {
    // 隐藏转移按钮
    buttonElement.style.display = 'none';
    
    // 创建下拉选择框
    const select = document.createElement('select');
    select.className = 'space-move-select';
    select.style.cssText = `
        border: 2px solid #f59e0b;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 13px;
        font-weight: 600;
        background: white;
        color: #d97706;
        cursor: pointer;
        outline: none;
        margin-left: 8px;
        width: 120px;
    `;
    
    // 添加"选择目标空间"选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '选择目标空间';
    select.appendChild(defaultOption);
    
    // 添加分隔线
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    select.appendChild(separator);
    
    // 获取同类型的空间列表，排除当前空间
    const spaces = projectData.spaces[type].filter(space => space !== sourceSpace);
    
    // 添加空间选项
    if (spaces.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '无其他空间';
        emptyOption.disabled = true;
        select.appendChild(emptyOption);
    } else {
        spaces.forEach(space => {
            const option = document.createElement('option');
            option.value = space;
            option.textContent = space;
            select.appendChild(option);
        });
    }
    
    // 将下拉框插入到按钮的位置
    buttonElement.parentNode.insertBefore(select, buttonElement);
    
    let changeTriggered = false;
    
    // 点击外部处理函数
    const onClickOutside = (e) => {
        if (buttonElement && buttonElement.parentNode && buttonElement.parentNode.contains(e.target)) {
            return;
        }
        saveChange();
    };
    
    // 保存更改
    function saveChange() {
        if (changeTriggered) return;
        changeTriggered = true;
        
        const targetSpace = select.value;
        
        if (!targetSpace) {
            // 恢复按钮
            if (select && select.parentNode) {
                select.remove();
            }
            if (buttonElement) {
                buttonElement.style.display = 'inline-flex';
            }
            return;
        }
        
    // 确认转移
if (confirm(`确定将"${sourceSpace}"下的所有项目转移到"${targetSpace}"吗？此操作不可撤销。`)) {
    // 检查目标空间是否在空间列表中
    if (!projectData.spaces[currentType].includes(targetSpace)) {
        projectData.spaces[currentType].push(targetSpace);
    }
    
    // 获取源空间项目
    const sourceProjects = projectData[type][category].filter(item => item.space === sourceSpace);
    let movedCount = 0;
    let skippedCount = 0;
    
    // 检查目标空间是否有同名项目
    const targetProjects = projectData[type][category].filter(item => item.space === targetSpace);
    const existingNames = new Set(targetProjects.map(project => project.name));
    
    // 先处理可以移动的项目
    const projectsToMove = [];
    const projectsToSkip = [];
    
    sourceProjects.forEach(project => {
        if (existingNames.has(project.name)) {
            projectsToSkip.push(project);
            skippedCount++;
        } else {
            projectsToMove.push(project);
        }
    });
    
    // 移动项目：修改空间属性
    projectsToMove.forEach(project => {
        project.space = targetSpace;
        movedCount++;
    });
    
    // 从源空间中移除已移动的项目
    projectData[type][category] = projectData[type][category].filter(item => {
        // 保留未移动的项目（包括跳过的项目）
        if (item.space === sourceSpace) {
            // 如果这个项目在跳过的列表中，则保留
            return projectsToSkip.some(skipProject => skipProject.id === item.id);
        }
        return true;
    });
    
    // 保存数据
    saveDataToStorage();
    
    // 重新渲染列表
    renderProjectList(type, category);
    updateSummary(type);
    
    // 添加：更新当前类别的空间筛选器
    updateSpaceFilterOptions(type, category);
    
    // 添加：更新多项目添加模态框的空间选项
    loadMultiSpaceOptions();
    
    // 显示通知
    let message = `已转移 ${movedCount} 个项目到"${targetSpace}"`;
    if (skippedCount > 0) {
        message += `，跳过 ${skippedCount} 个重名项目（目标空间已存在同名项目）`;
    }
    showNotification(message, movedCount > 0 ? 'success' : 'warning');
    
    // 修改：折叠当前类别的所有空间组
    collapseAllSpacesInCategory(type, category);
}
        
        // 恢复按钮
        if (select && select.parentNode) {
            select.remove();
        }
        if (buttonElement) {
            buttonElement.style.display = 'inline-flex';
        }
        
        // 移除事件监听器
        document.removeEventListener('click', onClickOutside);
    }
    
    // 取消编辑
    function cancelEdit() {
        if (select && select.parentNode) {
            select.remove();
        }
        if (buttonElement) {
            buttonElement.style.display = 'inline-flex';
        }
        
        // 移除事件监听器
        document.removeEventListener('click', onClickOutside);
    }
    
    // 绑定事件
    select.addEventListener('change', function() {
        saveChange();
    });
    
    select.addEventListener('blur', function() {
        saveChange();
    });
    
    select.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveChange();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
    
    // 设置一个延迟，避免立即触发
    setTimeout(() => {
        document.addEventListener('click', onClickOutside);
        select.focus();
    }, 100);
}
// 更新表格行
function updateTableRow(project, type, category) {
    const row = document.querySelector(`[data-project-id="${project.id}"]`);
    if (!row) {
        renderProjectList(type, category);
        return;
    }
    
    const nameCell = row.querySelector('.item-col-name');
    const spaceCell = row.querySelector('.item-col-space');
    const unitCell = row.querySelector('.item-col-unit');
    const quantityCell = row.querySelector('.item-col-quantity');
    const priceCell = row.querySelector('.item-col-price');
    const totalCell = row.querySelector('.item-col-total');
    
    if (nameCell) {
        nameCell.innerHTML = `
            <strong>${project.name}</strong>
            ${project.description ? '<div style="font-size:0.8rem;color:#666;margin-top:2px;">' + 
                (project.description.length > 30 ? project.description.substring(0, 30) + '...' : project.description) + 
                '</div>' : ''}
        `;
    }
    
    if (spaceCell) spaceCell.textContent = project.space || '未指定';
    if (unitCell) unitCell.textContent = project.unit || '';
    if (quantityCell) quantityCell.textContent = project.quantity || 0;
    if (priceCell) priceCell.textContent = `¥${project.price.toFixed(2)}`;
    if (totalCell) totalCell.textContent = `¥${project.total.toFixed(2)}`;
    
    updateSpaceTotal(project.space, type, category);
}
// 更新空间小计
function updateSpaceTotal(space, type, category) {
    const spaceGroup = document.querySelector(`[data-space="${space}"]`);
    if (!spaceGroup) return;
    
    const items = projectData[type][category];
    const spaceItems = items.filter(item => item.space === space);
    const spaceTotal = spaceItems.reduce((sum, item) => sum + item.total, 0);
    
    const spaceTotalElement = spaceGroup.querySelector('.space-total');
    if (spaceTotalElement) {
        spaceTotalElement.textContent = `¥${spaceTotal.toFixed(2)}`;
    }
}
// 折叠指定类别的所有空间组
function collapseAllSpacesInCategory(type, category) {
    const container = document.getElementById(`${type}-${category}-list`);
    if (!container) return;
    
    const spaceGroups = container.querySelectorAll('.space-group');
    spaceGroups.forEach(group => {
        const spaceContent = group.querySelector('.space-content');
        const collapseIcon = group.querySelector('.space-collapse-icon');
        
        if (spaceContent && collapseIcon) {
            // 确保空间内容处于折叠状态
            spaceContent.classList.add('collapsed');
            collapseIcon.classList.remove('fa-chevron-down');
            collapseIcon.classList.add('fa-chevron-right');
        }
    });
    
    // 更新全局状态（如果需要）
    allSpacesCollapsed = true;
}
// 2. quickAddHomeProject 函数完整代码
function quickAddHomeProject() {
    // 确保数据已加载
    if (!kongjianchanpin || !kongjianchanpin.home || kongjianchanpin.home.length === 0) {
        // 如果没有数据，加载默认数据
        if (kongjianchanpin.home.length === 0) {
            setDefaultExampleData();
        }
        
        if (kongjianchanpin.home.length === 0) {
            showNotification('未找到示例数据，请手动添加项目', 'warning');
            return;
        }
    }
    
    let addedCount = 0;
    let duplicateCount = 0;
    
    // 确保数据结构存在
    if (!projectData.home.other) {
        projectData.home.other = [];
    }
    
    kongjianchanpin.home.forEach(spaceData => {
        const space = spaceData.space;
        const projectNames = spaceData.name || [];
        
        projectNames.forEach(projectName => {
            const projectInfo = getProjectInfoByName(projectName);
            
            if (projectInfo) {
                const projectObj = {
                    id: generateProjectId(),
                    name: projectInfo.name,
                    unit: projectInfo.unit || "项",
                    quantity: 1,
                    price: projectInfo.price || 0,
                    total: (projectInfo.price || 0) * 1, // 确保total正确计算
                    description: projectInfo.description || "",
                    space: space
                };
                
                let category = projectInfo.category || "base";
                
                // 确保类别数组存在
                if (!projectData.home[category]) {
                    projectData.home[category] = [];
                }
                
                // 检查是否重复
                if (!isProjectDuplicate('home', category, space, projectInfo.name)) {
                    projectData.home[category].push(projectObj);
                    addedCount++;
                } else {
                    duplicateCount++;
                }
            }
        });
    });
    
    saveDataToStorage();
    
    // 渲染所有类别
    ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
        renderProjectList('home', category);
    });
    
    updateSummary('home');
    // 添加：更新所有家装类别的空间筛选器
setTimeout(() => {
    ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
        updateSpaceFilterOptions('home', category);
    });
}, 100);
    
    let message = `已添加 ${addedCount} 个家装示例项目`;
    if (duplicateCount > 0) {
        message += `，跳过 ${duplicateCount} 个重复项目`;
    }
    showNotification(message, 'success');
        
   
}

// 3. quickAddCommercialProject 函数完整代码
function quickAddCommercialProject() {
    // 确保数据已加载
    if (!kongjianchanpin || !kongjianchanpin.commercial || kongjianchanpin.commercial.length === 0) {
        // 如果没有数据，加载默认数据
        if (kongjianchanpin.commercial.length === 0) {
            setDefaultExampleData();
        }
        
        if (kongjianchanpin.commercial.length === 0) {
            showNotification('未找到示例数据，请手动添加项目', 'warning');
            return;
        }
    }
    
    let addedCount = 0;
    let duplicateCount = 0;
    
    // 确保数据结构存在
    if (!projectData.commercial.other) {
        projectData.commercial.other = [];
    }
    
    kongjianchanpin.commercial.forEach(spaceData => {
        const space = spaceData.space;
        const projectNames = spaceData.name || [];
        
        projectNames.forEach(projectName => {
            const projectInfo = getProjectInfoByName(projectName);
            
            if (projectInfo) {
                const projectObj = {
                    id: generateProjectId(),
                    name: projectInfo.name,
                    unit: projectInfo.unit || "项",
                    quantity: 1,
                    price: projectInfo.price || 0,
                    total: (projectInfo.price || 0) * 1, // 确保total正确计算
                    description: projectInfo.description || "",
                    space: space
                };
                
                let category = projectInfo.category || "base";
                
                // 确保类别数组存在
                if (!projectData.commercial[category]) {
                    projectData.commercial[category] = [];
                }
                
                // 检查是否重复
                if (!isProjectDuplicate('commercial', category, space, projectInfo.name)) {
                    projectData.commercial[category].push(projectObj);
                    addedCount++;
                } else {
                    duplicateCount++;
                }
            }
        });
    });
    
    saveDataToStorage();
    
    // 渲染所有类别
    ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
        renderProjectList('commercial', category);
    });
    
    updateSummary('commercial');
      // 添加：更新所有公装类别的空间筛选器
      setTimeout(() => {
        ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
            updateSpaceFilterOptions('commercial', category);
        });
    }, 100);
    
    let message = `已添加 ${addedCount} 个公装示例项目`;
    if (duplicateCount > 0) {
        message += `，跳过 ${duplicateCount} 个重复项目`;
    }
    showNotification(message, 'success');
   
     
}

// 4. addMultiProjects 函数完整代码
function addMultiProjects() {
    const selectedSpace = document.getElementById('multiSpaceArea').value.trim();
    const selectedList = document.getElementById('selected-projects-list');
    const selectedItems = selectedList.querySelectorAll('.selected-project-item');
    
    if (selectedItems.length === 0) {
        showNotification('请至少选择一个项目', 'warning');
        return;
    }
    
    if (!selectedSpace) {
        showNotification('请选择空间区域', 'warning');
        return;
    }
    
    let addedCount = 0;
    let duplicateCount = 0;
    
    // 清除空状态提示
    const emptyState = selectedList.querySelector('.empty-state');
    if (emptyState && emptyState.parentNode) {
        emptyState.parentNode.removeChild(emptyState);
    }
    
    selectedItems.forEach(item => {
        const name = item.dataset.name;
        const unit = item.dataset.unit;
        const description = item.dataset.description;
        const price = parseFloat(item.dataset.price) || 0;
        const category = item.dataset.category || currentCategory;
        
        // 检查是否重复
        if (isProjectDuplicate(currentType, category, selectedSpace, name)) {
            duplicateCount++;
            return;
        }
        
        const project = {
            id: generateProjectId(),
            name: name,
            space: selectedSpace,
            unit: unit,
            quantity: 1,
            price: price,
            total: price * 1, // 确保total正确计算
            description: description
        };
        
        projectData[currentType][category].push(project);
        addedCount++;
    });
    
    saveDataToStorage();
    
    // 渲染项目列表并更新汇总
    renderProjectList(currentType, currentCategory);
    updateSummary(currentType);
    updateSpaceFilterOptions(currentType, currentCategory);
    
    // 刷新页面显示
    const categoryContent = document.getElementById(`${currentType}-${currentCategory}-content`);
    if (categoryContent && categoryContent.classList.contains('collapsed')) {
        toggleCategoryCollapse(currentType, currentCategory);
    }
    
    closeMultiModal();
    
    let message = `成功添加 ${addedCount} 个项目`;
    if (duplicateCount > 0) {
        message += `，跳过 ${duplicateCount} 个重复项目`;
    }
    showNotification(message, 'success');
}

// 5. setDefaultExampleData 函数（如果不存在需要创建）
function setDefaultExampleData() {
    // 如果 kongjianchanpin 没有数据，设置一些默认示例数据
    if (!kongjianchanpin) {
        kongjianchanpin = {
            home: [],
            commercial: []
        };
    }
    
    if (kongjianchanpin.home.length === 0) {
        kongjianchanpin.home = [
            { space: "客厅", name: ["平面吊顶", "直线吊顶", "墙面乳胶漆"] },
            { space: "主卧室", name: ["平面吊顶", "墙面乳胶漆"] },
            { space: "改造部分", name: ["电路改造", "水路改造"] }
        ];
    }
    
    if (kongjianchanpin.commercial.length === 0) {
        kongjianchanpin.commercial = [
            { space: "前台", name: ["接待台基础制作", "前台区地砖"] },
            { space: "办公区", name: ["办公区隔墙", "办公区地砖"] },
            { space: "会议室", name: ["会议室背景墙", "会议桌"] }
        ];
    }
}
function handleDoubleClick(e) {
    
    const target = e.target || e;
    const cell = target.closest('[class*="item-col-"]');
    
    if (!cell) return;
    
    const row = cell.closest('.item-row');
    if (!row || row.classList.contains('item-header')) return;
    
    const projectId = row.dataset.projectId;
    if (!projectId) return;
    
    const container = row.closest('.item-list');
    if (!container) return;
    
    const containerId = container.id;
    if (!containerId) return;
    
    const parts = containerId.split('-');
    if (parts.length < 2) return;
    
    const type = parts[0];
    const category = parts[1];
    
    if (!projectData[type] || !projectData[type][category]) return;
    
    const projects = projectData[type][category];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) return;
    
    const cellClass = Array.from(cell.classList).find(cls => cls.startsWith('item-col-'));
    
    switch(cellClass) {
        case 'item-col-price':
            editInlineCell(cell, project, type, category, 'price', 'number');
            break;
        case 'item-col-quantity':
            editInlineCell(cell, project, type, category, 'quantity', 'number');
            break;
        case 'item-col-unit':
            editInlineUnit(cell, project, type, category);
            break;
        case 'item-col-space':
            editInlineSpace(cell, project, type, category);
            break;
        case 'item-col-name':
            editInlineDescription(cell, project, type, category);
            break;
        case 'item-col-total':
            showNotification('总计由系统自动计算，无法直接编辑', 'info');
            break;
    }
}

function editInlineCell(cell, project, type, category, field, inputType = 'text') {
    const originalValue = project[field] || 0;
    
    const input = document.createElement('input');
    input.type = inputType;
    input.className = 'inline-edit';
    input.value = originalValue;
    input.min = '0';
    input.step = field === 'price' ? '0.01' : '1';
    input.style.width = '100%';
    input.style.textAlign = 'center';
    input.style.padding = '8px';
    
    const originalHtml = cell.innerHTML;
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.select();
    
    const saveChanges = () => {
        const newValue = inputType === 'number' ? parseFloat(input.value) || 0 : input.value;
        
        if (newValue !== originalValue) {
            project[field] = newValue;
            
            if (field === 'price' || field === 'quantity') {
                project.total = project.price * project.quantity;
            }
            
            saveDataToStorage();
            updateTableRow(project, type, category);
            updateSummary(type);
            
            showNotification(`${field === 'price' ? '单价' : '数量'}已更新`, 'success');
        } else {
            cell.innerHTML = originalHtml;
        }
    };
    
    const cancelEdit = () => {
        cell.innerHTML = originalHtml;
    };
    
    input.addEventListener('blur', saveChanges);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
}

function editInlineUnit(cell, project, type, category) {
    const originalValue = project.unit || '';
    
    const select = document.createElement('select');
    select.className = 'inline-edit';
    select.style.width = '100%';
    select.style.padding = '4px';
    select.style.textAlign = 'center';
    
    const units = ['平米', '米', '项', '套', '只', '组', '樘', '个', '张', '台', '副', '幅', '延米', '根', '件', '块'];
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        if (unit === originalValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    const originalHtml = cell.innerHTML;
    cell.innerHTML = '';
    cell.appendChild(select);
    select.focus();
    
    const saveChanges = () => {
        if (select.value !== originalValue) {
            project.unit = select.value;
            saveDataToStorage();
            updateTableRow(project, type, category);
            showNotification('单位已更新', 'success');
        } else {
            cell.innerHTML = originalHtml;
        }
    };
    
    select.addEventListener('blur', saveChanges);
    select.addEventListener('change', saveChanges);
}

function editInlineSpace(cell, project, type, category) {
    const originalValue = project.space || '';
    
    const select = document.createElement('select');
    select.className = 'inline-edit';
    select.style.width = '100%';
    select.style.padding = '4px';
    select.style.textAlign = 'center';
    
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '请选择空间';
    select.appendChild(emptyOption);
    
    const spaces = projectData.spaces[type] || [];
    spaces.forEach(space => {
        const option = document.createElement('option');
        option.value = space;
        option.textContent = space;
        if (space === originalValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    const originalHtml = cell.innerHTML;
    cell.innerHTML = '';
    cell.appendChild(select);
    select.focus();
    
    const saveChanges = () => {
        if (select.value !== originalValue) {
            project.space = select.value;
            saveDataToStorage();
            renderProjectList(type, category);
            updateSummary(type);
            showNotification('空间已更新', 'success');
        } else {
            cell.innerHTML = originalHtml;
        }
    };
    
    select.addEventListener('blur', saveChanges);
    select.addEventListener('change', saveChanges);
}

function editInlineDescription(cell, project, type, category) {
    const originalHtml = cell.innerHTML;
    const originalValue = project.description || '';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-edit';
    input.value = originalValue;
    input.placeholder = '输入工艺说明...';
    input.style.width = '100%';
    input.style.padding = '8px';
    
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.select();
    
    const saveChanges = () => {
        const newDescription = input.value.trim();
        
        if (newDescription !== originalValue) {
            project.description = newDescription;
            
            saveDataToStorage();
            updateTableRow(project, type, category);
            
            showNotification('工艺说明已更新', 'success');
        } else {
            cell.innerHTML = originalHtml;
        }
    };
    
    const cancelEdit = () => {
        cell.innerHTML = originalHtml;
    };
    
    input.addEventListener('blur', saveChanges);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
}





// 按空间筛选项目
function filterProjectsBySpace(type, category) {
    const filterId = `${type}-${category}-space-filter`;
    const filterSelect = document.getElementById(filterId);
    if (!filterSelect) return;
    
    const selectedSpace = filterSelect.value;
    const container = document.getElementById(`${type}-${category}-list`);
    if (!container) return;
    
    const spaceGroups = container.querySelectorAll('.space-group');
    spaceGroups.forEach(group => {
        if (!selectedSpace || group.dataset.space === selectedSpace) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}

// 删除项目
function deleteProject(type, category, id) {
    if (confirm('确定要删除这个项目吗？')) {
        projectData[type][category] = projectData[type][category].filter(item => item.id !== id);
        saveDataToStorage();
        renderProjectList(type, category);
        updateSummary(type);
        showNotification('项目已删除', 'success');
    }
}

// 更新汇总
function updateSummary(type) {
    const categories = ['base', 'auxiliary', 'furniture', 'other'];
    let baseTotal = 0;
    let auxiliaryTotal = 0;
    let furnitureTotal = 0;
    let otherTotal = 0;
    
    projectData[type].base.forEach(item => baseTotal += item.total);
    projectData[type].auxiliary.forEach(item => auxiliaryTotal += item.total);
    projectData[type].furniture.forEach(item => furnitureTotal += item.total);
    projectData[type].other.forEach(item => otherTotal += item.total);
    
    const grandTotal = baseTotal + auxiliaryTotal + furnitureTotal + otherTotal;
    
    // 更新各分类总计
    const categoryTotals = {
        'base': baseTotal,
        'auxiliary': auxiliaryTotal,
        'furniture': furnitureTotal,
        'other': otherTotal
    };
    
    categories.forEach(category => {
        const totalElement = document.getElementById(`${type}-${category}-total`);
        const summaryElement = document.getElementById(`${type}-${category}-summary`);
        const countElement = document.getElementById(`${type}-${category}-count`);
        
        if (totalElement) totalElement.textContent = `¥${categoryTotals[category].toFixed(2)}`;
        if (summaryElement) summaryElement.textContent = `¥${categoryTotals[category].toFixed(2)}`;
        if (countElement) {
            const count = projectData[type][category].length;
            countElement.textContent = `${count}个项目`;
        }
    });
    
    const grandTotalElement = document.getElementById(`${type}-grand-total`);
    if (grandTotalElement) grandTotalElement.textContent = `¥${grandTotal.toFixed(2)}`;
}

// 更新所有汇总
function updateAllSummaries() {
    updateSummary('home');
    updateSummary('commercial');
}

// 渲染空间库
function renderSpaceLibrary() {
    const homeSpaceList = document.getElementById('home-space-list');
    const commercialSpaceList = document.getElementById('commercial-space-list');
    
    if (!homeSpaceList || !commercialSpaceList) return;
    
    homeSpaceList.innerHTML = '';
    commercialSpaceList.innerHTML = '';
    
    projectData.spaces.home.forEach(space => {
        const spaceItem = document.createElement('div');
        spaceItem.className = 'space-item';
        spaceItem.innerHTML = `
            <div class="space-item-name">${space}</div>
            <div class="space-item-type">家装</div>
        `;
        homeSpaceList.appendChild(spaceItem);
    });
    
    projectData.spaces.commercial.forEach(space => {
        const spaceItem = document.createElement('div');
        spaceItem.className = 'space-item';
        spaceItem.innerHTML = `
            <div class="space-item-name">${space}</div>
            <div class="space-item-type">公装</div>
        `;
        commercialSpaceList.appendChild(spaceItem);
    });
}


// 清空所有项目
function clearAllProjects(type) {
    if (confirm(`确定要清空所有${type === 'home' ? '家装' : '工装'}项目吗？此操作不可撤销。`)) {
        projectData[type] = {
            base: [],
            auxiliary: [],
            furniture: [],
            other: []
        };
        
        // 清空项目名称输入框
        if (type === 'home') {
            document.getElementById('projectNameInput').value = '';
        } else {
            document.getElementById('projectNameInput2').value = '';
        }
        
        // 清空项目名称数据
        projectData.projectName = '';
        
        saveDataToStorage();
        
        ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
            renderProjectList(type, category);
        });
        
        updateSummary(type);
        showNotification(`已清空所有${type === 'home' ? '家装' : '工装'}项目`, 'success');
    }
}

// 打开空间选择/添加模态框
function openSpaceModal() {
    document.getElementById('newSpaceName').value = '';
    document.getElementById('newSpaceType').value = currentType || 'home';
    document.getElementById('spaceModal').style.display = 'flex';
}

function closeSpaceModal() {
    document.getElementById('spaceModal').style.display = 'none';
}

function addNewSpace() {
    const spaceName = document.getElementById('newSpaceName').value.trim();
    const spaceType = document.getElementById('newSpaceType').value;
    
    if (!spaceName) {
        showNotification('请输入空间名称', 'warning');
        return;
    }
    
    let exists = false;
    Object.keys(projectData.spaces).forEach(type => {
        if (projectData.spaces[type].includes(spaceName)) {
            exists = true;
        }
    });
    
    if (exists) {
        showNotification('该空间已存在', 'warning');
        return;
    }
    
    projectData.spaces[spaceType].push(spaceName);
    saveDataToStorage();
    loadMultiSpaceOptions();
    renderSpaceLibrary();
    closeSpaceModal();
    showNotification('空间已添加到库', 'success');
}

// 更新空间筛选器选项
function updateSpaceFilterOptions(type, category) {
    const filterId = `${type}-${category}-space-filter`;
    const filterSelect = document.getElementById(filterId);
    
    if (!filterSelect) return;
    
    const currentValue = filterSelect.value;
    filterSelect.innerHTML = '<option value="">全部空间</option>';
    
    const spaces = new Set();
    projectData[type][category].forEach(item => {
        if (item.space && item.space.trim() !== '') {
            spaces.add(item.space.trim());
        }
    });
    
    if (spaces.size === 0) {
        const globalSpaces = projectData.spaces[type] || [];
        globalSpaces.forEach(space => {
            spaces.add(space);
        });
    }
    
    spaces.forEach(space => {
        const option = document.createElement('option');
        option.value = space;
        option.textContent = space;
        filterSelect.appendChild(option);
    });
    
    if (currentValue && Array.from(spaces).includes(currentValue)) {
        filterSelect.value = currentValue;
    }
}



// 切换空间组折叠
function toggleSpaceGroupCollapse(spaceNameElement) {
    if (!spaceNameElement) return;
    
    const spaceGroup = spaceNameElement.closest('.space-group');
    if (!spaceGroup) return;
    
    const spaceContent = spaceGroup.querySelector('.space-content');
    const collapseIcon = spaceGroup.querySelector('.space-collapse-icon');
    
    if (!spaceContent || !collapseIcon) return;
    
    if (spaceContent.classList.contains('collapsed')) {
        spaceContent.classList.remove('collapsed');
        collapseIcon.classList.remove('fa-chevron-right');
        collapseIcon.classList.add('fa-chevron-down');
    } else {
        spaceContent.classList.add('collapsed');
        collapseIcon.classList.remove('fa-chevron-down');
        collapseIcon.classList.add('fa-chevron-right');
    }
}


// 初始化所有空间筛选器
function initializeAllSpaceFilters() {
    ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
        updateSpaceFilterOptions('home', category);
        updateSpaceFilterOptions('commercial', category);
    });
}

// 绑定事件监听器
    const multiProjectSearch = document.getElementById('multi-project-search');
    if (multiProjectSearch) {
        multiProjectSearch.addEventListener('input', searchMultiProjects);
    }
    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
   
// 关闭所有模态框
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}
// 绑定事件监听器
function bindEventListeners() {
    const multiProjectSearch = document.getElementById('multi-project-search');
    if (multiProjectSearch) {
        multiProjectSearch.addEventListener('input', searchMultiProjects);
    }
    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // === 添加快捷键支持 ===
    document.addEventListener('keydown', handleKeyboardShortcuts);
}


// 独立的键盘快捷键处理函数
function handleKeyboardShortcuts(event) {
    // 检查是否按下了ALT键
    if (!event.altKey) return;
    
    // 防止默认行为
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // 记录按键信息
    console.log('快捷键检测:', 'ALT+' + event.key);
    
    // 确保焦点不在输入框内
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true'
    );
    
    if (isInputFocused) {
        console.log('焦点在输入元素上，跳过快捷键处理');
        return;
    }
    
    switch(event.key.toLowerCase()) {
        case '1':
            console.log('ALT+1 按下: 切换全部分类');
            toggleAllCategories();
            showNotification(`ALT+1: ${allCategoriesCollapsed ? '全部展开' : '全部折叠'}`, 'info');
            break;
        case '2':
            console.log('ALT+2 按下: 切换空间折叠');
            toggleAllSpaces();
            showNotification(`ALT+2: ${allSpacesCollapsed ? '空间打开' : '空间折叠'}`, 'info');
            break;
        case 'e':
            console.log('ALT+E 按下: 导出Excel');
            exportToExcel();
            showNotification('ALT+E: 导出Excel', 'info');
            break;
        case 'i':
            console.log('ALT+I 按下: 导入数据');
            importData();
            showNotification('ALT+I: 导入数据', 'info');
            break;
        case 'o':
            console.log('ALT+O 按下: 导出数据');
            exportData();
            showNotification('ALT+O: 导出数据', 'info');
            break;
        default:
            return; // 不处理其他按键
    }
    
    // 阻止事件继续传播
    return false;
}
function showNotification(message, type = 'success', options = {}) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;
    
    const notification = document.createElement('div');
    
    // 检查是否需要紧凑模式
    const compact = options.compact || type === 'info';
    
    notification.className = `notification ${type}`;
    if (compact) {
        notification.classList.add('compact');
    }
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') icon = 'fas fa-exclamation-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    if (type === 'info') icon = 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <div style="flex: 1;">${message}</div>
    `;
    
    notificationArea.appendChild(notification);
    
    // 设置不同的显示时间
    const duration = compact ? 3000 : 5000;
    
    setTimeout(() => {
        notification.style.animation = compact ? 
            'compactNotificationSlideIn 0.3s ease-out reverse forwards' : 
            'notificationSlideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (notificationArea.contains(notification)) {
                notificationArea.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Excel导出功能
function exportToExcel() {
    // 检查是否有数据
    const hasHomeData = Object.values(projectData.home).some(arr => arr.length > 0);
    const hasCommercialData = Object.values(projectData.commercial).some(arr => arr.length > 0);
    
    if (!hasHomeData && !hasCommercialData) {
        showNotification('没有可导出的数据，请先添加项目', 'warning');
        return;
    }
    
    // 只创建一个工作表
    const wb = XLSX.utils.book_new();
    const data = prepareSheetData();
    const ws = XLSX.utils.aoa_to_sheet(data);
    applySheetStyles(ws, data);
    XLSX.utils.book_append_sheet(wb, ws, '装饰项目报价单');
    
    // 生成文件名
    const projectName = projectData.projectName || '未命名项目';
    const fileName = `${projectName}_装饰项目报价单_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    // 导出文件
    XLSX.writeFile(wb, fileName);
    
    showNotification('Excel表格导出成功！', 'success');
}




// 准备工作表数据
function prepareSheetData() {
    // 使用当前激活的类型
    const type = currentType;
    const typeName = type === 'home' ? '家装' : '公装';
    
    // 添加空间分组辅助函数（放在函数内部）
    function groupItemsBySpace(items) {
        const groups = {};
        items.forEach(item => {
            const space = item.space || '未指定';
            if (!groups[space]) {
                groups[space] = [];
            }
            groups[space].push(item);
        });
        return groups;
    }
    
    const data = [];    
    data.push(['']);
    data.push([`${typeName}装饰项目报价单`, '', '', '', '', '', '']);
    data.push(['']);
    
    const projectName = projectData.projectName || '未命名项目';
    data.push(['项目名称：', projectName, '', '', '', '', '']);
    
    const categories = [
        { key: 'base', title: '一、基础装修', summary: '基础装修合计', noteColumn: '工艺说明' },
        { key: 'auxiliary', title: '二、主材', summary: '主材合计', noteColumn: '备注说明' },
        { key: 'furniture', title: '三、家具家电/灯具窗帘/软装配饰', summary: '家具家电等合计', noteColumn: '备注说明' },
        { key: 'other', title: '四、其它项', summary: '其它项合计', noteColumn: '备注' }
    ];
    
    categories.forEach(category => {
        const items = projectData[type][category.key];
        if (items.length === 0) return;
        
        data.push([category.title, '', '', '', '', '', '']);        
        data.push(['序号', '项目名称', '单位', '数量', '单价(¥)', '小计(¥)', '备注说明']);
        
        const spaceGroups = groupItemsBySpace(items);
        
        Object.keys(spaceGroups).forEach(space => {
            data.push([space, '', '', '', '', '', '']);
            
            let index = 1;
            let spaceTotal = 0;
            
            spaceGroups[space].forEach(item => {
                data.push([
                    index++,
                    item.name, 
                    item.unit, 
                    item.quantity, 
                    item.price.toFixed(2), 
                    item.total.toFixed(2),
                    item.description || ''
                ]);
                spaceTotal += item.total;
            });
            
            // 空间小计行
            data.push(['', '小计', '', '', '', `¥${spaceTotal.toFixed(2)}`, '']);
        });
        
        const categoryTotal = items.reduce((sum, item) => sum + item.total, 0);
        // 大类别合计行
        data.push(['', `${getCategoryName(category.key)}合计`, '', '', '', `¥${categoryTotal.toFixed(2)}`, '']);
    });
    
    const baseTotal = projectData[type].base.reduce((sum, item) => sum + item.total, 0);
    const auxiliaryTotal = projectData[type].auxiliary.reduce((sum, item) => sum + item.total, 0);
    const furnitureTotal = projectData[type].furniture.reduce((sum, item) => sum + item.total, 0);
    const otherTotal = projectData[type].other.reduce((sum, item) => sum + item.total, 0);
    const grandTotal = baseTotal + auxiliaryTotal + furnitureTotal + otherTotal;
    
    data.push(['']);
    // 总计行
    data.push(['', '小计金额：', '', '', '', `¥${grandTotal.toFixed(2)}`, '']);
    
    const chineseAmount = convertCurrency(grandTotal);
    data.push(['', '大写金额：', '', '', '', chineseAmount, '']);
    
    data.push(['备注：', '', '', '', '', '', '']);
    data.push(['', '1. 本报价单包含人工费、材料费及管理费', '', '', '', '', '']);
    data.push(['', '2. 实际结算以实际施工量为准', '', '', '', '', '']);
    data.push(['', '3. 如有变更，需双方协商确认', '', '', '', '', '']);
    data.push(['', '4. 报价有效期30天', '', '', '', '', '']);
    
    return data;
}

// 应用工作表样式
// 替换 applySheetStyles 函数中的 merges 部分
function applySheetStyles(ws, data) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    const merges = [];
    
    for(let R = range.s.r; R <= range.e.r; ++R) {
        for(let C = range.s.c; C <= range.e.c; ++C) {
            const cellRef = XLSX.utils.encode_cell({c: C, r: R});
            
            if(!ws[cellRef]) {
                ws[cellRef] = {v: '', t: 's'};
            }
            
            const cell = ws[cellRef];
            if(!cell.s) cell.s = {};
            
            // 设置边框
            cell.s.border = {
                top: {style: 'thin', color: {rgb: '000000'}},
                bottom: {style: 'thin', color: {rgb: '000000'}},
                left: {style: 'thin', color: {rgb: '000000'}},
                right: {style: 'thin', color: {rgb: '000000'}}
            };
            
            const rowData = data[R];
            if (!rowData || rowData.length === 0) continue;
            
            const firstCellValue = rowData[0] !== undefined ? String(rowData[0]) : '';
            
            // 1. 标题行："**装饰项目报价单" - 合并A-G列，居中
            if (firstCellValue.includes('装饰项目报价单') && C === 0) {
                merges.push({s: {r: R, c: 0}, e: {r: R, c: 6}});
                cell.s.alignment = {horizontal: 'center', vertical: 'center'};
                cell.s.font = {bold: true, sz: 16};
            }
            
            // 2. 项目名称行："项目名称：**" - 合并A-G列，居左
            else if (firstCellValue.startsWith('项目名称：') && C === 0) {
                merges.push({s: {r: R, c: 0}, e: {r: R, c: 6}});
                cell.s.alignment = {horizontal: 'left', vertical: 'center'};
                cell.s.font = {bold: true};
            }
            
            // 3. 空间类型名称行（一、基础装修等）- 合并A-G列，居左
            else if ((firstCellValue.startsWith('一、') || firstCellValue.startsWith('二、') || 
                     firstCellValue.startsWith('三、') || firstCellValue.startsWith('四、')) && C === 0) {
                merges.push({s: {r: R, c: 0}, e: {r: R, c: 6}});
                cell.s.alignment = {horizontal: 'left', vertical: 'center'};
                cell.s.font = {bold: true, sz: 12};
                cell.s.fill = {fgColor: {rgb: 'E8E8E8'}};
            }
            
           // 4. 空间名称行（客厅、卧室等）- 合并A-G列，居左
else if (C === 0 && firstCellValue !== '' && 
        !firstCellValue.includes('装饰项目报价单') &&
        !firstCellValue.startsWith('项目名称：') &&
        !firstCellValue.startsWith('一、') && 
        !firstCellValue.startsWith('二、') && 
        !firstCellValue.startsWith('三、') && 
        !firstCellValue.startsWith('四、') &&
        firstCellValue !== '序号' && 
        firstCellValue !== '小计' && 
        firstCellValue !== '备注：' &&
        !firstCellValue.endsWith('合计') &&
        firstCellValue !== '小计金额：' &&
        firstCellValue !== '大写金额：') {
    
    // 简化判断：只要这一行的第一个单元格有值，且其他单元格为空（或数据中其他单元格为空）
    // 检查当前行数据，如果是空间名称行，第二个单元格应该是空（在 prepareSheetData 中）
    if (rowData.length > 1 && rowData[1] === '') {
        merges.push({s: {r: R, c: 0}, e: {r: R, c: 6}});
        cell.s.alignment = {horizontal: 'left', vertical: 'center'};
        cell.s.font = {bold: true};
    }
}
            
            // 5. 表头行（序号、项目名称等）
            else if (firstCellValue === '序号' || firstCellValue === '项目名称') {
                cell.s.font = {bold: true};
                cell.s.alignment = {horizontal: 'center'};
                cell.s.fill = {fgColor: {rgb: 'F5F5F5'}};
            }
            
            // 6. 空间小计行（小计）- 合并A-B列，F列金额加粗右对齐
            else if (firstCellValue === '小计') {
                if (C === 0) {
                    cell.s.font = {bold: true};
                    merges.push({s: {r: R, c: 0}, e: {r: R, c: 1}});
                } else if (C === 5) {
                    cell.s.font = {bold: true};
                    cell.s.alignment = {horizontal: 'right'};
                }
            }
            
            // 7. 大类别合计行（基础装修合计等）- 合并A-F列，居左，F列金额加粗右对齐
            else if (firstCellValue.endsWith('合计')) {
                if (C === 0) {
                    cell.s.font = {bold: true};
                    merges.push({s: {r: R, c: 0}, e: {r: R, c: 5}});
                } else if (C === 5) {
                    cell.s.font = {bold: true};
                    cell.s.alignment = {horizontal: 'right'};
                    cell.s.fill = {fgColor: {rgb: 'F5F5F5'}};
                }
            }
            
            // 8. 总金额行（小计金额：）- 合并F-G列，居中
            else if (firstCellValue === '小计金额：') {
                if (C === 0) {
                    cell.s.font = {bold: true};
                    cell.s.alignment = {horizontal: 'left'};
                } else if (C === 5) {
                    merges.push({s: {r: R, c: 5}, e: {r: R, c: 6}});
                    cell.s.font = {bold: true, sz: 12};
                    cell.s.alignment = {horizontal: 'center', vertical: 'center'};
                }
            }
            
            // 9. 大写金额行（大写金额：）- 合并F-G列，居中
            else if (firstCellValue === '大写金额：') {
                if (C === 0) {
                    cell.s.font = {bold: true};
                    cell.s.alignment = {horizontal: 'left'};
                } else if (C === 5) {
                    merges.push({s: {r: R, c: 5}, e: {r: R, c: 6}});
                    cell.s.font = {bold: true, sz: 12};
                    cell.s.alignment = {horizontal: 'center', vertical: 'center'};
                }
            }
            
            // 10. 备注标题行（备注：）- 合并A-G列，居左
            else if (firstCellValue === '备注：') {
                if (C === 0) {
                    merges.push({s: {r: R, c: 0}, e: {r: R, c: 6}});
                    cell.s.alignment = {horizontal: 'left', vertical: 'center'};
                    cell.s.font = {bold: true};
                }
            }
            
            // 11. 备注内容行（1. 本报价单...）- 合并B-G列，居左
            else if (C === 1 && rowData[1] && rowData[1].toString().match(/^\d+\./)) {
                merges.push({s: {r: R, c: 1}, e: {r: R, c: 6}});
                cell.s.alignment = {horizontal: 'left', vertical: 'center'};
            }
            
            // 12. 金额列（单价和小计）右对齐
            if ((C === 4 || C === 5) && cell.v && !isNaN(parseFloat(cell.v))) {
                cell.s.alignment = {horizontal: 'right'};
            }
            
            // 13. 备注说明列左对齐
            if (C === 6) {
                cell.s.alignment = {horizontal: 'left'};
            }
        }
    }
    
    ws['!merges'] = merges;
    
    // 设置列宽
    ws['!cols'] = [
        {wch: 6},   // A列
        {wch: 25},  // B列
        {wch: 8},   // C列
        {wch: 8},   // D列
        {wch: 12},  // E列
        {wch: 15},  // F列
        {wch: 50}   // G列
    ];
}

// 金额大写转换函数
function convertCurrency(money) {
    const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    const cnIntRadice = ["", "拾", "佰", "仟"];
    const cnIntUnits = ["", "万", "亿", "兆"];
    const cnDecUnits = ["角", "分", "毫", "厘"];
    const cnInteger = "整";
    const cnIntLast = "元";
    
    let integerNum = Math.floor(money);
    let decimalNum = Math.round((money - integerNum) * 100);
    
    if (integerNum === 0 && decimalNum === 0) {
        return "零元整";
    }
    
    let chineseStr = "";
    
    if (integerNum > 0) {
        let zeroCount = 0;
        const integerStr = integerNum.toString();
        const integerLen = integerStr.length;
        
        for (let i = 0; i < integerLen; i++) {
            const n = integerStr.charAt(i);
            const p = integerLen - i - 1;
            const q = Math.floor(p / 4);
            const m = p % 4;
            
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    
    if (decimalNum > 0) {
        const decimalStr = decimalNum.toString().padStart(2, '0');
        const jiao = decimalStr.charAt(0);
        const fen = decimalStr.charAt(1);
        
        if (jiao > 0) {
            chineseStr += cnNums[parseInt(jiao)] + cnDecUnits[0];
        }
        
        if (fen > 0) {
            chineseStr += cnNums[parseInt(fen)] + cnDecUnits[1];
        }
    } else {
        chineseStr += cnInteger;
    }
    
    return chineseStr;
}
// 检查项目是否重复
function isProjectDuplicate(type, category, space, name) {
    const projects = projectData[type][category] || [];
    return projects.some(project => 
        project.space === space && 
        project.name === name
    );
}

// 获取项目信息(快速模板调用)
function getProjectInfoByName(name) {
    // 从 quickAddExamples 或 kongjianchanpin 中查找
    let project = quickAddExamples.find(p => p.name === name);
    if (!project && typeof kongjianchanpin !== 'undefined') {
        // 从空间产品数据中查找
        for (let type in kongjianchanpin) {
            for (let spaceData of kongjianchanpin[type]) {
                if (spaceData.name.includes(name)) {
                    return {
                        name: name,
                        unit: "项",
                        price: 0,
                        category: "base"
                    };
                }
            }
        }
    }
    return project;
}
// 获取类别名称
function getCategoryName(category) {
    const categoryNames = {
        'base': currentType === 'home' ? '基础装修' : '基础装修',
        'auxiliary': currentType === 'home' ? '主要材料' : '主要材料',
        'furniture': currentType === 'home' ? '家具家电及配饰' : '设备家具及配饰',
        'other': '其它项'
    };
    return categoryNames[category] || category;
}
// 搜索工艺说明
function searchProjectDescription(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        clearDescriptionSuggestions();
        return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // 从项目库中搜索匹配的工艺说明
    const matches = quickAddExamples.filter(item => 
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.name && item.name.toLowerCase().includes(term))
    );
    
    showDescriptionSuggestions(matches);
}

// 显示工艺说明建议
function showDescriptionSuggestions(matches) {
    clearDescriptionSuggestions();
    
    if (matches.length === 0) return;
    
    const inputContainer = document.getElementById('manualProjectDescription').closest('.search-box');
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'description-suggestions';
    suggestionsDiv.className = 'description-suggestions';
    
    matches.slice(0, 5).forEach(item => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'description-suggestion-item';
        suggestionItem.innerHTML = `
            <div class="suggestion-name">${item.name}</div>
            <div class="suggestion-description">${item.description || '无说明'}</div>
            <div class="suggestion-details">
                <span class="suggestion-unit">${item.unit}</span>
                <span class="suggestion-price">¥${item.price.toFixed(2)}</span>
            </div>
        `;
        
        suggestionItem.addEventListener('click', () => {
            fillManualProjectFromSuggestion(item);
            clearDescriptionSuggestions();
        });
        
        suggestionsDiv.appendChild(suggestionItem);
    });
    
    inputContainer.appendChild(suggestionsDiv);
}

// 从建议填充手动输入表单
function fillManualProjectFromSuggestion(item) {
    document.getElementById('manualProjectName').value = item.name || '';
    document.getElementById('manualProjectUnit').value = item.unit || '';
    document.getElementById('manualProjectPrice').value = item.price || '';
    document.getElementById('manualProjectDescription').value = item.description || '';
    document.getElementById('manualProjectQuantity').value = 1;
}

// 清除工艺说明建议
function clearDescriptionSuggestions() {
    const existingSuggestions = document.getElementById('description-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
}

// 添加点击其他地方时关闭建议列表
document.addEventListener('click', function(e) {
    const descriptionInput = document.getElementById('manualProjectDescription');
    const suggestions = document.getElementById('description-suggestions');
    
    if (descriptionInput && suggestions && 
        !descriptionInput.contains(e.target) && 
        !suggestions.contains(e.target)) {
        clearDescriptionSuggestions();
    }
});
// 数据导入功能
function importData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.txt';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm('导入数据将覆盖当前所有项目，确定要继续吗？')) {
                    // 验证导入的数据结构
                    if (validateImportData(importedData)) {
                        // 合并导入的数据
                        mergeImportData(importedData);
                        
                        saveDataToStorage();
                        
                        // 重新初始化页面
                        setTimeout(() => {
                            // 重新渲染所有列表
                            ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
                                renderProjectList('home', category);
                                renderProjectList('commercial', category);
                            });
                            
                            updateAllSummaries();
                            renderSpaceLibrary();
                            initializeAllSpaceFilters();
                            
                            showNotification('数据导入成功！', 'success');
                            
                            // 更新项目名称输入框
                            const projectNameInput1 = document.getElementById('projectNameInput');
                            const projectNameInput2 = document.getElementById('projectNameInput2');
                            if (projectNameInput1) projectNameInput1.value = projectData.projectName || '';
                            if (projectNameInput2) projectNameInput2.value = projectData.projectName || '';
                        }, 100);
                    } else {
                        showNotification('导入的数据格式不正确', 'error');
                    }
                }
            } catch (error) {
                console.error('导入数据失败:', error);
                showNotification('导入失败：文件格式错误', 'error');
            }
        };
        
        reader.onerror = function() {
            showNotification('读取文件失败', 'error');
        };
        
        reader.readAsText(file);
    });
    
    // 触发文件选择
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// 验证导入数据
function validateImportData(data) {
    if (!data || typeof data !== 'object') return false;
    
    // 检查基本结构
    const requiredKeys = ['home', 'commercial', 'spaces'];
    if (!requiredKeys.every(key => key in data)) {
        return false;
    }
    
    // 检查home结构
    if (!data.home || typeof data.home !== 'object') return false;
    const homeCategories = ['base', 'auxiliary', 'furniture', 'other'];
    if (!homeCategories.every(cat => Array.isArray(data.home[cat]))) {
        return false;
    }
    
    // 检查commercial结构
    if (!data.commercial || typeof data.commercial !== 'object') return false;
    if (!homeCategories.every(cat => Array.isArray(data.commercial[cat]))) {
        return false;
    }
    
    return true;
}
// 在 script.js 中添加以下函数



// 删除指定空间下的所有项目
function deleteSpaceProjects(type, category, space) {
    if (!confirm(`确定要删除"${space}"空间下的所有项目吗？此操作不可撤销。`)) {
        return;
    }
    
    // 备份原始数据
    const originalProjects = [...projectData[type][category]];
    
    // 过滤出不是该空间的项目
    projectData[type][category] = originalProjects.filter(item => item.space !== space);
    
    // 保存数据
    saveDataToStorage();
    
    // 重新渲染列表
    renderProjectList(type, category);
    
    // 更新汇总
    updateSummary(type);
    
    // 如果删除后该类别为空，且处于折叠状态，则展开
    if (projectData[type][category].length === 0 && collapseStates[type][category]) {
        collapseStates[type][category] = false;
        toggleCategoryCollapse(type, category);
    }
    
    showNotification(`已删除"${space}"空间下的所有项目`, 'success');
}


// 合并导入数据
function mergeImportData(importedData) {
    let addedCount = 0;
    let skippedCount = 0;
    
    // 合并项目名称
    if (importedData.projectName && importedData.projectName !== projectData.projectName) {
        projectData.projectName = importedData.projectName;
    }
    
    // 合并家装数据（带去重）
    if (importedData.home) {
        ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
            if (Array.isArray(importedData.home[category])) {
                importedData.home[category].forEach(item => {
                    // 使用现有的 isProjectDuplicate 函数
                    if (!isProjectDuplicate('home', category, item.space, item.name)) {
                        // 为新项目生成新的ID
                        item.id = generateProjectId();
                        projectData.home[category].push(item);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                });
            }
        });
    }
    
    // 合并公装数据（带去重）
    if (importedData.commercial) {
        ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
            if (Array.isArray(importedData.commercial[category])) {
                importedData.commercial[category].forEach(item => {
                    // 使用现有的 isProjectDuplicate 函数
                    if (!isProjectDuplicate('commercial', category, item.space, item.name)) {
                        // 为新项目生成新的ID
                        item.id = generateProjectId();
                        projectData.commercial[category].push(item);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                });
            }
        });
    }
    
    // 合并空间数据（去重）
    if (importedData.spaces) {
        if (Array.isArray(importedData.spaces.home)) {
            importedData.spaces.home.forEach(space => {
                if (!projectData.spaces.home.includes(space)) {
                    projectData.spaces.home.push(space);
                }
            });
        }
        
        if (Array.isArray(importedData.spaces.commercial)) {
            importedData.spaces.commercial.forEach(space => {
                if (!projectData.spaces.commercial.includes(space)) {
                    projectData.spaces.commercial.push(space);
                }
            });
        }
    }
    
    // 合并词库数据
    if (Array.isArray(importedData.library)) {
        importedData.library.forEach(item => {
            if (!projectData.library.includes(item)) {
                projectData.library.push(item);
            }
        });
    }
    
    // 保存数据
    saveDataToStorage();
    
    // 更新显示
    ['home', 'commercial'].forEach(type => {
        ['base', 'auxiliary', 'furniture', 'other'].forEach(category => {
            renderProjectList(type, category);
        });
        updateSummary(type);
    });
    
    // 显示通知
    let message = `成功导入 ${addedCount} 个项目`;
    if (skippedCount > 0) {
        message += `，跳过 ${skippedCount} 个重复项目`;
    }
    showNotification(message, 'success');
}

// 复制空间项目到其他空间
function copySpaceProjects(type, category, sourceSpace, buttonElement) {
    // 隐藏复制按钮和显示下拉框的代码保持不变
    buttonElement.style.display = 'none';
    
    // 创建下拉选择框
    const select = document.createElement('select');
    select.className = 'space-copy-select';
    select.style.cssText = `
        border: 2px solid #10b981;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 13px;
        font-weight: 600;
        background: white;
        color: #059669;
        cursor: pointer;
        outline: none;
        margin-left: 8px;
        width: 120px;
    `;
    
    // 添加"选择目标空间"选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '选择目标空间';
    select.appendChild(defaultOption);
    
    // 添加分隔线
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    select.appendChild(separator);
    
    // 获取同类型的空间列表，排除当前空间
    const spaces = projectData.spaces[type].filter(space => space !== sourceSpace);
    
    // 添加空间选项
    if (spaces.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '无其他空间';
        emptyOption.disabled = true;
        select.appendChild(emptyOption);
    } else {
        spaces.forEach(space => {
            const option = document.createElement('option');
            option.value = space;
            option.textContent = space;
            select.appendChild(option);
        });
    }
    
    // 将下拉框插入到按钮的位置
    buttonElement.parentNode.insertBefore(select, buttonElement);
    
    let changeTriggered = false;
    
    // 点击外部处理函数
    const onClickOutside = (e) => {
        if (buttonElement && buttonElement.parentNode && buttonElement.parentNode.contains(e.target)) {
            return;
        }
        saveChange();
    };
    
    // 保存更改
    function saveChange() {
        if (changeTriggered) return;
        changeTriggered = true;
        
        const targetSpace = select.value;
        
        if (!targetSpace) {
            // 恢复按钮
            if (select && select.parentNode) {
                select.remove();
            }
            if (buttonElement) {
                buttonElement.style.display = 'inline-flex';
            }
            return;
        }
        
      // 确认复制
if (confirm(`确定将"${sourceSpace}"下的所有项目复制到"${targetSpace}"吗？`)) {
    // 检查目标空间是否在空间列表中
    if (!projectData.spaces[currentType].includes(targetSpace)) {
        projectData.spaces[currentType].push(targetSpace);
    }
    
    // 执行复制
    const sourceProjects = projectData[type][category].filter(item => item.space === sourceSpace);
    let copiedCount = 0;
    let skippedCount = 0;
    
    sourceProjects.forEach(project => {
        // 检查目标空间是否已有同名项目（同一类别下）
        if (isProjectDuplicate(type, category, targetSpace, project.name)) {
            skippedCount++;
            return;
        }
        
        // 创建副本，生成新ID，修改空间
        const newProject = {
            ...project,
            id: generateProjectId(),
            space: targetSpace
        };
        
        projectData[type][category].push(newProject);
        copiedCount++;
    });
    
    // 保存数据
    saveDataToStorage();
    
    // 重新渲染列表
    renderProjectList(type, category);
    updateSummary(type);
    
    // 添加：更新当前类别的空间筛选器
    updateSpaceFilterOptions(type, category);
    
    // 添加：更新多项目添加模态框的空间选项
    loadMultiSpaceOptions();
    
    // 显示通知
    let message = `已复制 ${copiedCount} 个项目到"${targetSpace}"`;
    if (skippedCount > 0) {
        message += `，跳过 ${skippedCount} 个重复项目`;
    }
    showNotification(message, 'success');
    // 修改：折叠当前类别的所有空间组
    collapseAllSpacesInCategory(type, category);
   
}
        
        // 恢复按钮
        if (select && select.parentNode) {
            select.remove();
        }
        if (buttonElement) {
            buttonElement.style.display = 'inline-flex';
        }
        
        // 移除事件监听器
        document.removeEventListener('click', onClickOutside);
    };
    
    // 取消编辑
    function cancelEdit() {
        if (select && select.parentNode) {
            select.remove();
        }
        if (buttonElement) {
            buttonElement.style.display = 'inline-flex';
        }
        
        // 移除事件监听器
        document.removeEventListener('click', onClickOutside);
    };
    
    // 绑定事件
    select.addEventListener('change', function() {
        saveChange();
    });
    
    select.addEventListener('blur', function() {
        saveChange();
    });
    
    select.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveChange();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    });
    
    // 设置一个延迟，避免立即触发
    setTimeout(() => {
        document.addEventListener('click', onClickOutside);
        select.focus();
    }, 100);
}
function exportData() {
    try {
        // 准备要导出的数据
        const dataToExport = {
            projectName: projectData.projectName,
            home: projectData.home,
            commercial: projectData.commercial,
            library: projectData.library,
            spaces: projectData.spaces,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        // 生成文件名，包含日期
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const timeStr = date.getHours().toString().padStart(2, '0') + 
                       date.getMinutes().toString().padStart(2, '0');
        const projectName = projectData.projectName || '装饰项目数据';
        const exportFileDefaultName = `${projectName}_${dateStr}_${timeStr}.json`;
        
        // 创建下载链接
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        
        // 触发下载
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        showNotification('数据导出成功', 'success');
        
    } catch (error) {
        console.error('导出数据失败:', error);
        showNotification('导出数据失败', 'error');
    }
}

// 添加快捷键支持
document.addEventListener('keydown', function(event) {
    // ALT+1: 全部展开/折叠
    if (event.altKey && event.key === '1') {
        event.preventDefault();
        toggleAllCategories();
        showNotification(`ALT+1: ${allCategoriesCollapsed ? '全部折叠' : '全部展开'}`, 'info');
    }
    
    // ALT+2: 空间折叠/展开
    if (event.altKey && event.key === '2') {
        event.preventDefault();
        toggleAllSpaces();
        showNotification(`ALT+2: ${allSpacesCollapsed ? '空间打开' : '空间折叠'}`, 'info');
    }
    
    // ALT+E: 导出Excel
    if (event.altKey && event.key === 'e') {
        event.preventDefault();
        exportToExcel();
        showNotification('ALT+E: 导出Excel', 'info');
    }
    
    // ALT+I: 导入数据
    if (event.altKey && event.key === 'i') {
        event.preventDefault();
        importData();
        showNotification('ALT+I: 导入数据', 'info');
    }
    
    // ALT+O: 导出数据
    if (event.altKey && event.key === 'o') {
        event.preventDefault();
        exportData();
        showNotification('ALT+O: 导出数据', 'info');
    }
});
// 页面加载完成后绑定键盘事件
document.addEventListener('DOMContentLoaded', function() {
    // 只在主应用可见时绑定
    setTimeout(() => {
        document.addEventListener('keydown', handleKeyDown);
    }, 1000);
});

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', function() {
        detectDeviceAndSetDisplay();
    });
});