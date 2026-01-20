import { LanguageCode } from '../context/LanguageContext';

export type TranslationKeys = {
    nav: {
        home: string;
        profile: string;
        products: string;
        contact: string;
        admin: string;
    };
    auth: {
        loginTitle: string;
        loginSubtitle: string;
        registerTitle: string;
        registerSubtitle: string;
        loginWithThaiID: string;
        loginWithGoogle: string;
        loginWithFacebook: string;
        loginWithGitHub: string;
        loginWithLinkedIn: string;
        openThaiIDApp: string;
        orScanQRCode: string;
        thaiID: string;
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        password: string;
        passwordPlaceholder: string;
        confirmPassword: string;
        confirmPasswordPlaceholder: string;
        login: string;
        register: string;
        logout: string;
        needAccount: string;
        haveAccount: string;
        invalidCredentials: string;
        userExists: string;
        passwordMismatch: string;
        genericError: string;
        switchToThai: string;
        switchToEnglish: string;
    };
    common: {
        loading: string;
        save: string;
    };
    home: {
        role: string;
        bio: string;
        discover: string;
        noMedia: string;
        defaultTitle: string;
        selectedWorksTitle: string;
        selectedWorksSubtitle: string;
    };
    footer: {
        role: string;
        rights: string;
        designedBy: string;
    };
    profile: {
        title: string;
        portrait: string;
        contact: string;
        education: string;
        learning: string;
        tools: string;
        languages: string;
        thai: string;
        native: string;
        english: string;
        intermediate: string;
        loading: string;
        instagram: string;
        facebook: string;
        tiktok: string;
    };
    products: {
        title: string;
        subtitle: string;
        loading: string;
        empty: string;
        noImage: string;
    };
    contact: {
        title: string;
        intro: string;
        universityLabel: string;
        universityVal: string;
        locationLabel: string;
        locationVal: string;
        contactLabel: string;
        socialsLabel: string;
        loading: string;
    };
    admin: {
        nav: {
            home: string;
            background: string;
            profile: string;
            product: string;
            contact: string;
            footer: string;
        };
        login: {
            title: string;
            subtitle: string;
            username: string;
            usernamePlaceholder: string;
            password: string;
            passwordPlaceholder: string;
            authorize: string;
            invalid: string;
            show: string;
            hide: string;
        };
        theme: {
            textColor: string;
            reset: string;
        };
        common: {
            logout: string;
            backToHomeAdmin: string;
        };
        background: {
            title: string;
            subtitle: string;
            type: string;
            video: string;
            image: string;
            upload: string;
            noneSelected: string;
        };
    };
};

export const translations: Record<LanguageCode, TranslationKeys> = {
    en: {
        nav: { home: 'Home', profile: 'Profile', products: 'Products', contact: 'Contact', admin: 'Admin' },
        auth: {
            loginTitle: 'Welcome to the WEB',
            loginSubtitle: '',
            registerTitle: 'Create Account',
            registerSubtitle: 'Sign up to continue',
            loginWithThaiID: 'Login with ThaiID',
            loginWithGoogle: 'Login with Google',
            loginWithFacebook: 'Login with Facebook',
            loginWithGitHub: 'Login with GitHub',
            loginWithLinkedIn: 'Login with LinkedIn',
            openThaiIDApp: 'Open ThaiID app',
            orScanQRCode: 'or scan this QR code',
            thaiID: 'ThaiID',
            name: 'Name',
            namePlaceholder: 'Enter your name',
            email: 'Email',
            emailPlaceholder: 'Enter your email',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Confirm your password',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            needAccount: "Don't have an account?",
            haveAccount: 'Already have an account?',
            invalidCredentials: 'Invalid email or password',
            userExists: 'This email is already registered',
            passwordMismatch: 'Passwords do not match',
            genericError: 'Something went wrong. Please try again.',
            switchToThai: 'ไทย',
            switchToEnglish: 'English',
        },
        common: { loading: 'Loading...', save: 'Save' },
        home: {
            role: 'Cyber Security Student',
            bio: 'Based in Suan Dusit University. Passionate about safeguarding digital landscapes and building secure, resilient systems for the future.',
            discover: 'Discover More',
            noMedia: 'No Media',
            defaultTitle: 'ANUKUN\nBOONTHA',
            selectedWorksTitle: 'Selected Works',
            selectedWorksSubtitle: 'A collection of projects exploring security vulnerabilities and defensive strategies.'
        },
        footer: { role: 'Cyber Security Student', rights: 'All Rights Reserved.', designedBy: 'Designed by Anukun' },
        profile: {
            title: 'Profile', portrait: 'Portrait Image', contact: 'Contact', education: 'Education',
            learning: "What I'm Learning", tools: 'Tools I Have Used', languages: 'Languages',
            thai: 'Thai', native: 'Native', english: 'English', intermediate: 'Intermediate',
            loading: 'Loading...',
            instagram: 'Instagram',
            facebook: 'Facebook',
            tiktok: 'TikTok'
        },
        products: {
            title: 'Selected Works', subtitle: 'A collection of projects exploring security vulnerabilities and defensive strategies.',
            loading: 'Loading works...', empty: 'No works added yet.', noImage: 'No Image'
        },
        contact: {
            title: 'Get in Touch', intro: "I'm Anukun Boontha. Feel free to reach out for collaborations or just a friendly hello.",
            universityLabel: 'University', universityVal: 'Suan Dusit University',
            locationLabel: 'Location', locationVal: 'Bangkok, Thailand',
            contactLabel: 'Contact', socialsLabel: 'Socials',
            loading: 'Loading...'
        },
        admin: {
            nav: { home: 'Home', background: 'Background', profile: 'Profile', product: 'Product', contact: 'Contact', footer: 'Footer' },
            login: {
                title: 'Admin Portal',
                subtitle: 'Secure Access Only',
                username: 'Username',
                usernamePlaceholder: 'Enter username',
                password: 'Password',
                passwordPlaceholder: 'Enter password',
                authorize: 'Authorize Access',
                invalid: 'Invalid username or password',
                show: 'Show',
                hide: 'Hide'
            },
            theme: { textColor: 'Text Color', reset: 'Reset' },
            common: { logout: 'Logout', backToHomeAdmin: 'Back to Home Admin' },
            background: {
                title: 'Background',
                subtitle: 'Change the site background. Supports .mp4 and images up to 50MB.',
                type: 'Type',
                video: 'Video',
                image: 'Image',
                upload: 'Upload (Max 50MB)',
                noneSelected: 'No background selected'
            }
        }
    },
    th: {
        nav: { home: 'หน้าแรก', profile: 'ประวัติ', products: 'ผลงาน', contact: 'ติดต่อ', admin: 'ผู้ดูแล' },
        auth: {
            loginTitle: 'Welcome to the WEB',
            loginSubtitle: '',
            registerTitle: 'สร้างบัญชีผู้ใช้',
            registerSubtitle: 'สมัครสมาชิกเพื่อใช้งานต่อ',
            loginWithThaiID: 'เข้าสู่ระบบด้วย ThaiID',
            loginWithGoogle: 'เข้าสู่ระบบด้วย Google',
            loginWithFacebook: 'เข้าสู่ระบบด้วย Facebook',
            loginWithGitHub: 'เข้าสู่ระบบด้วย GitHub',
            loginWithLinkedIn: 'เข้าสู่ระบบด้วย LinkedIn',
            openThaiIDApp: 'เปิดแอป ThaiID',
            orScanQRCode: 'หรือสแกน QR โค้ดนี้',
            thaiID: 'ThaiID',
            name: 'ชื่อ',
            namePlaceholder: 'กรอกชื่อของคุณ',
            email: 'อีเมล',
            emailPlaceholder: 'กรอกอีเมลของคุณ',
            password: 'รหัสผ่าน',
            passwordPlaceholder: 'กรอกรหัสผ่าน',
            confirmPassword: 'ยืนยันรหัสผ่าน',
            confirmPasswordPlaceholder: 'กรอกรหัสผ่านอีกครั้ง',
            login: 'เข้าสู่ระบบ',
            register: 'สมัครสมาชิก',
            logout: 'ออกจากระบบ',
            needAccount: 'ยังไม่มีบัญชีใช่ไหม?',
            haveAccount: 'มีบัญชีอยู่แล้ว?',
            invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            userExists: 'อีเมลนี้ถูกใช้งานแล้ว',
            passwordMismatch: 'รหัสผ่านไม่ตรงกัน',
            genericError: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
            switchToThai: 'ไทย',
            switchToEnglish: 'English',
        },
        common: { loading: 'กำลังโหลด...', save: 'บันทึก' },
        home: {
            role: 'นักศึกษาความปลอดภัยไซเบอร์',
            bio: 'มหาวิทยาลัยสวนดุสิต มุ่งมั่นในการปกป้องโลกดิจิทัลและสร้างระบบที่ปลอดภัยและยืดหยุ่นสำหรับอนาคต',
            discover: 'ค้นพบเพิ่มเติม',
            noMedia: 'ไม่มีสื่อ',
            defaultTitle: 'ANUKUN\nBOONTHA',
            selectedWorksTitle: 'ผลงานที่คัดสรร',
            selectedWorksSubtitle: 'รวบรวมโปรเจกต์ที่สำรวจช่องโหว่ความปลอดภัยและกลยุทธ์การป้องกัน'
        },
        footer: { role: 'นักศึกษาความปลอดภัยไซเบอร์', rights: 'สงวนลิขสิทธิ์', designedBy: 'ออกแบบโดย Anukun' },
        profile: {
            title: 'ประวัติส่วนตัว', portrait: 'รูปถ่าย', contact: 'ข้อมูลติดต่อ', education: 'การศึกษา',
            learning: 'สิ่งที่กำลังเรียนรู้', tools: 'เครื่องมือที่ใช้งาน', languages: 'ภาษา',
            thai: 'ไทย', native: 'เจ้าของภาษา', english: 'อังกฤษ', intermediate: 'ระดับกลาง',
            loading: 'กำลังโหลด...',
            instagram: 'Instagram',
            facebook: 'Facebook',
            tiktok: 'TikTok'
        },
        products: {
            title: 'ผลงานที่คัดสรร', subtitle: 'รวบรวมโปรเจกต์ที่สำรวจช่องโหว่ความปลอดภัยและกลยุทธ์การป้องกัน',
            loading: 'กำลังโหลดผลงาน...', empty: 'ยังไม่มีผลงาน', noImage: 'ไม่มีรูปภาพ'
        },
        contact: {
            title: 'ติดต่อฉัน', intro: 'ฉันชื่อ อนุกูล บุญทา ยินดีต้อนรับสำหรับการร่วมงานหรือทักทายกัน',
            universityLabel: 'มหาวิทยาลัย', universityVal: 'มหาวิทยาลัยสวนดุสิต',
            locationLabel: 'ที่อยู่', locationVal: 'กรุงเทพมหานคร, ไทย',
            contactLabel: 'ช่องทางติดต่อ', socialsLabel: 'โซเชียลมีเดีย',
            loading: 'กำลังโหลด...'
        },
        admin: {
            nav: { home: 'Home', background: 'Background', profile: 'Profile', product: 'Product', contact: 'Contact', footer: 'Footer' },
            login: {
                title: 'Admin Portal',
                subtitle: 'Secure Access Only',
                username: 'Username',
                usernamePlaceholder: 'Enter username',
                password: 'Password',
                passwordPlaceholder: 'Enter password',
                authorize: 'Authorize Access',
                invalid: 'Invalid username or password',
                show: 'Show',
                hide: 'Hide'
            },
            theme: { textColor: 'สีตัวหนังสือ', reset: 'รีเซ็ต' },
            common: { logout: 'Logout', backToHomeAdmin: 'กลับไปหน้า Home Admin' },
            background: {
                title: 'Background',
                subtitle: 'เปลี่ยนพื้นหลังทั้งเว็บไซต์ รองรับ .mp4 และรูปภาพ ไม่เกิน 50MB',
                type: 'Type',
                video: 'Video',
                image: 'Image',
                upload: 'Upload (Max 50MB)',
                noneSelected: 'ยังไม่ได้เลือกพื้นหลัง'
            }
        }
    },
    zh: {
        nav: { home: '主页', profile: '个人资料', products: '作品', contact: '联系', admin: '管理' },
        auth: {
            loginTitle: 'Welcome to the WEB',
            loginSubtitle: '',
            registerTitle: '创建账号',
            registerSubtitle: '注册以继续',
            loginWithThaiID: '使用 ThaiID 登录',
            loginWithGoogle: '使用 Google 登录',
            loginWithFacebook: '使用 Facebook 登录',
            loginWithGitHub: '使用 GitHub 登录',
            loginWithLinkedIn: '使用 LinkedIn 登录',
            openThaiIDApp: '打开 ThaiID 应用',
            orScanQRCode: '或扫描此二维码',
            thaiID: 'ThaiID',
            name: '姓名',
            namePlaceholder: '输入姓名',
            email: '邮箱',
            emailPlaceholder: '输入邮箱',
            password: '密码',
            passwordPlaceholder: '输入密码',
            confirmPassword: '确认密码',
            confirmPasswordPlaceholder: '再次输入密码',
            login: '登录',
            register: '注册',
            logout: '退出登录',
            needAccount: '还没有账号？',
            haveAccount: '已有账号？',
            invalidCredentials: '邮箱或密码错误',
            userExists: '该邮箱已注册',
            passwordMismatch: '两次密码不一致',
            genericError: '发生错误，请重试。',
            switchToThai: 'ไทย',
            switchToEnglish: 'English',
        },
        common: { loading: '加载中...', save: '保存' },
        home: {
            role: '网络安全学生',
            bio: '就读于苏安杜斯特大学。热衷于维护数字环境安全，构建面向未来的安全、弹性系统。',
            discover: '探索更多',
            noMedia: '无媒体',
            defaultTitle: 'ANUKUN\nBOONTHA',
            selectedWorksTitle: '精选作品',
            selectedWorksSubtitle: '探索安全漏洞和防御策略的项目集合。'
        },
        footer: { role: '网络安全学生', rights: '版权所有。', designedBy: '设计：Anukun' },
        profile: {
            title: '个人资料', portrait: '肖像图片', contact: '联系方式', education: '教育背景',
            learning: '正在学习', tools: '使用的工具', languages: '语言',
            thai: '泰语', native: '母语', english: '英语', intermediate: '中级',
            loading: '加载中...',
            instagram: 'Instagram',
            facebook: 'Facebook',
            tiktok: 'TikTok'
        },
        products: {
            title: '精选作品', subtitle: '探索安全漏洞和防御策略的项目集合。',
            loading: '加载作品中...', empty: '暂无作品。', noImage: '无图片'
        },
        contact: {
            title: '取得联系', intro: '我是 Anukun Boontha。欢迎联系合作或打个招呼。',
            universityLabel: '大学', universityVal: '苏安杜斯特大学',
            locationLabel: '地点', locationVal: '泰国曼谷',
            contactLabel: '联系', socialsLabel: '社交媒体',
            loading: '加载中...'
        },
        admin: {
            nav: { home: '主页', background: '背景', profile: '资料', product: '产品', contact: '联系', footer: '页脚' },
            login: {
                title: '管理后台',
                subtitle: '仅限授权访问',
                username: '用户名',
                usernamePlaceholder: '输入用户名',
                password: '密码',
                passwordPlaceholder: '输入密码',
                authorize: '登录',
                invalid: '用户名或密码错误',
                show: '显示',
                hide: '隐藏'
            },
            theme: { textColor: '文字颜色', reset: '重置' },
            common: { logout: '退出登录', backToHomeAdmin: '返回 Home 管理' },
            background: {
                title: '背景',
                subtitle: '更改全站背景。支持 .mp4 和图片，最大 50MB。',
                type: '类型',
                video: '视频',
                image: '图片',
                upload: '上传（最大 50MB）',
                noneSelected: '未选择背景'
            }
        }
    },
    de: {
        nav: { home: 'Start', profile: 'Profil', products: 'Projekte', contact: 'Kontakt', admin: 'Admin' },
        auth: {
            loginTitle: 'Welcome to the WEB',
            loginSubtitle: '',
            registerTitle: 'Konto erstellen',
            registerSubtitle: 'Registriere dich, um fortzufahren',
            loginWithThaiID: 'Mit ThaiID anmelden',
            loginWithGoogle: 'Mit Google anmelden',
            loginWithFacebook: 'Mit Facebook anmelden',
            loginWithGitHub: 'Mit GitHub anmelden',
            loginWithLinkedIn: 'Mit LinkedIn anmelden',
            openThaiIDApp: 'ThaiID App öffnen',
            orScanQRCode: 'oder diesen QR-Code scannen',
            thaiID: 'ThaiID',
            name: 'Name',
            namePlaceholder: 'Name eingeben',
            email: 'E-Mail',
            emailPlaceholder: 'E-Mail eingeben',
            password: 'Passwort',
            passwordPlaceholder: 'Passwort eingeben',
            confirmPassword: 'Passwort bestätigen',
            confirmPasswordPlaceholder: 'Passwort erneut eingeben',
            login: 'Anmelden',
            register: 'Registrieren',
            logout: 'Abmelden',
            needAccount: 'Noch kein Konto?',
            haveAccount: 'Schon ein Konto?',
            invalidCredentials: 'E-Mail oder Passwort ungültig',
            userExists: 'Diese E-Mail ist bereits registriert',
            passwordMismatch: 'Passwörter stimmen nicht überein',
            genericError: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
            switchToThai: 'ไทย',
            switchToEnglish: 'English',
        },
        common: { loading: 'Laden...', save: 'Speichern' },
        home: {
            role: 'Cyber-Security Student',
            bio: 'An der Suan Dusit University. Leidenschaftlich für den Schutz digitaler Umgebungen und den Aufbau sicherer, resilienter Systeme.',
            discover: 'Mehr entdecken',
            noMedia: 'Keine Medien',
            defaultTitle: 'ANUKUN\nBOONTHA',
            selectedWorksTitle: 'Ausgewählte Arbeiten',
            selectedWorksSubtitle: 'Eine Sammlung von Projekten zu Sicherheitslücken und Abwehrstrategien.'
        },
        footer: { role: 'Cyber-Security Student', rights: 'Alle Rechte vorbehalten.', designedBy: 'Design von Anukun' },
        profile: {
            title: 'Profil', portrait: 'Porträt', contact: 'Kontakt', education: 'Ausbildung',
            learning: 'Was ich lerne', tools: 'Werkzeuge', languages: 'Sprachen',
            thai: 'Thai', native: 'Muttersprache', english: 'Englisch', intermediate: 'Mittelstufe',
            loading: 'Laden...',
            instagram: 'Instagram',
            facebook: 'Facebook',
            tiktok: 'TikTok'
        },
        products: {
            title: 'Ausgewählte Arbeiten',
            subtitle: 'Eine Sammlung von Projekten zu Sicherheitslücken und Abwehrstrategien.',
            loading: 'Laden...', empty: 'Noch keine Projekte.', noImage: 'Kein Bild'
        },
        contact: {
            title: 'Kontakt', intro: 'Ich bin Anukun Boontha. Melde dich gern für Kooperationen oder einfach zum Hallo sagen.',
            universityLabel: 'Universität', universityVal: 'Suan Dusit University',
            locationLabel: 'Ort', locationVal: 'Bangkok, Thailand',
            contactLabel: 'Kontakt', socialsLabel: 'Socials',
            loading: 'Laden...'
        },
        admin: {
            nav: { home: 'Home', background: 'Hintergrund', profile: 'Profil', product: 'Produkt', contact: 'Kontakt', footer: 'Footer' },
            login: {
                title: 'Admin Portal',
                subtitle: 'Nur für autorisierten Zugriff',
                username: 'Benutzername',
                usernamePlaceholder: 'Benutzernamen eingeben',
                password: 'Passwort',
                passwordPlaceholder: 'Passwort eingeben',
                authorize: 'Anmelden',
                invalid: 'Benutzername oder Passwort ungültig',
                show: 'Anzeigen',
                hide: 'Verbergen'
            },
            theme: { textColor: 'Textfarbe', reset: 'Zurücksetzen' },
            common: { logout: 'Abmelden', backToHomeAdmin: 'Zurück zu Home Admin' },
            background: {
                title: 'Hintergrund',
                subtitle: 'Website-Hintergrund ändern. Unterstützt .mp4 und Bilder bis 50MB.',
                type: 'Typ',
                video: 'Video',
                image: 'Bild',
                upload: 'Upload (Max. 50MB)',
                noneSelected: 'Kein Hintergrund ausgewählt'
            }
        }
    },
    ru: {
        nav: { home: 'Главная', profile: 'Профиль', products: 'Проекты', contact: 'Контакты', admin: 'Админ' },
        auth: {
            loginTitle: 'Welcome to the WEB',
            loginSubtitle: '',
            registerTitle: 'Создать аккаунт',
            registerSubtitle: 'Зарегистрируйтесь, чтобы продолжить',
            loginWithThaiID: 'Войти через ThaiID',
            loginWithGoogle: 'Войти через Google',
            loginWithFacebook: 'Войти через Facebook',
            loginWithGitHub: 'Войти через GitHub',
            loginWithLinkedIn: 'Войти через LinkedIn',
            openThaiIDApp: 'Открыть приложение ThaiID',
            orScanQRCode: 'или отсканируйте этот QR-код',
            thaiID: 'ThaiID',
            name: 'Имя',
            namePlaceholder: 'Введите имя',
            email: 'Email',
            emailPlaceholder: 'Введите email',
            password: 'Пароль',
            passwordPlaceholder: 'Введите пароль',
            confirmPassword: 'Подтвердите пароль',
            confirmPasswordPlaceholder: 'Повторите пароль',
            login: 'Войти',
            register: 'Регистрация',
            logout: 'Выйти',
            needAccount: 'Нет аккаунта?',
            haveAccount: 'Уже есть аккаунт?',
            invalidCredentials: 'Неверный email или пароль',
            userExists: 'Этот email уже зарегистрирован',
            passwordMismatch: 'Пароли не совпадают',
            genericError: 'Произошла ошибка. Попробуйте снова.',
            switchToThai: 'ไทย',
            switchToEnglish: 'English',
        },
        common: { loading: 'Загрузка...', save: 'Сохранить' },
        home: {
            role: 'Студент кибербезопасности',
            bio: 'Университет Суан Дусит. Увлечен защитой цифровых ландшафтов и созданием безопасных, устойчивых систем для будущего.',
            discover: 'Узнать больше',
            noMedia: 'Нет медиа',
            defaultTitle: 'ANUKUN\nBOONTHA',
            selectedWorksTitle: 'Избранные работы',
            selectedWorksSubtitle: 'Коллекция проектов, исследующих уязвимости и стратегии защиты.'
        },
        footer: { role: 'Студент кибербезопасности', rights: 'Все права защищены.', designedBy: 'Дизайн: Anukun' },
        profile: {
            title: 'Профиль', portrait: 'Портрет', contact: 'Контакт', education: 'Образование',
            learning: 'Что я изучаю', tools: 'Инструменты', languages: 'Языки',
            thai: 'Тайский', native: 'Родной', english: 'Английский', intermediate: 'Средний',
            loading: 'Загрузка...',
            instagram: 'Instagram',
            facebook: 'Facebook',
            tiktok: 'TikTok'
        },
        products: {
            title: 'Избранные работы', subtitle: 'Коллекция проектов, исследующих уязвимости безопасности и стратегии защиты.',
            loading: 'Загрузка...', empty: 'Работы еще не добавлены.', noImage: 'Нет изображения'
        },
        contact: {
            title: 'Связаться', intro: 'Я Анукун Бунтха. Пишите для сотрудничества или просто чтобы поздороваться.',
            universityLabel: 'Университет', universityVal: 'Университет Суан Дусит',
            locationLabel: 'Местоположение', locationVal: 'Бангкок, Таиланд',
            contactLabel: 'Контакт', socialsLabel: 'Соцсети',
            loading: 'Загрузка...'
        },
        admin: {
            nav: { home: 'Главная', background: 'Фон', profile: 'Профиль', product: 'Проекты', contact: 'Контакты', footer: 'Подвал' },
            login: {
                title: 'Панель администратора',
                subtitle: 'Только для авторизованных',
                username: 'Логин',
                usernamePlaceholder: 'Введите логин',
                password: 'Пароль',
                passwordPlaceholder: 'Введите пароль',
                authorize: 'Войти',
                invalid: 'Неверный логин или пароль',
                show: 'Показать',
                hide: 'Скрыть'
            },
            theme: { textColor: 'Цвет текста', reset: 'Сброс' },
            common: { logout: 'Выйти', backToHomeAdmin: 'Назад к Home Admin' },
            background: {
                title: 'Фон',
                subtitle: 'Измените фон сайта. Поддерживает .mp4 и изображения до 50MB.',
                type: 'Тип',
                video: 'Видео',
                image: 'Изображение',
                upload: 'Загрузка (макс. 50MB)',
                noneSelected: 'Фон не выбран'
            }
        }
    },
    fr: {
        nav: { home: 'Accueil', profile: 'Profil', products: 'Projets', contact: 'Contact', admin: 'Admin' },
        auth: {
            loginTitle: 'Welcome to the WEB',
            loginSubtitle: '',
            registerTitle: 'Créer un compte',
            registerSubtitle: 'Inscrivez-vous pour continuer',
            loginWithThaiID: 'Se connecter avec ThaiID',
            loginWithGoogle: 'Se connecter avec Google',
            loginWithFacebook: 'Se connecter avec Facebook',
            loginWithGitHub: 'Se connecter avec GitHub',
            loginWithLinkedIn: 'Se connecter avec LinkedIn',
            openThaiIDApp: 'Ouvrir l’application ThaiID',
            orScanQRCode: 'ou scannez ce QR code',
            thaiID: 'ThaiID',
            name: 'Nom',
            namePlaceholder: 'Entrez votre nom',
            email: 'Email',
            emailPlaceholder: 'Entrez votre email',
            password: 'Mot de passe',
            passwordPlaceholder: 'Entrez votre mot de passe',
            confirmPassword: 'Confirmer le mot de passe',
            confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
            login: 'Se connecter',
            register: 'S’inscrire',
            logout: 'Se déconnecter',
            needAccount: 'Pas de compte ?',
            haveAccount: 'Vous avez déjà un compte ?',
            invalidCredentials: 'Email ou mot de passe invalide',
            userExists: 'Cet email est déjà enregistré',
            passwordMismatch: 'Les mots de passe ne correspondent pas',
            genericError: 'Une erreur s’est produite. Veuillez réessayer.',
            switchToThai: 'ไทย',
            switchToEnglish: 'English',
        },
        common: { loading: 'Chargement...', save: 'Enregistrer' },
        home: {
            role: 'Étudiant en cybersécurité',
            bio: 'À l’Université Suan Dusit. Passionné par la protection des environnements numériques et la création de systèmes sûrs et résilients.',
            discover: 'Découvrir plus',
            noMedia: 'Aucun média',
            defaultTitle: 'ANUKUN\nBOONTHA',
            selectedWorksTitle: 'Travaux sélectionnés',
            selectedWorksSubtitle: 'Une collection de projets explorant les vulnérabilités et les stratégies de défense.'
        },
        footer: { role: 'Étudiant en cybersécurité', rights: 'Tous droits réservés.', designedBy: 'Conçu par Anukun' },
        profile: {
            title: 'Profil', portrait: 'Portrait', contact: 'Contact', education: 'Éducation',
            learning: 'Ce que j’apprends', tools: 'Outils utilisés', languages: 'Langues',
            thai: 'Thaï', native: 'Langue maternelle', english: 'Anglais', intermediate: 'Intermédiaire',
            loading: 'Chargement...',
            instagram: 'Instagram',
            facebook: 'Facebook',
            tiktok: 'TikTok'
        },
        products: {
            title: 'Travaux sélectionnés',
            subtitle: 'Une collection de projets explorant les vulnérabilités et les stratégies de défense.',
            loading: 'Chargement des projets...', empty: 'Aucun projet pour l’instant.', noImage: 'Pas d’image'
        },
        contact: {
            title: 'Prendre contact', intro: 'Je suis Anukun Boontha. N’hésitez pas à me contacter pour collaborer ou simplement dire bonjour.',
            universityLabel: 'Université', universityVal: 'Université Suan Dusit',
            locationLabel: 'Localisation', locationVal: 'Bangkok, Thaïlande',
            contactLabel: 'Contact', socialsLabel: 'Réseaux',
            loading: 'Chargement...'
        },
        admin: {
            nav: { home: 'Accueil', background: 'Arrière-plan', profile: 'Profil', product: 'Produit', contact: 'Contact', footer: 'Pied de page' },
            login: {
                title: 'Portail Admin',
                subtitle: 'Accès sécurisé uniquement',
                username: 'Nom d’utilisateur',
                usernamePlaceholder: 'Entrez le nom d’utilisateur',
                password: 'Mot de passe',
                passwordPlaceholder: 'Entrez le mot de passe',
                authorize: 'Se connecter',
                invalid: 'Nom d’utilisateur ou mot de passe invalide',
                show: 'Afficher',
                hide: 'Masquer'
            },
            theme: { textColor: 'Couleur du texte', reset: 'Réinitialiser' },
            common: { logout: 'Se déconnecter', backToHomeAdmin: 'Retour à Home Admin' },
            background: {
                title: 'Arrière-plan',
                subtitle: 'Changer l’arrière-plan du site. Prend en charge .mp4 et les images jusqu’à 50 Mo.',
                type: 'Type',
                video: 'Vidéo',
                image: 'Image',
                upload: 'Téléverser (Max 50 Mo)',
                noneSelected: 'Aucun arrière-plan sélectionné'
            }
        }
    }
};
