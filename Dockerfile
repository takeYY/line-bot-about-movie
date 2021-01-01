FROM node:12

# アプリケーションディレクトリを作成する
WORKDIR /app
# Dockerfileが置かれているディレクトリ以下をコピー
ADD . /app

RUN npm install
# 本番用にコードを作成している場合
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
COPY . .
