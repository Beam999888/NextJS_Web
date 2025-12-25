import { LanguageCode } from '../context/LanguageContext';

type TranslationKeys = {
    nav: {
        home: string;
        profile: string;
        products: string;
        contact: string;
        admin: string;
    };
    home: {
        role: string;
        bio: string;
        discover: string;
    };
    footer: {
        role: string;
        rights: string;
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
        files: string;
        intro: string;
        universityLabel: string;
        universityVal: string;
        locationLabel: string;
        locationVal: string;
        contactLabel: string;
        socialsLabel: string;
        formName: string;
        formNamePlaceholder: string;
        formEmail: string;
        formEmailPlaceholder: string;
        formMessage: string;
        formMessagePlaceholder: string;
        sendButton: string;
    };
};

export const translations: Record<LanguageCode, TranslationKeys> = {
    en: {
        nav: { home: 'Home', profile: 'Profile', products: 'Products', contact: 'Contact', admin: 'Admin' },
        home: {
            role: 'Cyber Security Student',
            bio: 'Based in Suan Dusit University. Passionate about safeguarding digital landscapes and building secure, resilient systems for the future.',
            discover: 'Discover More'
        },
        footer: { role: 'Cyber Security Student', rights: 'All Rights Reserved.' },
        profile: {
            title: 'Profile', portrait: 'Portrait Image', contact: 'Contact', education: 'Education',
            learning: "What I'm Learning", tools: 'Tools I Have Used', languages: 'Languages',
            thai: 'Thai', native: 'Native', english: 'English', intermediate: 'Intermediate'
        },
        products: {
            title: 'Selected Works', subtitle: 'A collection of projects exploring security vulnerabilities and defensive strategies.',
            loading: 'Loading works...', empty: 'No works added yet.', noImage: 'No Image'
        },
        contact: {
            title: 'Get in Touch', files: '', intro: "I'm Anukun Boontha. Feel free to reach out for collaborations or just a friendly hello.",
            universityLabel: 'University', universityVal: 'Suan Dusit University',
            locationLabel: 'Location', locationVal: 'Bangkok, Thailand',
            contactLabel: 'Contact', socialsLabel: 'Socials',
            formName: 'Name', formNamePlaceholder: 'Your name',
            formEmail: 'Email', formEmailPlaceholder: 'Your email',
            formMessage: 'Message', formMessagePlaceholder: 'What can I help you with?',
            sendButton: 'Send Message'
        }
    },
    th: {
        nav: { home: 'หน้าแรก', profile: 'ประวัติ', products: 'ผลงาน', contact: 'ติดต่อ', admin: 'ผู้ดูแล' },
        home: {
            role: 'นักศึกษาความปลอดภัยไซเบอร์',
            bio: 'มหาวิทยาลัยสวนดุสิต มุ่งมั่นในการปกป้องโลกดิจิทัลและสร้างระบบที่ปลอดภัยและยืดหยุ่นสำหรับอนาคต',
            discover: 'ค้นพบเพิ่มเติม'
        },
        footer: { role: 'นักศึกษาความปลอดภัยไซเบอร์', rights: 'สงวนลิขสิทธิ์' },
        profile: {
            title: 'ประวัติส่วนตัว', portrait: 'รูปถ่าย', contact: 'ข้อมูลติดต่อ', education: 'การศึกษา',
            learning: 'สิ่งที่กำลังเรียนรู้', tools: 'เครื่องมือที่ใช้งาน', languages: 'ภาษา',
            thai: 'ไทย', native: 'เจ้าของภาษา', english: 'อังกฤษ', intermediate: 'ระดับกลาง'
        },
        products: {
            title: 'ผลงานที่คัดสรร', subtitle: 'รวบรวมโปรเจกต์ที่สำรวจช่องโหว่ความปลอดภัยและกลยุทธ์การป้องกัน',
            loading: 'กำลังโหลดผลงาน...', empty: 'ยังไม่มีผลงาน', noImage: 'ไม่มีรูปภาพ'
        },
        contact: {
            title: 'ติดต่อฉัน', files: '', intro: 'ฉันชื่อ อนุกูล บุญทา ยินดีต้อนรับสำหรับการร่วมงานหรือทักทายกัน',
            universityLabel: 'มหาวิทยาลัย', universityVal: 'มหาวิทยาลัยสวนดุสิต',
            locationLabel: 'ที่อยู่', locationVal: 'กรุงเทพมหานคร, ไทย',
            contactLabel: 'ช่องทางติดต่อ', socialsLabel: 'โซเชียลมีเดีย',
            formName: 'ชื่อ', formNamePlaceholder: 'ชื่อของคุณ',
            formEmail: 'อีเมล', formEmailPlaceholder: 'อีเมลของคุณ',
            formMessage: 'ข้อความ', formMessagePlaceholder: 'มีอะไรให้ฉันช่วย?',
            sendButton: 'ส่งข้อความ'
        }
    },
    zh: {
        nav: { home: '主页', profile: '个人资料', products: '作品', contact: '联系', admin: '管理' },
        home: {
            role: '网络安全学生',
            bio: '就读于苏安杜斯特大学。热衷于维护数字环境安全，构建面向未来的安全、弹性系统。',
            discover: '探索更多'
        },
        footer: { role: '网络安全学生', rights: '版权所有。' },
        profile: {
            title: '个人资料', portrait: '肖像图片', contact: '联系方式', education: '教育背景',
            learning: '正在学习', tools: '使用的工具', languages: '语言',
            thai: '泰语', native: '母语', english: '英语', intermediate: '中级'
        },
        products: {
            title: '精选作品', subtitle: '探索安全漏洞和防御策略的项目集合。',
            loading: '加载作品中...', empty: '暂无作品。', noImage: '无图片'
        },
        contact: {
            title: '取得联系', files: '', intro: '我是 Anukun Boontha。欢迎联系合作或打个招呼。',
            universityLabel: '大学', universityVal: '苏安杜斯特大学',
            locationLabel: '地点', locationVal: '泰国曼谷',
            contactLabel: '联系', socialsLabel: '社交媒体',
            formName: '姓名', formNamePlaceholder: '您的姓名',
            formEmail: '邮箱', formEmailPlaceholder: '您的邮箱',
            formMessage: '留言', formMessagePlaceholder: '有什么可以帮您？',
            sendButton: '发送信息'
        }
    },
    hi: {
        nav: { home: 'होम', profile: 'प्रोफ़ाइल', products: 'प्रोजेक्ट्स', contact: 'संपर्क', admin: 'एडमिन' },
        home: {
            role: 'साइबर सुरक्षा छात्र',
            bio: 'सुआन दुसित विश्वविद्यालय में स्थित। डिजिटल परिदृश्यों की सुरक्षा और भविष्य के लिए सुरक्षित, लचीली प्रणालियों के निर्माण के प्रति उत्साही।',
            discover: 'और जानें'
        },
        footer: { role: 'साइबर सुरक्षा छात्र', rights: 'सर्वाधिकार सुरक्षित।' },
        profile: {
            title: 'प्रोफ़ाइल', portrait: 'चित्र', contact: 'संपर्क', education: 'शिक्षा',
            learning: 'मैं क्या सीख रहा हूँ', tools: 'उपकरण जो मैंने उपयोग किए', languages: 'भाषाएँ',
            thai: 'थाई', native: 'मातृभाषा', english: 'अंग्रेज़ी', intermediate: 'मध्यम'
        },
        products: {
            title: 'चुनिंदा कार्य', subtitle: 'सुरक्षा कमजोरियों और रक्षात्मक रणनीतियों की खोज करने वाले प्रोजेक्ट्स का संग्रह।',
            loading: 'लोड हो रहा है...', empty: 'अभी तक कोई कार्य नहीं जोड़ा गया।', noImage: 'कोई छवि नहीं'
        },
        contact: {
            title: 'संपर्क करें', files: '', intro: 'मैं अनुकुन बून्था हूँ। सहयोग या सिर्फ एक नमस्ते के लिए संपर्क करने में संकोच न करें।',
            universityLabel: 'विश्वविद्यालय', universityVal: 'सुआन दुसित विश्वविद्यालय',
            locationLabel: 'स्थान', locationVal: 'बैंकॉक, थाईलैंड',
            contactLabel: 'संपर्क', socialsLabel: 'सोशल मीडिया',
            formName: 'नाम', formNamePlaceholder: 'आपका नाम',
            formEmail: 'ईमेल', formEmailPlaceholder: 'आपका ईमेल',
            formMessage: 'संदेश', formMessagePlaceholder: 'मैं आपकी क्या मदद कर सकता हूँ?',
            sendButton: 'संदेश भेजें'
        }
    },
    es: {
        nav: { home: 'Inicio', profile: 'Perfil', products: 'Proyectos', contact: 'Contacto', admin: 'Admin' },
        home: {
            role: 'Estudiante de Ciberseguridad',
            bio: 'Estudiante de la Universidad Suan Dusit. Apasionado por salvaguardar paisajes digitales y construir sistemas seguros y resilientes para el futuro.',
            discover: 'Descubrir Más'
        },
        footer: { role: 'Estudiante de Ciberseguridad', rights: 'Todos los derechos reservados.' },
        profile: {
            title: 'Perfil', portrait: 'Imagen', contact: 'Contacto', education: 'Educación',
            learning: 'Lo que estoy aprendiendo', tools: 'Herramientas utilizadas', languages: 'Idiomas',
            thai: 'Tailandés', native: 'Nativo', english: 'Inglés', intermediate: 'Intermedio'
        },
        products: {
            title: 'Trabajos Seleccionados', subtitle: 'Una colección de proyectos explorando vulnerabilidades de seguridad y estrategias defensivas.',
            loading: 'Cargando trabajos...', empty: 'Aún no hay trabajos.', noImage: 'Sin imagen'
        },
        contact: {
            title: 'Ponte en Contacto', files: '', intro: 'Soy Anukun Boontha. Siéntete libre de contactarme para colaboraciones o simplemente para saludar.',
            universityLabel: 'Universidad', universityVal: 'Universidad Suan Dusit',
            locationLabel: 'Ubicación', locationVal: 'Bangkok, Tailandia',
            contactLabel: 'Contacto', socialsLabel: 'Redes Sociales',
            formName: 'Nombre', formNamePlaceholder: 'Tu nombre',
            formEmail: 'Correo', formEmailPlaceholder: 'Tu correo',
            formMessage: 'Mensaje', formMessagePlaceholder: '¿En qué puedo ayudarte?',
            sendButton: 'Enviar Mensaje'
        }
    },
    fr: {
        nav: { home: 'Accueil', profile: 'Profil', products: 'Projets', contact: 'Contact', admin: 'Admin' },
        home: {
            role: 'Étudiant en Cybersécurité',
            bio: 'Basé à l\'Université Suan Dusit. Passionné par la protection des paysages numériques et la construction de systèmes sûrs et résilients pour l\'avenir.',
            discover: 'Découvrir Plus'
        },
        footer: { role: 'Étudiant en Cybersécurité', rights: 'Tous droits réservés.' },
        profile: {
            title: 'Profil', portrait: 'Portrait', contact: 'Contact', education: 'Éducation',
            learning: 'Ce que j\'apprends', tools: 'Outils utilisés', languages: 'Langues',
            thai: 'Thaï', native: 'Natif', english: 'Anglais', intermediate: 'Intermédiaire'
        },
        products: {
            title: 'Travaux Sélectionnés', subtitle: 'Une collection de projets explorant les vulnérabilités de sécurité et les stratégies défensives.',
            loading: 'Chargement...', empty: 'Aucun travail ajouté.', noImage: 'Pas d\'image'
        },
        contact: {
            title: 'Contactez-moi', files: '', intro: 'Je suis Anukun Boontha. N\'hésitez pas à me contacter pour des collaborations ou juste un bonjour.',
            universityLabel: 'Université', universityVal: 'Université Suan Dusit',
            locationLabel: 'Lieu', locationVal: 'Bangkok, Thaïlande',
            contactLabel: 'Contact', socialsLabel: 'Réseaux Sociaux',
            formName: 'Nom', formNamePlaceholder: 'Votre nom',
            formEmail: 'Email', formEmailPlaceholder: 'Votre email',
            formMessage: 'Message', formMessagePlaceholder: 'En quoi puis-je vous aider ?',
            sendButton: 'Envoyer'
        }
    },
    ar: {
        nav: { home: 'الرئيسية', profile: 'الملف الشخصي', products: 'المشاريع', contact: 'اتصل بي', admin: 'مسؤول' },
        home: {
            role: 'طالب أمن سيبراني',
            bio: 'مقيم في جامعة سوان دوسيت. شغوف بحماية المشهد الرقمي وبناء أنظمة آمنة ومرنة للمستقبل.',
            discover: 'اكتشف المزيد'
        },
        footer: { role: 'طالب أمن سيبراني', rights: 'جميع الحقوق محفوظة.' },
        profile: {
            title: 'الملف الشخصي', portrait: 'صورة شخصية', contact: 'اتصال', education: 'التعليم',
            learning: 'ما أتعلمه', tools: 'أدوات استخدمتها', languages: 'اللغات',
            thai: 'التايلاندية', native: 'اللغة الأم', english: 'الإنجليزية', intermediate: 'متوسط'
        },
        products: {
            title: 'أعمال مختارة', subtitle: 'مجموعة من المشاريع تستكشف الثغرات الأمنية والاستراتيجيات الدفاعية.',
            loading: 'جارٍ التحميل...', empty: 'لم تتم إضافة أعمال بعد.', noImage: 'لا توجد صورة'
        },
        contact: {
            title: 'تواصل معي', files: '', intro: 'أنا أنوكون بونتا. لا تتردد في التواصل للتعاون أو مجرد إلقاء التحية.',
            universityLabel: 'الجامعة', universityVal: 'جامعة سوان دوسيت',
            locationLabel: 'الموقع', locationVal: 'بانكوك، تايلاند',
            contactLabel: 'اتصال', socialsLabel: 'وسائل التواصل',
            formName: 'الاسم', formNamePlaceholder: 'اسمك',
            formEmail: 'البريد الإلكتروني', formEmailPlaceholder: 'بريدك الإلكتروني',
            formMessage: 'الرسالة', formMessagePlaceholder: 'كيف يمكنني مساعدتك؟',
            sendButton: 'إرسال الرسالة'
        }
    },
    bn: {
        nav: { home: 'হোম', profile: 'প্রোফাইল', products: 'প্রজেক্ট', contact: 'যোগাযোগ', admin: 'অ্যাডমিন' },
        home: {
            role: 'সাইবার সিকিউরিটি ছাত্র',
            bio: 'সুয়ান দুসিত বিশ্ববিদ্যালয়ে অবস্থিত। ডিজিটাল ল্যান্ডস্কেপ সুরক্ষা এবং ভবিষ্যতের জন্য নিরাপদ সিস্টেম তৈরির প্রতি আগ্রহী।',
            discover: 'আরও জানুন'
        },
        footer: { role: 'সাইবার সিকিউরিটি ছাত্র', rights: 'সর্বস্বত্ব সংরক্ষিত।' },
        profile: {
            title: 'প্রোফাইল', portrait: 'ছবি', contact: 'যোগাযোগ', education: 'শিক্ষা',
            learning: 'আমি যা শিখছি', tools: 'ব্যবহৃত টুলস', languages: 'ভাষা',
            thai: 'থাই', native: 'মাতৃভাষা', english: 'ইংরেজি', intermediate: 'মধ্যবর্তী'
        },
        products: {
            title: 'নির্বাচিত কাজ', subtitle: 'নিরাপত্তা দুর্বলতা এবং প্রতিরক্ষামূলক কৌশল অন্বেষণকারী প্রজেক্টের সংগ্রহ।',
            loading: 'লোড হচ্ছে...', empty: 'এখনও কোন কাজ যোগ করা হয়নি।', noImage: 'ছবি নেই'
        },
        contact: {
            title: 'যোগাযোগ করুন', files: '', intro: 'আমি অনুকুন বুনথা। যেকোনো সহযোগিতার জন্য বা শুধুমাত্র হ্যালো বলতে যোগাযোগ করতে পারেন।',
            universityLabel: 'বিশ্ববিদ্যালয়', universityVal: 'সুয়ান দুসিত বিশ্ববিদ্যালয়',
            locationLabel: 'অবস্থান', locationVal: 'ব্যাংকক, থাইল্যান্ড',
            contactLabel: 'যোগাযোগ', socialsLabel: 'সোশ্যাল মিডিয়া',
            formName: 'নাম', formNamePlaceholder: 'আপনার নাম',
            formEmail: 'ইমেল', formEmailPlaceholder: 'আপনার ইমেল',
            formMessage: 'বার্তা', formMessagePlaceholder: 'আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
            sendButton: 'বার্তা পাঠান'
        }
    },
    pt: {
        nav: { home: 'Início', profile: 'Perfil', products: 'Projetos', contact: 'Contato', admin: 'Admin' },
        home: {
            role: 'Estudante de Segurança Cibernética',
            bio: 'Baseado na Universidade Suan Dusit. Apaixonado por proteger paisagens digitais e construir sistemas seguros e resilientes para o futuro.',
            discover: 'Descubrir Mais'
        },
        footer: { role: 'Estudante de Segurança Cibernética', rights: 'Todos os direitos reservados.' },
        profile: {
            title: 'Perfil', portrait: 'Imagem', contact: 'Contato', education: 'Educação',
            learning: 'O que estou aprendendo', tools: 'Ferramentas usadas', languages: 'Idiomas',
            thai: 'Tailandês', native: 'Nativo', english: 'Inglês', intermediate: 'Intermediário'
        },
        products: {
            title: 'Trabalhos Selecionados', subtitle: 'Uma coleção de projetos explorando vulnerabilidades de segurança e estratégias defensivas.',
            loading: 'Carregando...', empty: 'Nenhum trabalho adicionado.', noImage: 'Sem imagem'
        },
        contact: {
            title: 'Entre em Contato', files: '', intro: 'Sou Anukun Boontha. Sinta-se à vontade para entrar em contato para colaborações ou apenas um olá.',
            universityLabel: 'Universidade', universityVal: 'Universidade Suan Dusit',
            locationLabel: 'Localização', locationVal: 'Banguecoque, Tailândia',
            contactLabel: 'Contato', socialsLabel: 'Redes Sociais',
            formName: 'Nome', formNamePlaceholder: 'Seu nome',
            formEmail: 'Email', formEmailPlaceholder: 'Seu email',
            formMessage: 'Mensagem', formMessagePlaceholder: 'Como posso ajudar?',
            sendButton: 'Enviar Mensagem'
        }
    },
    ru: {
        nav: { home: 'Главная', profile: 'Профиль', products: 'Проекты', contact: 'Контакты', admin: 'Админ' },
        home: {
            role: 'Студент кибербезопасности',
            bio: 'Университет Суан Дусит. Увлечен защитой цифровых ландшафтов и созданием безопасных, устойчивых систем для будущего.',
            discover: 'Узнать больше'
        },
        footer: { role: 'Студент кибербезопасности', rights: 'Все права защищены.' },
        profile: {
            title: 'Профиль', portrait: 'Портрет', contact: 'Контакт', education: 'Образование',
            learning: 'Что я изучаю', tools: 'Инструменты', languages: 'Языки',
            thai: 'Тайский', native: 'Родной', english: 'Английский', intermediate: 'Средний'
        },
        products: {
            title: 'Избранные работы', subtitle: 'Коллекция проектов, исследующих уязвимости безопасности и стратегии защиты.',
            loading: 'Загрузка...', empty: 'Работы еще не добавлены.', noImage: 'Нет изображения'
        },
        contact: {
            title: 'Связаться', files: '', intro: 'Я Анукун Бунтха. Не стесняйтесь обращаться для сотрудничества или просто поздороваться.',
            universityLabel: 'Университет', universityVal: 'Университет Суан Дусит',
            locationLabel: 'Местоположение', locationVal: 'Бангкок, Таиланд',
            contactLabel: 'Контакт', socialsLabel: 'Соцсети',
            formName: 'Имя', formNamePlaceholder: 'Ваше имя',
            formEmail: 'Email', formEmailPlaceholder: 'Ваш email',
            formMessage: 'Сообщение', formMessagePlaceholder: 'Чем я могу помочь?',
            sendButton: 'Отправить'
        }
    },
    ur: {
        nav: { home: 'ہوم', profile: 'پروفائل', products: 'پروجیکٹس', contact: 'رابطہ', admin: 'ایڈمن' },
        home: {
            role: 'سائبر سیکیورٹی کا طالب علم',
            bio: 'سوان دوسیت یونیورسٹی میں مقیم۔ ڈیجیٹل مناظر کی حفاظت اور مستقبل کے لیے محفوظ ، لچکدار نظام بنانے کا شوقین۔',
            discover: 'مزید دریافت کریں'
        },
        footer: { role: 'سائبر سیکیورٹی کا طالب علم', rights: 'جملہ حقوق محفوظ ہیں۔' },
        profile: {
            title: 'پروفائل', portrait: 'تصویر', contact: 'رابطہ', education: 'تعلیم',
            learning: 'میں کیا سیکھ رہا ہوں', tools: 'آلات جو میں نے استعمال کیے', languages: 'زبانیں',
            thai: 'تھائی', native: 'مادری زبان', english: 'انگریزی', intermediate: 'درمیانہ'
        },
        products: {
            title: 'منتخب کام', subtitle: 'سیکورٹی خطرات اور دفاعی حکمت عملیوں کی تلاش کرنے والے منصوبوں کا مجموعہ۔',
            loading: 'لوڈ ہو رہا ہے...', empty: 'ابھی تک کوئی کام شامل نہیں کیا گیا۔', noImage: 'کوئی تصویر نہیں'
        },
        contact: {
            title: 'رابطہ کریں', files: '', intro: 'میں انوکون بون تھا ہوں۔ تعاون کے لیے یا صرف ہیلو کہنے کے لیے بلا جھجھک رابطہ کریں۔',
            universityLabel: 'یونیورسٹی', universityVal: 'سوان دوسیت یونیورسٹی',
            locationLabel: 'مقام', locationVal: 'بنکاک، تھائی لینڈ',
            contactLabel: 'رابطہ', socialsLabel: 'سوشل میڈیا',
            formName: 'نام', formNamePlaceholder: 'آپ کا نام',
            formEmail: 'ای میل', formEmailPlaceholder: 'آپ کا ای میل',
            formMessage: 'پیغام', formMessagePlaceholder: 'میں آپ کی کیا مدد کر سکتا ہوں؟',
            sendButton: 'پیغام بھیجیں'
        }
    }
};
