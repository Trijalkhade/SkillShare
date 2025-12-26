'use client';

import styles from './PostCard.module.css';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai';
import { useState } from 'react';
import { toggleLike } from '@/app/actions';

// Define a type for the Post props
export type PostProps = {
    id: string;
    username: string;
    userImage?: string;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'TEXT';
    caption?: string;
    initialLikes: number;
    tags?: string[];
    createdAt: string;
};

export default function PostCard({
    id,
    username,
    userImage,
    mediaUrl,
    mediaType,
    caption,
    initialLikes,
    tags,
    createdAt,
}: PostProps) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [isLikeActionPending, setIsLikeActionPending] = useState(false);

    const handleToggleLike = async () => {
        if (isLikeActionPending) return;

        // Optimistic UI update
        const previousLiked = liked;
        const previousLikes = likes;

        setLiked(!previousLiked);
        setLikes(previousLiked ? previousLikes - 1 : previousLikes + 1);

        setIsLikeActionPending(true);

        try {
            const result = await toggleLike(id);

            // @ts-ignore
            if (result?.error) {
                throw new Error(result.error);
            }
        } catch (e) {
            console.error(e);
            // Revert
            setLiked(previousLiked);
            setLikes(previousLikes);
        } finally {
            setIsLikeActionPending(false);
        }
    };

    return (
        <article className={styles.card}>
            <div className={styles.header}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={userImage || '/default-avatar.png'}
                    alt={username}
                    className={styles.avatar}
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32'; }}
                />
                <span className={styles.username}>{username}</span>
            </div>

            <div className={styles.mediaWrapper} onDoubleClick={handleToggleLike}>
                {mediaType === 'VIDEO' ? (
                    <video src={mediaUrl} controls className={styles.media} />
                ) : mediaType === 'IMAGE' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={mediaUrl} alt="Post content" className={styles.media} loading="lazy" />
                ) : (
                    <div className={`${styles.media} ${styles.textPost}`}>
                        <p>{mediaUrl}</p>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
                    onClick={handleToggleLike}
                    aria-label="Like"
                >
                    {liked ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
                <button className={styles.actionBtn} aria-label="Comment">
                    <AiOutlineMessage />
                </button>
            </div>

            <div className={styles.info}>
                <div className={styles.likes}>{likes.toLocaleString()} likes</div>

                {caption && (
                    <div className={styles.caption}>
                        <span className={styles.username}>{username}</span>
                        {caption}
                    </div>
                )}

                {tags && tags.length > 0 && (
                    <div className={styles.tags}>
                        {tags.map(tag => `#${tag} `)}
                    </div>
                )}

                <time className={styles.date}>{createdAt}</time>
            </div>
        </article>
    );
}
