# Docker を立ち上げたら

1. `Docker Desktop`の`LOGS`を確認してinstallが終わるのを待つ
2. `yarn start --tunnel`で実行
3. 初回`The package @expo/ngrok@^4.1.0 is required to use tunnels, would you like to install it globally?`って聞かれると思うので`Y`でいいかもしれない．（`n`で動かす方法がない?）
3. chromeとかで`0.0.0.0:19002`にアクセス
4. スマホでQRを読み取る
5. `Javascript`のコンパイルが終わるまで待機