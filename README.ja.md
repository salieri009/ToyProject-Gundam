# 🤖 GUNDAM UNIVERSE BOARD

> **ガンダム宇宙世紀をテーマにした次世代コミュニティプラットフォーム**  
> Google OAuth & JWT認証 • Next.js + Chaliceマイクロサービスアーキテクチャ  
> PostgreSQLデータベース • AWS Lambda サーバーレスデプロイ

[![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-339933?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.13.8-3776ab?logo=python)](https://www.python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)](https://nextjs.org)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20API%20Gateway-FF9900?logo=amazon-aws)](https://aws.amazon.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-316192?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 プロジェクト概要

**GUNDAM UNIVERSE BOARD**はガンダム宇宙世紀ファンのためのコミュニティプラットフォームです。  
最新のウェブ技術を活用して、**ユーザー認証**、**投稿のCRUD操作**、**階層型コメントシステム**を実装しました。

このプロジェクトは以下を実証しています:

- 🔐 **JWT + Google OAuth** - セキュアな認証フロー
- 🏗️ **マイクロサービスアーキテクチャ** - フロントエンドとバックエンドの分離
- 📊 **データベース最適化** - SQLAlchemy ORM、インデックス、クエリ最適化
- ☁️ **クラウドネイティブ設計** - AWS Lambda（Chalice）、PostgreSQL RDS
- 🎨 **レトロ80年代CRTテーマ** - ニキシー管数字、リン酸緑の美学

---

## 🏛️ ソリューションアーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│              GUNDAM UNIVERSE BOARD                  │
├──────────────────────┬──────────────────────────────┤
│  フロントエンド      │   バックエンド               │
│  (Next.js)          │   (AWS Chalice)              │
│                      │                              │
│  • Reactコンポーネント │ • JWT + OAuthルート         │
│  • TypeScript        │ • 投稿/コメントAPI          │
│  • Tailwind CSS      │ • リクエスト検証            │
│  • Axios HTTPクライアント│ • Lambda関数             │
│                      │                              │
│  localhost:5173      │   API Gateway: api.*         │
└──────────┬───────────┴──────────┬───────────────────┘
           │                      │
           └──────────────────────┤
                    HTTPS/JSON-RPC
                  (JWT認可)
                                   │
                    ┌──────────────┴──────────────┐
                    │  PostgreSQL 15+ (RDS)      │
                    │  • ユーザー                │
                    │  • 投稿                   │
                    │  • コメント (階層型)      │
                    │  • リフレッシュトークン    │
                    └────────────────────────────┘
```

### 認証フロー

1. **ログイン**: ユーザー → Google OAuth → バックエンド (`/auth/google`)
2. **トークン発行**: バックエンド → JWT（24時間有効）+ リフレッシュトークン（7日有効）
3. **API要求**: フロントエンド → Axiosインターセプター（ベアラートークン自動含有）
4. **トークン更新**: 有効期限切れ → `/auth/refresh`呼び出し → 新しいJWT発行
5. **ログアウト**: クライアントトークン削除 + リフレッシュトークン無効化

---

## 🛠️ テックスタック

### フロントエンド

| レイヤー | テクノロジー | 用途 |
|--------|-----------|------|
| **フレームワーク** | Next.js 14 (App Router) | 本番グレードのReactフレームワーク |
| **言語** | TypeScript | 型安全性 |
| **スタイリング** | Tailwind CSS | ユーティリティベースのスタイリング |
| **HTTPクライアント** | Axios | 自動JWT インターセプター |
| **認証** | @react-oauth/google | Google OAuth 2.0 |
| **状態管理** | React Context + Hooks | グローバル状態管理 |
| **フォーム** | React Hook Form + Zod | フォーム検証 |

### バックエンド

| レイヤー | テクノロジー | 用途 |
|--------|-----------|------|
| **フレームワーク** | AWS Chalice | Python Lambda マイクロフレームワーク |
| **言語** | Python 3.13 | 型ヒント対応 |
| **ORM** | SQLAlchemy + psycopg2 | PostgreSQL オブジェクトマッピング |
| **認証** | PyJWT + google-auth | JWT + Googleトークン検証 |
| **デプロイ** | AWS Lambda + API Gateway | サーバーレスコンピューティング |
| **CORS** | Chalice CORS | クロスドメインリクエスト処理 |

### データベース

| コンポーネント | テクノロジー |
|------------|-----------|
| **DBMS** | PostgreSQL 15+ |
| **ORM** | SQLAlchemy 2.0 |
| **コネクションプール** | SQLAlchemy QueuePool |
| **インデックス** | B-tree on users.email, posts.user_id, comments.post_id |

---

## 🚀 クイックスタート

### 前提条件

- **Node.js** v22.20.0 以上
- **Python** 3.13 以上
- **PostgreSQL** 15 以上（ローカルまたはAWS RDS）
- **Google OAuth 2.0** 認証情報 ([Google Cloud Console](https://console.cloud.google.com))

### ローカル開発環境セットアップ

**詳細なセットアップ手順については、[`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md)を参照してください。**

#### 1️⃣ リポジトリをクローン

```bash
git clone https://github.com/salieri009/ToyProject-Gundam.git
cd ToyProject-Gundam
```

#### 2️⃣ バックエンドのセットアップと実行

```bash
# バックエンドフォルダに移動
cd backend

# 仮想環境を作成
python -m venv venv

# 有効化（Windows PowerShell）
.\venv\Scripts\Activate

# または（Windows CMD/Git Bash）
# venv\Scripts\activate

# 依存パッケージをインストール
pip install -r requirements.txt

# 環境変数を設定
# .envファイルを作成（参考: .env.example）
# DATABASE_URL、JWT_SECRET、GOOGLE_CLIENT_IDを追加

# ローカル開発サーバーを開始（ポート8000）
chalice local --port 8000
```

#### 3️⃣ フロントエンドのセットアップと実行

```bash
# プロジェクトルートに戻る
cd ../frontend

# 依存パッケージをインストール
npm install

# 環境変数を設定
# .env.localファイルを作成（参考: .env.local.example）
# NEXT_PUBLIC_API_URL、NEXT_PUBLIC_GOOGLE_CLIENT_IDを追加

# 開発サーバーを開始（ポート5173）
npm run dev
```

#### 4️⃣ ブラウザでアクセス

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:8000

---

## 📚 ドキュメント

| ドキュメント | 説明 |
|-----------|------|
| [`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md) | ローカル開発環境の完全セットアップガイド（PostgreSQL、環境変数、Google OAuth） |
| [`docs/01_API_Design.md`](docs/01_API_Design.md) | REST APIエンドポイント仕様（リクエスト/レスポンススキーマ） |
| [`docs/02_Database_Design.md`](docs/02_Database_Design.md) | PostgreSQLスキーマ、SQLAlchemyモデル、インデックス戦略 |
| [`docs/03_Frontend_Architecture.md`](docs/03_Frontend_Architecture.md) | Next.jsフォルダ構造、コンポーネント設計、状態管理 |
| [`docs/04_Backend_Architecture.md`](docs/04_Backend_Architecture.md) | Chalice構造、ルーティング、認証ミドルウェア |
| [`docs/05_UI_UX_Design.md`](docs/05_UI_UX_Design.md) | レトロ80年代CRTテーマ、ニキシー管デザイン、CSS効果 |

---

## ✨ 機能

### 🔐 認証と認可

- ✅ **Google OAuth 2.0** ログイン/ログアウト
- ✅ **JWTトークン**（24時間有効）
- ✅ **リフレッシュトークン**（7日有効、自動更新）
- ✅ **ロールベースアクセス制御**（所有者のみが編集/削除可能）

### 📝 投稿管理

- ✅ **作成**: 新しい投稿（タイトル + 内容）
- ✅ **読取**: 投稿リスト（ページネーション）& 詳細表示
- ✅ **更新**: 自分の投稿を編集
- ✅ **削除**: 自分の投稿を削除

### 💬 コメントシステム

- ✅ **ネストされたコメント**（1レベルの深さ）
- ✅ **コメントの作成/編集/削除**
- ✅ **親コメントベースの階層構造**

---

## 🧪 テストとデプロイ

### ローカルテスト

```bash
# バックエンドユニットテスト（例）
cd backend && pytest tests/

# フロントエンドコンポーネントテスト（例）
cd ../frontend && npm run test
```

### AWSへのデプロイ

```bash
cd backend

# 開発ステージにデプロイ
chalice deploy --stage dev

# 本番ステージにデプロイ
chalice deploy --stage prod

# デプロイステータスを確認
chalice status --stage dev
```

詳細なデプロイガイドについては、[`docs/LOCAL_SETUP_GUIDE.md`](docs/LOCAL_SETUP_GUIDE.md#-aws-デプロイ準備)を参照してください。

---

## 📖 参考資料

### アーキテクチャとパターン

- 🔗 [AWS Chalice ドキュメント](https://aws.github.io/chalice/latest/)
- 🔗 [Next.js 14 App Router](https://nextjs.org/docs/app)
- 🔗 [SQLAlchemy 2.0 ORM](https://docs.sqlalchemy.org/en/20/)
- 🔗 [JWT ベストプラクティス](https://tools.ietf.org/html/rfc7519)

### 学習リソース

- 📖 **Building Microservices** - Sam Newman（マイクロサービス設計原則）
- 📖 **RESTful Web API Design** - Leonard Richardson（REST API設計）
- 📖 **PostgreSQL 公式ドキュメント** - [postgresql.org](https://www.postgresql.org/docs/)

### 関連プロジェクト

- 🔗 [EventualShop](https://github.com/AntonioFalcaoJr/EventualShop) - イベントソーシング + CQRSパターン
- 🔗 [Gundam Wiki](https://en.gundam.info/en/) - ガンダム宇宙世紀背景知識

---

## 🤝 貢献

このプロジェクトに貢献するには:

1. このリポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/AmazingFeature`）
3. 変更をコミット（`git commit -m 'Add AmazingFeature'`）
4. ブランチにプッシュ（`git push origin feature/AmazingFeature`）
5. プルリクエストを開く

---

## 📋 バージョニング

このプロジェクトは[セマンティックバージョニング](https://semver.org/lang/ja/)に従っています。

リリース履歴は[リリース](https://github.com/salieri009/ToyProject-Gundam/releases)を参照してください。

---

## 👤 著者

**Salieri (salieri009)**

- GitHub: [@salieri009](https://github.com/salieri009)
- プロジェクト: [GUNDAM UNIVERSE BOARD](https://github.com/salieri009/ToyProject-Gundam)

---

## 📜 ライセンス

このプロジェクトは**MITライセンス**の下でライセンスされています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

---

<div align="center">

**❤️ Salieri による作成 | AI支援開発（Cursor）**

*ガンダム宇宙世紀にインスパイアされた次世代コミュニティプラットフォーム*

</div>
