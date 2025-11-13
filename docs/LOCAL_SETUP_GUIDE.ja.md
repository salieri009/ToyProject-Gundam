# 🚀 ローカル開発環境セットアップガイド

このドキュメントは、**Gundam Universe Board**プロジェクトをローカル環境で開発するための詳細なセットアップガイドです。

> **注意**: このガイドはコミット可能な状態で設計されています。機密情報（パスワード、APIキーなど）を直接このファイルに含めないでください。代わりに環境変数を使用してください。

---

## 📋 目次

1. [前提条件](#1-前提条件)
2. [PostgreSQLのインストールとセットアップ](#2-postgresqlのインストールとセットアップ)
3. [バックエンドのセットアップ](#3-バックエンドのセットアップ)
4. [フロントエンドのセットアップ](#4-フロントエンドのセットアップ)
5. [Google OAuthのセットアップ](#5-google-oauthのセットアップ)
6. [ローカル実行](#6-ローカル実行)
7. [トラブルシューティング](#7-トラブルシューティング)
8. [AWSデプロイメント準備](#8-awsデプロイメント準備)

---

## 1. 前提条件

### インストール確認

以下のソフトウェアがインストールされていることを確認してください：

- ✅ **Python 3.13.8** (現在インストール済み)
- ✅ **Node.js v22.20.0** (現在インストール済み)
- ⬜ **PostgreSQL 15+** (以下でインストール)
- ⬜ **Git**

### バージョン確認コマンド

```powershell
# Pythonバージョン確認
python --version

# Node.jsバージョン確認
node --version

# npmバージョン確認
npm --version

# PostgreSQLバージョン確認（インストール後）
psql --version
```

---

## 2. PostgreSQLのインストールとセットアップ

### 2.1 PostgreSQLのインストール（Windows）

#### 方法1: 公式インストーラー

1. **ダウンロード**
   - [PostgreSQL公式サイト](https://www.postgresql.org/download/windows/)からインストーラーをダウンロード
   - または[EnterpriseDBインストーラー](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)をダウンロード

2. **インストール手順**
   - インストーラーを実行
   - インストールパス: デフォルトを使用（例: `C:\Program Files\PostgreSQL\15`）
   - コンポーネント選択: **すべてチェック**（PostgreSQL Server、pgAdmin 4、Command Line Tools）
   - ポート: **5432**（デフォルト）
   - スーパーユーザー（postgres）パスワード: **希望のパスワードを設定**（必ず覚えておいてください！）

3. **環境変数の確認**
   - インストール後、`psql`コマンドが動作しない場合はPATHに追加：
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```

#### 方法2: Chocolateyでインストール（推奨）

```powershell
# Chocolateyがインストールされている場合
choco install postgresql15 -y

# または最新バージョン
choco install postgresql -y
```

### 2.2 PostgreSQLサービスの開始

```powershell
# WindowsサービスでPostgreSQLの開始を確認
# またはコマンドで開始
net start postgresql-x64-15
```

### 2.3 データベースの作成

```powershell
# PostgreSQLに接続（パスワード入力が必要）
psql -U postgres

# PostgreSQLプロンプトで以下のコマンドを実行：
```

```sql
-- プロジェクト用データベースを作成
CREATE DATABASE gundam_board;

-- データベース一覧を確認
\l

-- 作成したデータベースに接続
\c gundam_board

-- 終了
\q
```

### 2.4 接続情報の記録

インストール後、以下の情報を記録してください（後で`.env`ファイルで使用）：

```
Host: localhost
Port: 5432
Database: gundam_board
Username: postgres
Password: [インストール時に設定したパスワード]
```

---

## 3. バックエンドのセットアップ

### 3.1 ディレクトリに移動

```powershell
cd D:\UTS\ToyProject\ToyProject-Gundam\backend
```

### 3.2 Python仮想環境の作成と有効化

```powershell
# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化（PowerShell）
.\venv\Scripts\Activate.ps1

# 仮想環境を有効化（CMD）
.\venv\Scripts\activate.bat
```

> **注意**: PowerShellでスクリプト実行エラーが発生した場合：
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 3.3 Pythonパッケージのインストール

```powershell
# 依存関係をインストール
pip install -r requirements.txt

# インストールを確認
pip list
```

### 3.4 環境変数の設定

```powershell
# .env.exampleをコピーして.envファイルを作成
copy .env.example .env

# テキストエディタで.envファイルを開く
notepad .env
```

**`.env`ファイルの内容を記述：**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/gundam_board

# JWT Configuration
JWT_SECRET=gundam-super-secret-key-2024-change-me-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION=86400

# Google OAuth Configuration（以下のステップ5で設定）
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application Configuration
STAGE=dev
DEBUG=True
```

> ⚠️ **重要**: 
> - `[YOUR_PASSWORD]`をPostgreSQLインストール時に設定したパスワードに置き換えてください
> - `JWT_SECRET`はランダムな文字列に変更することをお勧めします
> - Google OAuth情報はステップ5で設定します

### 3.5 データベーステーブルの作成

```powershell
# Pythonインタープリターを実行
python

# Pythonプロンプトで：
```

```python
from chalicelib.database import init_db
init_db()
print("Database initialized successfully!")
exit()
```

---

## 4. フロントエンドのセットアップ

### 4.1 ディレクトリに移動

```powershell
# 新しいターミナルを開く（バックエンドは引き続き実行中）
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend
```

### 4.2 Node.jsパッケージのインストール

```powershell
# 依存関係をインストール
npm install

# インストールを確認
npm list --depth=0
```

### 4.3 環境変数の設定

```powershell
# .env.local.exampleをコピーして.env.localファイルを作成
copy .env.local.example .env.local

# テキストエディタで.env.localファイルを開く
notepad .env.local
```

**`.env.local`ファイルの内容を記述：**

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google OAuth Configuration（以下のステップ5で設定）
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=Gundam Universe Board
NEXT_PUBLIC_APP_VERSION=1.0.0
```

> ⚠️ **重要**: Google OAuth Client IDはステップ5で設定します

---

## 5. Google OAuthのセットアップ

### 5.1 Google Cloud Consoleにアクセス

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. Googleアカウントでログイン

### 5.2 新しいプロジェクトの作成

1. 上部の**プロジェクト選択**ドロップダウンをクリック
2. **新しいプロジェクト**をクリック
3. プロジェクト名: `Gundam Universe Board`（または希望の名前）
4. **作成**をクリック
5. プロジェクトが作成されたら、そのプロジェクトを選択

### 5.3 OAuth同意画面の構成

1. 左メニューから**APIとサービス** > **OAuth同意画面**をクリック
2. ユーザータイプ: **外部**を選択して**作成**
3. アプリ情報を入力：
   - アプリ名: `Gundam Universe Board`
   - ユーザーサポートメール: 自分のメール
   - 開発者連絡先情報: 自分のメール
4. **保存して続行**をクリック
5. スコープ: デフォルトのまま**保存して続行**
6. テストユーザー: 自分のメールを追加して**保存して続行**
7. **ダッシュボードに戻る**をクリック

### 5.4 OAuth 2.0 Client IDの作成

1. 左メニューから**APIとサービス** > **認証情報**をクリック
2. 上部の**+ 認証情報を作成** > **OAuthクライアントID**をクリック
3. アプリケーションタイプ: **ウェブアプリケーション**を選択
4. 名前: `Gundam Board Web Client`
5. **承認済みのJavaScript生成元**を追加：
   ```
   http://localhost:3000
   http://localhost:8000
   ```
6. **承認済みのリダイレクトURI**を追加：
   ```
   http://localhost:3000/auth
   ```
7. **作成**をクリック

### 5.5 Client IDとSecretの保存

生成された情報をコピーして保存：

- **クライアントID**: `123456789-abcdef.apps.googleusercontent.com`（例）
- **クライアントシークレット**: `GOCSPX-abc123def456`（例）

### 5.6 環境変数に適用

**バックエンド`.env`ファイルを更新：**

```env
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

**フロントエンド`.env.local`ファイルを更新：**

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
```

---

## 6. ローカル実行

### 6.1 バックエンドの実行

```powershell
# backendディレクトリで
cd D:\UTS\ToyProject\ToyProject-Gundam\backend

# 仮想環境を有効化（まだ有効化していない場合）
.\venv\Scripts\Activate.ps1

# Chaliceローカルサーバーを実行
chalice local --port 8000
```

**実行確認：**
- ブラウザで`http://localhost:8000/health`にアクセス
- `{"status": "healthy"}`という応答が表示されれば成功！

### 6.2 フロントエンドの実行

```powershell
# 新しいターミナルでfrontendディレクトリに移動
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend

# 開発サーバーを実行
npm run dev
```

**実行確認：**
- ブラウザで`http://localhost:3000`にアクセス
- メインページが表示されれば成功！

### 6.3 Googleログインのテスト

1. `http://localhost:3000/auth`ページにアクセス
2. **Google Login**ボタンをクリック
3. Googleアカウントを選択してログイン
4. ログイン成功時、`/posts`ページにリダイレクト

---

## 7. トラブルシューティング

### 7.1 PostgreSQL接続エラー

**症状：**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**解決方法：**
1. PostgreSQLサービスが実行中か確認：
   ```powershell
   # サービス状態を確認
   Get-Service postgresql-x64-15
   
   # サービスを開始
   net start postgresql-x64-15
   ```

2. `.env`ファイルのDATABASE_URLを確認：
   - パスワードに特殊文字が含まれている場合、URLエンコーディングが必要
   - 例: `@` → `%40`、`#` → `%23`

3. PostgreSQL接続をテスト：
   ```powershell
   psql -U postgres -d gundam_board
   ```

### 7.2 Pythonパッケージインストールエラー

**症状：**
```
error: Microsoft Visual C++ 14.0 or greater is required
```

**解決方法：**
1. [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)をインストール
2. またはpsycopg2-binaryを使用（すでにrequirements.txtに含まれています）

### 7.3 Chalice実行エラー

**症状：**
```
ImportError: No module named chalice
```

**解決方法：**
```powershell
# 仮想環境が有効化されているか確認
# プロンプトに(venv)が表示されている必要があります

# 仮想環境を有効化
.\venv\Scripts\Activate.ps1

# chaliceを再インストール
pip install chalice
```

### 7.4 Google OAuthエラー

**症状：**
```
Error 400: redirect_uri_mismatch
```

**解決方法：**
1. Google Cloud Consoleで承認済みリダイレクトURIを確認
2. `http://localhost:3000/auth`が正確に入力されているか確認
3. フロントエンドとバックエンドの両方でlocalhostを使用しているか確認

### 7.5 CORSエラー

**症状：**
```
Access to XMLHttpRequest blocked by CORS policy
```

**解決方法：**
1. バックエンド`config.py`のCORS_HEADERSを確認
2. フロントエンド`.env.local`のAPI URLを確認
3. バックエンドを再起動

### 7.6 ポート競合エラー

**症状：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解決方法：**
```powershell
# ポートを使用しているプロセスを検索
netstat -ano | findstr :3000

# プロセスを終了（PID確認後）
taskkill /PID [プロセスID] /F

# または別のポートを使用
npm run dev -- -p 3001
```

---

## 8. AWSデプロイメント準備

### 8.1 AWS CLIのインストール

```powershell
# Chocolateyでインストール
choco install awscli -y

# またはMSIインストーラー
# https://aws.amazon.com/cli/
```

### 8.2 AWS認証情報の設定

```powershell
# AWS Configureを実行
aws configure

# 情報を入力：
# AWS Access Key ID: [YOUR_ACCESS_KEY]
# AWS Secret Access Key: [YOUR_SECRET_KEY]
# Default region name: ap-northeast-2（ソウル）
# Default output format: json
```

### 8.3 Chaliceデプロイメント設定の確認

`backend/.chalice/config.json`ファイルはすでに作成されています。

デプロイ前に環境変数を設定：

```json
{
  "stages": {
    "dev": {
      "environment_variables": {
        "DATABASE_URL": "postgresql://username:password@your-rds-endpoint/gundam_board",
        "JWT_SECRET": "your-production-jwt-secret",
        "GOOGLE_CLIENT_ID": "your-client-id",
        "GOOGLE_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### 8.4 AWS RDS PostgreSQLの作成（デプロイ時）

1. AWS Console > RDS > データベースの作成
2. エンジン: PostgreSQL
3. テンプレート: 無料枠（テスト用）
4. DBインスタンス識別子: `gundam-board-db`
5. マスターユーザー名: `postgres`
6. マスターパスワード: 強力なパスワードを設定
7. パブリックアクセス: はい（開発段階）
8. VPCセキュリティグループ: 新規作成（ポート5432を許可）

### 8.5 バックエンドデプロイメントコマンド

```powershell
cd backend

# 開発環境にデプロイ
chalice deploy --stage dev

# 本番環境にデプロイ
chalice deploy --stage prod
```

デプロイ後、API Gateway URLをフロントエンド`.env.production`に設定：

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/api
```

### 8.6 フロントエンドデプロイメント（Vercel推奨）

```powershell
# Vercel CLIをインストール
npm i -g vercel

# ログイン
vercel login

# デプロイ
cd frontend
vercel

# 本番デプロイ
vercel --prod
```

---

## 9. 開発ワークフロー

### 日次開発開始

```powershell
# 1. PostgreSQLサービスを確認
Get-Service postgresql-x64-15

# 2. バックエンドを実行（ターミナル1）
cd D:\UTS\ToyProject\ToyProject-Gundam\backend
.\venv\Scripts\Activate.ps1
chalice local --port 8000

# 3. フロントエンドを実行（ターミナル2）
cd D:\UTS\ToyProject\ToyProject-Gundam\frontend
npm run dev
```

### コード変更時

- **バックエンド**: Chaliceが自動的にリロード
- **フロントエンド**: Next.jsが自動的にリロード
- **データベーススキーマ変更**: `init_db()`を再実行

### Gitコミット前チェックリスト

- [ ] `.env`ファイルがコミットされていないことを確認
- [ ] `node_modules/`、`venv/`が除外されていることを確認
- [ ] 機密情報（パスワード、APIキー）を削除
- [ ] テストを実行して合格を確認

---

## 10. 参考資料

### 公式ドキュメント

- [Chalice Documentation](https://aws.github.io/chalice/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

### プロジェクトドキュメント

- `01_API_Design.md` - API仕様
- `02_Database_Design.md` - データベース設計
- `03_Frontend_Architecture.md` - フロントエンド構造
- `04_Backend_Architecture.md` - バックエンド構造
- `05_UI_UX_Design.md` - UI/UXデザイン

---

## 🎉 セットアップ完了！

すべてのセットアップが完了しました！これで以下を実行できます：

1. ✅ ローカルでバックエンドAPIサーバーを実行
2. ✅ ローカルでフロントエンド開発サーバーを実行
3. ✅ Google OAuthログイン
4. ✅ 投稿CRUD機能
5. ✅ コメントCRUD機能

問題が発生した場合は、上記の**トラブルシューティング**セクションを参照するか、プロジェクトドキュメントを確認してください。

**Happy Coding! 🚀**

