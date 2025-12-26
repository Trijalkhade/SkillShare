'use client';

import { useState, useRef } from 'react';
import styles from './Upload.module.css';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const [type, setType] = useState<'MEDIA' | 'TEXT'>('MEDIA');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('caption', caption);
            formData.append('tags', tags);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            console.log('Upload success:', data);

            router.push('/');
            router.refresh(); // Refresh server components
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Create New Post</h1>

            <div className={styles.tabs}>
                <div
                    className={`${styles.tab} ${type === 'MEDIA' ? styles.activeTab : ''}`}
                    onClick={() => setType('MEDIA')}
                >
                    Photo / Video
                </div>
                <div
                    className={`${styles.tab} ${type === 'TEXT' ? styles.activeTab : ''}`}
                    onClick={() => setType('TEXT')}
                >
                    Text
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {type === 'MEDIA' && (
                    <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
                        {preview ? (
                            <div className={styles.preview}>
                                {file?.type.startsWith('video') ? (
                                    <video src={preview} controls />
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={preview} alt="Preview" />
                                )}
                            </div>
                        ) : (
                            <p>Click to select photos or videos</p>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Caption</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Write a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Tags</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Add tags separated by comma (e.g. nature, travel)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={uploading}>
                    {uploading ? 'Sharing...' : 'Share'}
                </button>
            </form>
        </div>
    );
}
