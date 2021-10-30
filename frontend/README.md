# 使い方

1. `cd /path/to/frontend`
2. Docker Desktop 起動
3. 初回のみ`echo "EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0" > .env`（.envファイルに環境変数を書き込む）
3. `docker-compose up`
4. 0.0.0.0:19002 にアクセスして`Tunnel`にする．
5. QRを読み取る
6. `control + C`とかで終了