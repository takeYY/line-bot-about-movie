FROM node:12

# アプリケーションディレクトリを作成する
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Dockerfileが置かれているディレクトリ以下をコピー
ADD . /usr/src/app

# アプリケーションの依存関係をインストールする
COPY package.json /usr/src/app
RUN npm install
# 本番用にコードを作成している場合
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
COPY . /usr/src/app
