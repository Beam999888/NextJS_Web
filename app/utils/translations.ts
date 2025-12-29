import { LanguageCode } from '../context/LanguageContext';

export type TranslationKeys = {
    nav: {
        home: string;
        profile: string;
        products: string;
        contact: string;
        admin: string;
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
    }
};
