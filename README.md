# DartsChart (ダーツチャート)

[![IMAGE ALT TEXT HERE](https://user-images.githubusercontent.com/73517450/139520734-a81d1d0c-5807-48ab-8bca-fa93eb0ca9b2.png)](https://youtu.be/rShKgHzKbX4)

# 製品概要
**Darts x Tech**<br/>
誰でも手軽に家でダーツを始められ, 高額な機器よりも高機能なサービスを提供する, 本格分析ダーツアプリケーション.

## 背景(製品開発のきっかけ、課題等）
私たちはダーツというスポーツにかねてから憧れがありました。
あのスタイリッシュなフォームで矢で的を射抜く姿を、男子であれば一度は夢を見ると思います。
しかし、ダーツバーはまさに【大人の社交場】。
まだまだ青臭い僕たちには、ダーツバーに挑むことは非常に高いハードルに感じました。
特にコロナ禍では、お店の営業制限や外出自粛で家で過ごす時間が多く、ダーツへの熱い想いはただただ積もるばかりでした。

特に，市販のダーツ盤は次の2種類存在します，

1. 点数の計算を行える高機能かつ高額なもの（3万円~）
2. ダーツが刺さるだけで得点計算はできない（5000円前後）

また，既存のスコアリング機能のあるダーツ版においても，取得できる情報は刺さった矢が何点かということで，細かい位置を検出できません，
これらにより次のような課題が挙げられます


## 課題

1. **対戦機能やスコアリング機能のあるものは価格が高く導入のハードルが高い**
2. **初心者の頃は矢の集弾率が上がってもブルには入らないため点数が増えず上達を実感しにくい**

そこで、私たちはスマホカメラでプレイを撮影することで、例え安い特典機能のないダーツ盤であっても、
ダーツバーなどにある自動でスコア計算する高級機体以上の性能を発揮できるアプリケーションを開発しました。
さらに高度な分析機能を実現することにより初心者の上達をサポートします。

## 目的

### 1. **導入コストを下げることで誰でも家で手軽にダーツを楽しめるようにすること**
### 2. **独自の画像処理システムやAI技術を用いて、動画からダーツの軌道や投擲フォームを可視化**


# 製品説明（具体的な製品の説明）

## 特長
### 1. 家で手軽にダーツが遊べるスマホアプリ
### 2. 独自技術：画像処理による矢の投擲と位置の検出
### 3. 矢の軌道や投擲フォームによる分析により上達をサポート

## 結局何が嬉しいの？

| |  既存ダーツ盤  |  DartsChart  |
| 価格|  ¥30000~  |  ¥3000~  |
| 情報量 | ---- | ---- |
|スコア| ✅ | ✅ |
|刺さった位置| ❌ | ✅ |
|軌跡の表示| ❌ | ✅ |
|フォームの分析| ❌ | ✅ |
|オンライン対戦| ✅ | 🔺 |

🔺: Future Work


## 解決出来ること
本アプリはAIや画像処理技術を用いて, 手軽ながらも高級機器と同等以上の利便性を有するダーツ体験を提供し, 既存のダーツ機器では達成不可能なレベルの投擲分析システムを有する. 流通している市販のダーツ機器はそれらの設置コストに対して得られる情報が非常に限られており, スコアの自動計算程度の機能であっても高価なダーツ機器にしか実装されておらず, そのような専用機器がある場所で練習することが一般的であった. 昨今のコロナ禍ではそのような外出はしにくく, 設置コストの問題から自宅にダーツの練習環境を作ることも困難である. 本アプリケーションはこれらの問題を解決し, 自宅でも本格的なダーツ体験や高級な分析ができる環境を手軽に導入することができる.　必要なものはスマートフォン一台だけ. それさえあれば, 安価なダーツ盤であっても, 投擲位置やスコアの自動算出が可能になる. さらに, 現在流通している市販のダーツ機器では到底取得不可能な「矢の投擲軌道」や「プレイヤーの投擲フォーム」の情報を取得することができる. これによってこれまでにない良質なダーツ体験を手軽にプレイヤーに提供することができる.

## 注力したこと（こだわり等）
* 既存の手法ではできなかったスマホ一台での詳細な盤面検知を達成．
* スマホのカメラ機能を用いて自分の投擲フォーム・ダーツの軌道・投擲状態の情報などを簡単に可視化, 定量化できるシステムを構築．

# 開発技術
## 活用した技術
* Firebase
* 動画から骨格推定を行うアルゴリズム
* 射影変換等の画像処理アルゴリズム

## フレームワーク・ライブラリ・モジュール
* React Native
* Expo
* Flask
* OpenCV
* MediaPipe
* Scikit-Learn

### デバイス
* ios
* Android

## 独自技術
### ハッカソンで開発した独自機能・技術
* 画像の差分からダーツを投げたタイミングや的に命中した位置を特定する独自の画像処理システム
* 動画から矢の軌道・向きを特定し, プレイヤーの投擲フォームを定量化・可視化するシステム
* https://colab.research.google.com/drive/19AMq7MwhBRN7Xm8rr_IQa3Smur2G2ziR?usp=sharing
* https://youtu.be/rShKgHzKbX4


# 今後の展望
* オンライン対戦機能
* 他スポーツへの利用
* 蓄積した分析データに基づく定量的なフォームの改善提案


### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
* 
