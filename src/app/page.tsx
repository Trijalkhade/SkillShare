import PostCard, { PostProps } from '@/components/PostCard/PostCard';
import { prisma } from '@/lib/prisma';

// Revalidate every 60 seconds or implement infinite scroll
export const revalidate = 0; // standard dynamic fetch

async function getPosts(): Promise<PostProps[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      tags: true,
      likes: true, // We need count or check if current user liked
    },
  });

  return posts.map((post: any) => ({
    id: post.id,
    username: post.user?.name || 'Anonymous',
    userImage: post.user?.image || undefined,
    mediaUrl: post.url || '',
    mediaType: post.type as 'IMAGE' | 'VIDEO' | 'TEXT',
    caption: post.caption || undefined,
    initialLikes: post.likes.length,
    tags: post.tags.map((t: any) => t.name),
    createdAt: post.createdAt.toLocaleDateString(),
  }));
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div style={{ maxWidth: '470px', margin: '20px auto' }}>
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8e8e8e' }}>
          No posts yet. Be the first to upload!
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} {...post} />
        ))
      )}
    </div>
  );
}
