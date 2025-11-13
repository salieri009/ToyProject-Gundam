# 🤖 GUNDAM UNIVERSE BOARD

> **ガンダム宇宙世紀テーマの次世代掲示板プラットフォーム**  
> Google OAuth、JWT認証 • Next.js + Chalice マイクロサービスアーキテクチャ  
> PostgreSQLデータベース • AWS Lambdaサーバーレスデプロイ

[![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-339933?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.13.8-3776ab?logo=python)](https://www.python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20API%20Gateway-FF9900?logo=amazon-aws)](https://aws.amazon.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[한국어](README.md) | [English](README.en.md) | **日本語**

---

<div align="center">

![Header](https://capsule-render.vercel.app/api?type=wave&color=gradient&customColorList=0,2,5,30&height=200&text=GUNDAM%20UNIVERSE%20BOARD&fontSize=60&fontColor=ffffff&animation=fadeIn&desc=Next-Generation%20Community%20Platform&descSize=20&descAlignY=70)

</div>

---

## 📖 About

**GUNDAM UNIVERSE BOARD**は、ガンダム宇宙世紀ファンのためのコミュニティプラットフォームです。  
モダンなウェブ技術スタックを活用して、**ユーザー認証**、**掲示板CRUD**、**階層型コメントシステム**を実装しました。

このプロジェクトは以下を実演します：

- 🔐 **JWT + Google OAuth** - 安全な認証フロー
- 🏗️ **マイクロサービスアーキテクチャ** - 独立したフロントエンド/バックエンドの分離
- 📊 **データベース最適化** - SQLAlchemy ORM、インデックス、クエリ最適化
- ☁️ **クラウドネイティブ設計** - AWS Lambda (Chalice)、PostgreSQL RDS
- 🎨 **レトロ80年代CRTテーマ** - Nixie Tube数値表示、蛍光グリーン美学

---

## 📁 プロジェクト構造（30年ベテランエンジニアの視点）

このセクションは、30年間のソフトウェアエンジニアリング経験に基づいて書かれています。プロジェクトのアーキテクチャ設計原則と各レイヤーの責任分離を明確に説明します。

### 完全なディレクトリ構造

```
ToyProject-Gundam/
├── backend/                          # AWS Chalice バックエンドサービス
│   ├── app.py                        # Chaliceアプリケーションエントリーポイント
│   ├── requirements.txt              # Python依存関係管理
│   └── chalicelib/                   # コアビジネスロジックライブラリ
│       ├── config.py                 # 環境変数と設定
│       ├── database.py               # SQLAlchemyセッション管理と接続プール
│       ├── auth/                     # 認証モジュール
│       │   ├── google_auth.py        # Google OAuth 2.0検証ロジック
│       │   └── jwt.py                # JWTトークン生成/検証ユーティリティ
│       ├── models/                   # SQLAlchemy ORMモデル（ドメインエンティティ）
│       │   ├── user.py               # ユーザーエンティティ（usersテーブル）
│       │   ├── post.py               # 投稿エンティティ（postsテーブル）
│       │   ├── comment.py            # コメントエンティティ（commentsテーブル）
│       │   └── refresh_token.py      # リフレッシュトークンエンティティ
│       └── routes/                   # REST APIエンドポイント定義
│           ├── __init__.py           # ルート登録とBlueprint統合
│           ├── auth.py               # 認証API (/auth/*)
│           ├── posts.py              # 投稿API (/posts/*)
│           └── comments.py           # コメントAPI (/comments/*)
│
├── frontend/                         # Next.js フロントエンドアプリケーション
│   ├── package.json                  # Node.js依存関係とスクリプト
│   ├── next.config.js                # Next.jsビルド設定
│   ├── tailwind.config.js            # Tailwind CSSユーティリティ設定
│   ├── tsconfig.json                 # TypeScriptコンパイラ設定
│   └── src/
│       ├── app/                      # Next.js 14 App Router（ファイルベースルーティング）
│       │   ├── layout.tsx            # ルートレイアウト（グローバルスタイル、メタデータ）
│       │   ├── page.tsx              # ホームページ (/)
│       │   ├── globals.css           # グローバルCSSスタイル（CRTテーマ）
│       │   ├── auth/
│       │   │   └── page.tsx          # 認証ページ (/auth)
│       │   └── posts/
│       │       ├── page.tsx          # 投稿一覧 (/posts)
│       │       ├── new/
│       │       │   └── page.tsx      # 投稿作成 (/posts/new)
│       │       └── [id]/
│       │           ├── page.tsx      # 投稿詳細 (/posts/:id)
│       │           └── edit/
│       │               └── page.tsx  # 投稿編集 (/posts/:id/edit)
│       │
│       ├── components/               # 再利用可能なReactコンポーネント
│       │   ├── layout/               # レイアウトコンポーネント
│       │   │   ├── Header.tsx        # ナビゲーションヘッダー
│       │   │   └── Footer.tsx        # フッター
│       │   └── ui/                   # UIプリミティブコンポーネント
│       │       ├── LoadingSpinner.tsx    # ローディングインジケーター
│       │       ├── NixieNumber.tsx       # Nixie Tubeスタイル数値表示
│       │       └── StatusIndicator.tsx   # ステータスインジケーター
│       │
│       ├── services/                 # 外部API通信レイヤー
│       │   ├── api.ts                # Axiosインスタンスとインターセプター設定
│       │   └── weatherService.ts     # （参考）天気APIサービス
│       │
│       ├── hooks/                    # カスタムReact Hooks
│       │   └── useAuth.ts            # 認証状態管理フック
│       │
│       ├── context/                  # React Context API（グローバル状態）
│       │   └── WeatherContext.tsx    # （参考）天気コンテキスト
│       │
│       ├── types/                    # TypeScript型定義
│       │   ├── index.ts              # 共通型（User、Post、Comment）
│       │   └── weather.ts            # 天気関連型
│       │
│       └── pages/                    # （レガシー）Pages Routerコンポーネント
│           ├── AuthPage.tsx
│           ├── HomePage.tsx
│           ├── PostsPage.tsx
│           ├── PostDetailPage.tsx
│           └── NewPostPage.tsx
│
└── docs/                             # プロジェクトドキュメント
    ├── DesignPlan.md                 # プロジェクト計画と設計ドキュメント
    ├── LOCAL_SETUP_GUIDE.md          # ローカル開発環境セットアップガイド
    ├── 01_API_Design.md              # REST API仕様
    ├── 02_Database_Design.md         # データベーススキーマ設計
    ├── 03_Frontend_Architecture.md   # フロントエンドアーキテクチャドキュメント
    ├── 04_Backend_Architecture.md    # バックエンドアーキテクチャドキュメント
    └── 05_UI_UX_Design.md           # UI/UXデザインガイド
```

### アーキテクチャ設計原則

#### 1. **関心の分離（Separation of Concerns）**
- **Backend**: ビジネスロジック、データ検証、データベースアクセスのみを担当
- **Frontend**: ユーザーインターフェース、状態管理、API呼び出しのみを担当
- **Database**: データ永続化と関係管理

#### 2. **レイヤードアーキテクチャ（Layered Architecture）**
```
┌─────────────────────────────────────┐
│   Presentation Layer (Next.js)     │  ← ユーザーインターフェース
├─────────────────────────────────────┤
│   Application Layer (Chalice)      │  ← ビジネスロジック
├─────────────────────────────────────┤
│   Data Access Layer (SQLAlchemy)   │  ← データベース抽象化
├─────────────────────────────────────┤
│   Database Layer (PostgreSQL)      │  ← データ永続化
└─────────────────────────────────────┘
```

#### 3. **依存性逆転の原則（Dependency Inversion Principle）**
- `routes/`モジュールは`models/`と`auth/`に依存しますが、具体的な実装ではなくインターフェースに依存
- SQLAlchemy ORMを通じてデータベース実装の詳細を抽象化

#### 4. **単一責任の原則（Single Responsibility Principle）**
- 各モジュールは明確な責任を1つだけ持つ
  - `auth/google_auth.py`: Google OAuth検証のみを担当
  - `auth/jwt.py`: JWTトークン生成/検証のみを担当
  - `routes/posts.py`: 投稿関連APIのみを担当

---

## 🏛️ ソリューションアーキテクチャ

<div align="center">

```
┌─────────────────────────────────────────────────────┐
│              GUNDAM UNIVERSE BOARD                  │
├──────────────────────┬──────────────────────────────┤
│  FRONTEND (Next.js)  │   BACKEND (AWS Chalice)      │
│                      │                              │
│  • React Components  │  • JWT + OAuth Routes        │
│  • TypeScript        │  • Post/Comment APIs         │
│  • Tailwind CSS      │  • Request Validation        │
│  • Axios HTTP Client │  • Lambda Functions          │
│                      │                              │
│  localhost:5173      │   API Gateway: api.*         │
└──────────┬───────────┴──────────┬───────────────────┘
           │                      │
           └──────────────────────┤
                    HTTPS/JSON-RPC
                  (JWT Authorization)
                                   │
                    ┌──────────────┴──────────────┐
                    │  PostgreSQL 15+ (RDS)      │
                    │  • Users                   │
                    │  • Posts                   │
                    │  • Comments (Hierarchical)│
                    │  • Refresh Tokens          │
                    └────────────────────────────┘
```

</div>

### 認証フロー

1. **ログイン**: ユーザー → Google OAuth → バックエンド (`/auth/google`)
2. **トークン発行**: バックエンド → JWT (24h) + リフレッシュトークン (7d)
3. **APIリクエスト**: フロントエンド → Axiosインターセプター（Bearerトークン自動付与）
4. **トークン更新**: 期限切れ時 → `/auth/refresh`呼び出し → 新しいJWT発行
5. **ログアウト**: クライアントトークン削除 + リフレッシュトークン無効化

---

## 🛠️ 技術スタック

### Frontend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | プロダクション級Reactフレームワーク |
| **Language** | TypeScript | 型安全性 |
| **Styling** | Tailwind CSS | ユーティリティベースのスタイリング |
| **HTTP Client** | Axios | 自動JWTインターセプター |
| **Auth** | @react-oauth/google | Google OAuth 2.0 |
| **State** | React Context + Hooks | グローバル状態管理 |
| **Forms** | React Hook Form + Zod | フォーム検証 |

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | AWS Chalice | Python Lambdaマイクロフレームワーク |
| **Language** | Python 3.13 | 型ヒントサポート |
| **ORM** | SQLAlchemy + psycopg2 | PostgreSQLオブジェクトマッピング |
| **Auth** | PyJWT + google-auth | JWT + Googleトークン検証 |
| **Deployment** | AWS Lambda + API Gateway | サーバーレスコンピューティング |
| **CORS** | Chalice CORS | クロスドメインリクエスト処理 |

### Database

| Component | Technology |
|-----------|-----------|
| **DBMS** | PostgreSQL 15+ |
| **ORM** | SQLAlchemy 2.0 |
| **Connection Pool** | SQLAlchemy QueuePool |
| **Indexes** | B-tree on users.email, posts.user_id, comments.post_id |

---

## 🚀 クイックスタート

### 前提条件

- **Node.js** v22.20.0以上
- **Python** 3.13以上
- **PostgreSQL** 15以上（ローカルまたはAWS RDS）
- **Google OAuth 2.0**認証情報（[Google Cloud Console](https://console.cloud.google.com)）

### ローカル開発環境セットアップ

**詳細なセットアップ手順については、[`docs/LOCAL_SETUP_GUIDE.ja.md`](docs/LOCAL_SETUP_GUIDE.ja.md)を参照してください。**

#### 1️⃣ リポジトリのクローン

```bash
git clone https://github.com/salieri009/ToyProject-Gundam.git
cd ToyProject-Gundam
```

#### 2️⃣ バックエンドのセットアップと実行

```bash
# backendフォルダに移動
cd backend

# 仮想環境を作成
python -m venv venv

# 有効化（Windows PowerShell）
.\venv\Scripts\Activate

# または（Windows CMD/Git Bash）
# venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# 環境変数を設定
# .envファイルを作成（参照: .env.example）
# 追加: DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID

# ローカル開発サーバーを開始（ポート8000）
chalice local --port 8000
```

#### 3️⃣ フロントエンドのセットアップと実行

```bash
# プロジェクトルートに戻る
cd ../frontend

# 依存関係をインストール
npm install

# 環境変数を設定
# .env.localファイルを作成（参照: .env.local.example）
# 追加: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID

# 開発サーバーを開始（ポート5173）
npm run dev
```

#### 4️⃣ ブラウザでアクセス

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 📚 ドキュメント

| ドキュメント | 説明 |
|----------|-------------|
| [`docs/LOCAL_SETUP_GUIDE.ja.md`](docs/LOCAL_SETUP_GUIDE.ja.md) | 完全なローカル開発環境セットアップガイド（PostgreSQL、環境変数、Google OAuth） |
| [`docs/01_API_Design.md`](docs/01_API_Design.md) | REST APIエンドポイント仕様（リクエスト/レスポンススキーマ） |
| [`docs/02_Database_Design.md`](docs/02_Database_Design.md) | PostgreSQLスキーマ、SQLAlchemyモデル、インデックス戦略 |
| [`docs/03_Frontend_Architecture.md`](docs/03_Frontend_Architecture.md) | Next.jsフォルダ構造、コンポーネント設計、状態管理 |
| [`docs/04_Backend_Architecture.md`](docs/04_Backend_Architecture.md) | Chalice構造、ルーティング、認証ミドルウェア |
| [`docs/05_UI_UX_Design.md`](docs/05_UI_UX_Design.md) | レトロ80年代CRTテーマ、Nixie Tubeデザイン、CSS効果 |

---

## ✨ 機能

### 🔐 認証と認可

- ✅ **Google OAuth 2.0** ログイン/ログアウト
- ✅ **JWTトークン**（24時間有効）
- ✅ **リフレッシュトークン**（7日間有効、自動更新）
- ✅ **ロールベースアクセス制御**（所有者のみ編集/削除可能）

### 📝 投稿管理

- ✅ **作成**: 新しい投稿（タイトル + 内容）
- ✅ **読み取り**: 投稿一覧（ページネーション）と詳細表示
- ✅ **更新**: 自分の投稿を編集
- ✅ **削除**: 自分の投稿を削除

### 💬 コメントシステム

- ✅ **ネストされたコメント**（1レベル深度）
- ✅ **作成/編集/削除**コメント
- ✅ **親コメントベースの階層構造**

---

## 🧪 テストとデプロイメント

### ローカルテスト

```bash
# バックエンドユニットテスト（例）
cd backend && pytest tests/

# フロントエンドコンポーネントテスト（例）
cd ../frontend && npm run test
```

### AWSデプロイメント

```bash
cd backend

# devステージにデプロイ
chalice deploy --stage dev

# プロダクションステージにデプロイ
chalice deploy --stage prod

# デプロイメントステータスを確認
chalice status --stage dev
```

詳細なデプロイメントガイドについては、[`docs/LOCAL_SETUP_GUIDE.ja.md`](docs/LOCAL_SETUP_GUIDE.ja.md#8-awsデプロイメント準備)を参照してください。

---

## 📖 参考文献

### アーキテクチャとパターン

- 🔗 [AWS Chalice Documentation](https://aws.github.io/chalice/latest/)
- 🔗 [Next.js 14 App Router](https://nextjs.org/docs/app)
- 🔗 [SQLAlchemy 2.0 ORM](https://docs.sqlalchemy.org/en/20/)
- 🔗 [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

### 学習リソース

- 📖 **Building Microservices** - Sam Newman（マイクロサービス設計原則）
- 📖 **RESTful Web API Design** - Leonard Richardson（REST API設計）
- 📖 **PostgreSQL公式ドキュメント** - [postgresql.org](https://www.postgresql.org/docs/)

### 関連プロジェクト

- 🔗 [EventualShop](https://github.com/AntonioFalcaoJr/EventualShop) - イベントソーシング + CQRSパターン
- 🔗 [Gundam Wiki](https://en.gundam.info/en/) - ガンダム宇宙世紀の背景知識

---

<div align="center">

## 🤝 コントリビューション

このプロジェクトに貢献したい場合：

1. このリポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/AmazingFeature`）
3. 変更をコミット（`git commit -m 'Add AmazingFeature'`）
4. ブランチにプッシュ（`git push origin feature/AmazingFeature`）
5. プルリクエストを開く

---

## 📋 バージョニング

このプロジェクトは[Semantic Versioning](https://semver.org/)に従います。

リリース履歴については[Releases](https://github.com/salieri009/ToyProject-Gundam/releases)を参照してください。

---

## 👤 作成者

**Salieri (salieri009)**

- GitHub: [@salieri009](https://github.com/salieri009)
- Project: [GUNDAM UNIVERSE BOARD](https://github.com/salieri009/ToyProject-Gundam)

---

## 📜 ライセンス

このプロジェクトは**MIT License**の下でライセンスされています - 詳細については[LICENSE](LICENSE)ファイルを参照してください。

---

**Made with ❤️ by Salieri | AI-Assisted Development with Cursor**

*ガンダム宇宙世紀にインスパイアされた次世代コミュニティプラットフォーム*

</div>

