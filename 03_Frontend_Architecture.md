# 프론트엔드 아키텍처 문서

## 🎯 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context + Custom Hooks
- **Form**: React Hook Form + Zod
- **Build Tool**: Turbopack

## 📁 프로젝트 구조
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈 페이지
│   │   ├── auth/
│   │   │   └── page.tsx       # 로그인 페이지
│   │   ├── posts/
│   │   │   ├── page.tsx       # 게시글 목록
│   │   │   ├── new/
│   │   │   │   └── page.tsx   # 게시글 작성
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # 게시글 상세
│   │   │       └── edit/
│   │   │           └── page.tsx # 게시글 수정
│   ├── components/            # 재사용 컴포넌트
│   │   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── posts/            # 게시글 관련 컴포넌트
│   │   └── comments/         # 댓글 관련 컴포넌트
│   ├── hooks/                # 커스텀 훅
│   ├── lib/                  # 유틸리티 & API
│   ├── types/                # TypeScript 타입
│   └── styles/               # 스타일 파일
├── public/                   # 정적 파일
└── tailwind.config.js       # Tailwind 설정
```

## 🎨 건담 테마 디자인 시스템

### 컬러 팔레트
```css
/* tailwind.config.js */
colors: {
  background: '#0A0A0A',
  surface: '#111111',
  primary: {
    DEFAULT: '#33FF33', // Monitor Green
    hover: '#55FF55',
  },
  secondary: {
    DEFAULT: '#BBBBBB', // Grayish
  },
  amber: {
    DEFAULT: '#FFB000', // Amber for highlights
  },
  system: '#FF8C00', // Windows95 style orange
  danger: '#FF3333',
  border: '#2D2D2D',
  // 건담 테마 색상
  federation: '#4169E1',
  zeon: '#DC143C',
  anaheim: '#FFD700',
}
```

### 컴포넌트 스타일
```css
/* 레트로 GUI 버튼 */
.retro-button {
  @apply bg-surface border-2 border-border border-outset;
  @apply text-primary font-pixel text-sm uppercase;
  @apply px-4 py-2;
}

.retro-button:hover {
  @apply bg-gray-800 text-amber;
}

.retro-button:active {
  @apply border-inset bg-gray-900;
}
```

## 🗂️ 컴포넌트 설계

### Layout 컴포넌트

#### RootLayout
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-primary-50 text-white min-h-screen">
        <AuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### Header
```tsx
// components/layout/Header.tsx
export function Header() {
  const { user, logout } = useAuth()
  
  return (
    <header className="bg-primary-100 border-b border-neon-blue/30">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-neon-blue">
          GUNDAM UNIVERSE
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/posts" className="gundam-button px-4 py-2 rounded">
                게시판
              </Link>
              <Link href="/posts/new" className="gundam-button px-4 py-2 rounded">
                글쓰기
              </Link>
              <UserMenu user={user} onLogout={logout} />
            </>
          ) : (
            <Link href="/auth" className="gundam-button px-4 py-2 rounded">
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
```

### 인증 컴포넌트

#### AuthProvider
```tsx
// components/auth/AuthProvider.tsx
interface AuthContextType {
  user: User | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])
  
  const login = (token: string) => {
    localStorage.setItem('auth_token', token)
    fetchUser(token)
  }
  
  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    router.push('/auth')
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

#### GoogleLoginButton
```tsx
// components/auth/GoogleLoginButton.tsx
export function GoogleLoginButton() {
  const { login } = useAuth()
  
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await api.post('/auth/google', {
        id_token: credentialResponse.credential
      })
      
      login(response.data.access_token)
      router.push('/posts')
    } catch (error) {
      toast.error('로그인에 실패했습니다.')
    }
  }
  
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error('Google 로그인 오류')}
        theme="filled_blue"
        text="signin_with"
        locale="ko"
      />
    </GoogleOAuthProvider>
  )
}
```

### 게시글 컴포넌트

#### PostList
```tsx
// components/posts/PostList.tsx
interface PostListProps {
  posts: Post[]
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function PostList({ posts, pagination, onPageChange }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
```

#### PostCard
```tsx
// components/posts/PostCard.tsx
export function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-primary-100 border border-neon-blue/30 rounded-lg p-6 hover:shadow-lg hover:shadow-neon-blue/20 transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-neon-blue hover:text-neon-green transition-colors">
          <Link href={`/posts/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        <span className="text-sm text-gray-400">
          {formatDate(post.created_at)}
        </span>
      </div>
      
      <p className="text-gray-300 mb-4 line-clamp-3">
        {post.content}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-neon-blue">
          by {post.author.name}
        </span>
        <span className="text-sm text-gray-400">
          댓글 {post.comment_count}개
        </span>
      </div>
    </div>
  )
}
```

#### PostForm
```tsx
// components/posts/PostForm.tsx
interface PostFormData {
  title: string
  content: string
}

const schema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200, '제목은 200자 이하로 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요').max(10000, '내용은 10000자 이하로 입력해주세요'),
})

export function PostForm({ post, onSubmit }: { post?: Post, onSubmit: (data: PostFormData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(schema),
    defaultValues: post ? { title: post.title, content: post.content } : undefined
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neon-blue mb-2">
          제목
        </label>
        <input
          {...register('title')}
          className="w-full px-4 py-3 bg-primary-100 border border-neon-blue/30 rounded-lg focus:outline-none focus:border-neon-blue text-white"
          placeholder="게시글 제목을 입력하세요"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-neon-red">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neon-blue mb-2">
          내용
        </label>
        <textarea
          {...register('content')}
          rows={15}
          className="w-full px-4 py-3 bg-primary-100 border border-neon-blue/30 rounded-lg focus:outline-none focus:border-neon-blue text-white resize-none"
          placeholder="게시글 내용을 입력하세요"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-neon-red">{errors.content.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="gundam-button px-6 py-3 rounded-lg font-medium"
      >
        {post ? '수정하기' : '작성하기'}
      </button>
    </form>
  )
}
```

### 댓글 컴포넌트

#### CommentList
```tsx
// components/comments/CommentList.tsx
export function CommentList({ postId }: { postId: string }) {
  const { data: comments, mutate } = useSWR(`/posts/${postId}/comments`, fetcher)
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neon-blue">댓글</h3>
      
      <CommentForm postId={postId} onSuccess={mutate} />
      
      {comments?.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          postId={postId}
          onUpdate={mutate}
        />
      ))}
    </div>
  )
}
```

#### CommentItem
```tsx
// components/comments/CommentItem.tsx
export function CommentItem({ comment, postId, onUpdate }: CommentItemProps) {
  const { user } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div className="bg-primary-100 border border-neon-blue/20 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-neon-blue">{comment.author.name}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            {formatDate(comment.created_at)}
          </span>
          {user?.id === comment.author.id && (
            <CommentActions
              comment={comment}
              onEdit={() => setIsEditing(true)}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
      
      {isEditing ? (
        <CommentEditForm
          comment={comment}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false)
            onUpdate()
          }}
        />
      ) : (
        <p className="text-gray-300 mb-3">{comment.content}</p>
      )}
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-xs text-neon-green hover:text-neon-blue transition-colors"
        >
          답글
        </button>
      </div>
      
      {showReplyForm && (
        <div className="mt-3 ml-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={() => {
              setShowReplyForm(false)
              onUpdate()
            }}
          />
        </div>
      )}
      
      {comment.replies?.map((reply) => (
        <div key={reply.id} className="ml-8 mt-3">
          <CommentItem 
            comment={reply} 
            postId={postId} 
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  )
}
```

## 🔌 API 연동

### API Client 설정
```tsx
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)
```

### Custom Hooks
```tsx
// hooks/usePosts.ts
export function usePosts(page: number = 1) {
  return useSWR(`/posts?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
}

export function usePost(id: string) {
  return useSWR(id ? `/posts/${id}` : null, fetcher)
}

export function useCreatePost() {
  return useSWRMutation('/posts', (url, { arg }) => api.post(url, arg))
}
```

## 📱 반응형 디자인

### 브레이크포인트
```js
// tailwind.config.js
screens: {
  'sm': '640px',   // 모바일
  'md': '768px',   // 태블릿
  'lg': '1024px',  // 데스크톱
  'xl': '1280px',  // 대형 데스크톱
}
```

### 반응형 컴포넌트
```tsx
// 모바일 우선 설계
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 게시글 카드들 */}
</div>

// 모바일에서 사이드바 숨김
<aside className="hidden lg:block lg:w-1/4">
  {/* 사이드바 내용 */}
</aside>
```

## 🔧 빌드 & 배포

### 환경 변수
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.gundam-board.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Vercel 배포 설정
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
``` 