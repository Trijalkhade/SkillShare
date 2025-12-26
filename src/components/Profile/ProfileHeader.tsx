'use client';

import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { AiOutlineSetting } from 'react-icons/ai';

export default function ProfileHeader({ user }: { user: any }) {
    const [darkMode, setDarkMode] = useState(false);
    const [anonymous, setAnonymous] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    const clearCache = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <header className={styles.header}>
            <div className={styles.avatarContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={user?.image || 'https://via.placeholder.com/150'}
                    alt={`${user?.name || 'User'}'s Avatar`}
                    className={styles.avatar}
                />
            </div>
            <div className={styles.info}>
                <div className={styles.topRow}>
                    <h2 className={styles.username}>{user?.name || 'Anonymous'}</h2>
                    <div className={styles.settingsGroup}>
                        <button className={styles.settingsBtn} onClick={toggleDarkMode}>
                            {darkMode ? 'Light' : 'Dark'}
                        </button>
                        <button className={styles.settingsBtn} onClick={clearCache}>
                            Reset
                        </button>
                        <AiOutlineSetting size={24} />
                    </div>
                </div>

                <div className={styles.stats}>
                    <span><span className={styles.statCount}>{user?._count?.posts || 0}</span> posts</span>
                    <span><span className={styles.statCount}>0</span> followers</span>
                    <span><span className={styles.statCount}>0</span> following</span>
                </div>

                <div className={styles.bio}>
                    <span className={styles.fullName}>{user?.name}</span>
                    <p>{user?.bio || 'No bio yet.'}</p>
                </div>
            </div>
        </header>
    );
}
