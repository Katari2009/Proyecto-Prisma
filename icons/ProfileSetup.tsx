import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { COURSES } from '../constants';
import type { UserProfile } from '../types';
import { ConectaChileLogo, UserCircleIcon } from './icons/Icons';
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
        // FIX: Initialize xp and achievements for the new user profile to match the UserProfile type.
        const profile: UserProfile = { name, course, avatar, xp: 0, achievements: [] };
        saveUser(profile);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}>
            <div className="w-full max-w-md bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                    <ConectaChileLogo className="h-16 w-16 mx-auto text-white" />
                    <h1 className="text-3xl font-bold text-white mt-4">Bienvenido/a a Conecta Chile</h1>
                    <p className="text-slate-200 mt-2">Crea tu perfil para comenzar a aprender.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-2 border-dashed border-white/50 mb-2 overflow-hidden">
                                {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <UserCircleIcon className="w-16 h-16 text-white/70" />}
                            </div>
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <span className="text-white text-sm">Elige tu imagen de perfil</span>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-white/20 border-white/30 rounded-lg shadow-sm py-3 px-4 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#A3DFFF]"
                            placeholder="Tu nombre completo"
                        />
                    </div>

                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-white">Curso</label>
                        <select
                            id="course"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="mt-1 block w-full bg-white/20 border-white/30 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#A3DFFF]"
                        >
                            {COURSES.map(c => <option key={c} value={c} className="bg-slate-700">{c}</option>)}
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full">
                        Comenzar
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
