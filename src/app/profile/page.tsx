import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import styles from '@/components/Profile/Profile.module.css';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import { AiOutlineCamera } from 'react-icons/ai';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    // Use session email or fallback to demo
    const userEmail = session?.user?.email || 'demo@example.com';

    const user = await prisma.user.findFirst({
        where: { email: userEmail },
        include: {
            _count: {
                select: { posts: true }
            },
            posts: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>User not found</h1>
                <p>Please log in or upload a file to create a demo account.</p>
            </div>
        );
    }

    return (
        <div>
            <ProfileHeader user={user} />

            <div className={styles.grid}>
                {user.posts.length > 0 ? (
                    user.posts.map((post) => (
                        <div key={post.id} className={styles.gridItem}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {post.type === 'VIDEO' ? (
                                <video src={post.url || ''} className={styles.gridImage} />
                            ) : (
                                <img
                                    src={post.url || ''}
                                    alt={post.caption || 'User post'}
                                    className={styles.gridImage}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.noPosts}>
                        <AiOutlineCamera className={styles.placeholderIcon} />
                        <p>No Posts Yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
