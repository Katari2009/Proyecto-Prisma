import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { COURSES } from '../constants';
import type { UserProfile } from '../types';
import { PrismaLogo, UserCircleIcon } from './icons/Icons';
import Button from './common/Button';

const ProfileSetup: React.FC = () => {
    const { saveUser } = useUser();
    const [name, setName] = useState('');
    const [course, setCourse] = useState(COURSES[0]);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const [error, setError] = useState('');

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 3) {
            setError('Por favor, ingresa un nombre con al menos 3 caracteres.');
            return;
        }
        setError('');
        const profile: UserProfile = { 
            name, 
            course, 
            avatar,
            xp: 0,
            achievements: []
        };
        saveUser(profile);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-slate-900 -z-20"></div>
            <div className="absolute top-0 left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_500px_at_50%_50%,#38bdf820_0%,#d946ef20_50%,#0f172a_100%)] animate-[spin_20s_linear_infinite] -z-10"></div>

            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 animate-fade-in">
                <div className="text-center mb-8">
                    <PrismaLogo className="h-16 w-16 mx-auto" />
                    <h1 className="text-3xl font-bold text-white mt-4">Bienvenido/a a Proyecto Prisma</h1>
                    <p className="text-slate-300 mt-2">Crea tu perfil para comenzar a aprender.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <label htmlFor="avatar-upload" className="cursor-pointer group">
                            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20 mb-2 overflow-hidden group-hover:border-sky-400 transition-colors">
                                {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <UserCircleIcon className="w-16 h-16 text-white/40 group-hover:text-white/70 transition-colors" />}
                            </div>
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <span className="text-white text-sm">Elige tu imagen de perfil</span>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-white/5 border-white/20 border rounded-full shadow-sm py-3 px-5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Tu nombre completo"
                        />
                    </div>

                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-white mb-1">Curso</label>
                        <select
                            id="course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                             className="mt-1 block w-full bg-white/5 border-white/20 border rounded-full shadow-sm py-3 px-5 text-white focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none"
                        >
                            {COURSES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full">
                        Comenzar Aventura
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;