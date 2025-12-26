'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { AiFillHome, AiOutlinePlusSquare, AiOutlineHeart, AiOutlineUser } from 'react-icons/ai';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    BinaryScope
                </Link>

                <div className={styles.menu}>
                    <Link href="/" className={styles.menuItem} aria-label="Home">
                        <AiFillHome />
                    </Link>
                    <Link href="/upload" className={styles.menuItem} aria-label="Upload">
                        <AiOutlinePlusSquare />
                    </Link>
                    <Link href="/likes" className={styles.menuItem} aria-label="Likes">
                        <AiOutlineHeart />
                    </Link>
                    <Link href="/profile" className={styles.menuItem} aria-label="Profile">
                        <AiOutlineUser />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
