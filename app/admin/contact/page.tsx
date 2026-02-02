'use client';

import { useState, useEffect } from 'react';

interface ContactData {
    title: string;
    intro: string;
    email: string;
    university: string;
    location: string;
    image: string;
    footerLogo: string;
    footerBg: string;
    leftText: string;
    rightText: string;
    socials: {
        facebook: string;
        instagram: string;
        tiktok: string;
    };
    addressProvince?: string;
    addressAmphoe?: string;
    addressTambon?: string;
    addressZip?: string;
}

export default function AdminContactPage() {
    const [contact, setContact] = useState<ContactData>({
        title: '',
        intro: '',
        email: '',
        university: '',
        location: '',
        image: '',
        footerLogo: '',
        footerBg: '',
        leftText: '',
        rightText: '',
        socials: { facebook: '', instagram: '', tiktok: '' },
        addressProvince: '',
        addressAmphoe: '',
        addressTambon: '',
        addressZip: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [db, setDb] = useState<Array<{ province: string; amphoe: string; district: string; zipcode: string }>>([]);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [amphoes, setAmphoes] = useState<string[]>([]);
    const [tambons, setTambons] = useState<Array<{ name: string; zip: string }>>([]);
    const [isDbReady, setIsDbReady] = useState(false);
    const [hasMysql, setHasMysql] = useState(false);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('/api/contact');
                const data = await res.json();
                setContact(data);
            } catch (error) {
                console.error('Failed to fetch contact data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContact();
    }, []);

    useEffect(() => {
        const loadDb = async () => {
            try {
                const res = await fetch('/api/addressdb');
                if (!res.ok) throw new Error('addressdb_failed');
                const data = (await res.json()) as unknown;
                if (!Array.isArray(data)) throw new Error('invalid_addressdb');
                setDb(data as Array<{ province: string; amphoe: string; district: string; zipcode: string }>);
                setIsDbReady(true);
                setMessage('');
            } catch {
                setMessage('ไม่สามารถโหลดฐานข้อมูลจังหวัด/อำเภอ/ตำบลได้');
                setIsDbReady(false);
            }
        };
        loadDb();
    }, []);

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const res1 = await fetch('/api/address/provinces');
                if (res1.ok) {
                    const pv1 = (await res1.json()) as unknown;
                    if (Array.isArray(pv1)) {
                        setProvinces(pv1 as string[]);
                        setHasMysql(true);
                        return;
                    }
                }
            } catch {}
            try {
                const res2 = await fetch('/api/provinces');
                if (res2.ok) {
                    const pv2 = (await res2.json()) as string[];
                    setProvinces(Array.isArray(pv2) ? pv2 : []);
                }
            } catch {}
        };
        loadProvinces();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const socialName = name.replace('social_', '');
            setContact(prev => ({
                ...prev,
                socials: { ...prev.socials, [socialName]: value }
            }));
        } else {
            setContact(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleProvinceChange = async (value: string) => {
        setTambons([]);
        setAmphoes([]);
        if (hasMysql) {
            try {
                const res = await fetch(`/api/address/amphoes?province=${encodeURIComponent(value)}`);
                if (res.ok) {
                    const list = (await res.json()) as string[];
                    if (Array.isArray(list) && list.length > 0) {
                        setAmphoes(list);
                    } else if (isDbReady) {
                        const filteredAmphoes = Array.from(new Set(db.filter((r) => r.province === value).map((r) => r.amphoe))).sort((a, b) => a.localeCompare(b, 'th'));
                        setAmphoes(filteredAmphoes);
                    } else {
                        setAmphoes([]);
                    }
                }
            } catch {
                setAmphoes([]);
            }
        } else if (isDbReady) {
            const filteredAmphoes = Array.from(new Set(db.filter((r) => r.province === value).map((r) => r.amphoe))).sort((a, b) => a.localeCompare(b, 'th'));
            setAmphoes(filteredAmphoes);
        } else {
            try {
                const res = await fetch(`/api/amphoes?province=${encodeURIComponent(value)}`);
                const list = (await res.json()) as string[];
                setAmphoes(Array.isArray(list) ? list : []);
            } catch {
                setAmphoes([]);
            }
        }
        setContact((prev) => ({
            ...prev,
            addressProvince: value,
            addressAmphoe: '',
            addressTambon: '',
            addressZip: ''
        }));
    };

    const handleAmphoeChange = async (value: string) => {
        setTambons([]);
        if (hasMysql) {
            try {
                const url = `/api/address/tambons?province=${encodeURIComponent(contact.addressProvince || '')}&amphoe=${encodeURIComponent(value)}`;
                const res = await fetch(url);
                if (res.ok) {
                    const list = (await res.json()) as Array<{ name: string; zip: string }>;
                    if (Array.isArray(list) && list.length > 0) {
                        setTambons(list);
                    } else if (isDbReady) {
                        const filtered = db.filter((r) => r.province === (contact.addressProvince || '') && r.amphoe === value);
                        const uniqueNames = Array.from(new Set(filtered.map((r) => r.district))).sort((a, b) => a.localeCompare(b, 'th'));
                        const combined = uniqueNames.map((n) => {
                            const row = filtered.find((r) => r.district === n);
                            return { name: n, zip: row?.zipcode || '' };
                        });
                        setTambons(combined);
                    } else {
                        setTambons([]);
                    }
                }
            } catch {
                setTambons([]);
            }
        } else if (isDbReady) {
            const filtered = db.filter((r) => r.province === (contact.addressProvince || '') && r.amphoe === value);
            const uniqueNames = Array.from(new Set(filtered.map((r) => r.district))).sort((a, b) => a.localeCompare(b, 'th'));
            const combined = uniqueNames.map((n) => {
                const row = filtered.find((r) => r.district === n);
                return { name: n, zip: row?.zipcode || '' };
            });
            setTambons(combined);
        } else {
            setTambons([]);
        }
        setContact((prev) => ({
            ...prev,
            addressAmphoe: value,
            addressTambon: '',
            addressZip: ''
        }));
    };

    const handleTambonChange = (value: string) => {
        const match = tambons.find((t) => t.name === value);
        const zip = match?.zip ?? (contact.addressZip || '');
        const locationStr = value && contact.addressAmphoe && contact.addressProvince
            ? `${value}, ${contact.addressAmphoe}, ${contact.addressProvince} ${zip}`
            : contact.location;
        setContact((prev) => ({
            ...prev,
            addressTambon: value,
            addressZip: zip,
            location: locationStr,
        }));
    };

    const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContact((prev) => ({ ...prev, addressZip: value }));

        if (value.length === 5) {
            try {
                const res = await fetch(`/api/address/zipcode?zip=${value}`);
                if (res.ok) {
                    const matches = await res.json();
                    if (Array.isArray(matches) && matches.length > 0) {
                        const match = matches[0];
                        
                        // 1. Fetch Amphoes for the matched province
                        let newAmphoes: string[] = [];
                        if (hasMysql) {
                            try {
                                const resA = await fetch(`/api/address/amphoes?province=${encodeURIComponent(match.province)}`);
                                if (resA.ok) newAmphoes = await resA.json();
                            } catch {}
                        } else if (isDbReady) {
                             newAmphoes = Array.from(new Set(db.filter((r) => r.province === match.province).map((r) => r.amphoe))).sort((a, b) => a.localeCompare(b, 'th'));
                        } else {
                             try {
                                const resA = await fetch(`/api/amphoes?province=${encodeURIComponent(match.province)}`);
                                if (resA.ok) newAmphoes = await resA.json();
                             } catch {}
                        }
                        setAmphoes(newAmphoes);

                        // 2. Fetch Tambons for the matched amphoe
                        let newTambons: any[] = [];
                        if (hasMysql) {
                            try {
                                const resT = await fetch(`/api/address/tambons?province=${encodeURIComponent(match.province)}&amphoe=${encodeURIComponent(match.amphoe)}`);
                                if (resT.ok) newTambons = await resT.json();
                            } catch {}
                        } else if (isDbReady) {
                            const filtered = db.filter((r) => r.province === match.province && r.amphoe === match.amphoe);
                            const uniqueNames = Array.from(new Set(filtered.map((r) => r.district))).sort((a, b) => a.localeCompare(b, 'th'));
                            newTambons = uniqueNames.map((n) => {
                                const row = filtered.find((r) => r.district === n);
                                return { name: n, zip: row?.zipcode || '' };
                            });
                        }
                        setTambons(newTambons);

                        // 3. Set Contact State
                        setContact((prev) => ({
                            ...prev,
                            addressProvince: match.province,
                            addressAmphoe: match.amphoe,
                            addressTambon: match.tambon
                        }));
                    }
                }
            } catch (error) {
                console.error("Auto-fill address failed", error);
            }
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setMessage('Uploading image...');
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            setContact(prev => ({ ...prev, image: data.url }));
            setMessage('Image uploaded!');
        } catch {
            setMessage('Failed to upload image.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact),
            });
            if (res.ok) {
                setMessage('Contact updated successfully!');
            } else {
                setMessage('Failed to update contact.');
            }
        } catch {
            setMessage('Error saving data.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-4xl font-['Prompt',sans-serif]">
            {/* Premium Header with Dropdown */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-16 relative">
                <h1 className="text-5xl font-['Tenor_Sans',serif] tracking-tight">Admin</h1>
            </div>

            <h1 className="text-3xl font-['Tenor_Sans',serif] mb-8">Manage Contact Page</h1>

            <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg space-y-8 text-black">
                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Basic Info</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Page Title</label>
                            <input name="title" value={contact.title} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" placeholder="e.g., Get in Touch" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Intro Text</label>
                            <textarea name="intro" value={contact.intro} onChange={handleChange} rows={3} className="w-full border p-3 rounded-xl bg-white focus:border-black outline-none transition-colors" placeholder="Brief introduction text..." />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Email Content</label>
                            <input name="email" value={contact.email} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">University</label>
                            <input name="university" value={contact.university} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Profile Image</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                                    <img src={contact.image} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Footer Settings</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Footer Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border">
                                    <img src={contact.footerLogo} alt="Footer Logo" className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;
                                    const formData = new FormData();
                                    formData.append('file', e.target.files[0]);
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const data = await res.json();
                                    setContact(prev => ({ ...prev, footerLogo: data.url }));
                                }} className="text-xs" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Footer Background</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 border">
                                    <img src={contact.footerBg} alt="Footer BG" className="w-full h-full object-cover" />
                                </div>
                                <input type="file" accept="image/*" onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;
                                    const formData = new FormData();
                                    formData.append('file', e.target.files[0]);
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const data = await res.json();
                                    setContact(prev => ({ ...prev, footerBg: data.url }));
                                }} className="text-xs" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Side Content</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Left Content Text</label>
                            <textarea name="leftText" value={contact.leftText} onChange={handleChange} rows={4} className="w-full border p-2 rounded bg-white" placeholder="Text to display on the left side..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Right Content Text</label>
                            <textarea name="rightText" value={contact.rightText} onChange={handleChange} rows={4} className="w-full border p-2 rounded bg-white" placeholder="Text to display on the right side..." />
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">Social Links</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Facebook URL</label>
                            <input name="social_facebook" value={contact.socials.facebook} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">Instagram URL</label>
                            <input name="social_instagram" value={contact.socials.instagram} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">TikTok URL</label>
                            <input name="social_tiktok" value={contact.socials.tiktok} onChange={handleChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2">ข้อมูลที่อยู่</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">จังหวัด</label>
                            <select
                                value={contact.addressProvince || ''}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            >
                                <option value="">-- เลือกจังหวัด --</option>
                                {provinces.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">อำเภอ/เขต</label>
                            {(hasMysql || isDbReady || amphoes.length > 0) ? (
                                <select
                                    value={contact.addressAmphoe || ''}
                                    onChange={(e) => handleAmphoeChange(e.target.value)}
                                    className="w-full border p-2 rounded bg-white"
                                    disabled={!contact.addressProvince}
                                >
                                    <option value="">-- เลือกอำเภอ/เขต --</option>
                                    {amphoes.map((a) => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    name="addressAmphoe"
                                    value={contact.addressAmphoe || ''}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded bg-white"
                                    placeholder="กรอกอำเภอ/เขต"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">ตำบล/แขวง</label>
                            {(hasMysql || isDbReady) ? (
                                <select
                                    value={contact.addressTambon || ''}
                                    onChange={(e) => handleTambonChange(e.target.value)}
                                    className="w-full border p-2 rounded bg-white"
                                    disabled={!contact.addressAmphoe}
                                >
                                    <option value="">-- เลือกตำบล/แขวง --</option>
                                    {tambons.map((t) => (
                                        <option key={t.name} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    name="addressTambon"
                                    value={contact.addressTambon || ''}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded bg-white"
                                    placeholder="กรอกตำบล/แขวง"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider">รหัสไปรษณีย์</label>
                            <input name="addressZip" value={contact.addressZip || ''} onChange={handleZipChange} className="w-full border p-2 rounded bg-white" />
                        </div>
                    </div>
                    {message && (
                        <div className="p-4 rounded-2xl text-center text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                            {message}
                        </div>
                    )}
                </section>

                

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gray-200 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 transition-all disabled:opacity-50 shadow-xl border border-black/10"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div >
    );
}
