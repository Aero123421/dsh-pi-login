# 0.7.0

Meta Muse Codeのモデルを、DSHのチャット・エージェントのモデル選択から使えるようにしました。

## 0.6.xからの更新

CLI経由で作成したMuse Code接続は再ログインが必要です。更新してDSHを再起動した後、「AI接続」のMuse Code接続でログインし、「モデル」から一覧を読み込んでください。旧版の専用MSPセッション経路をPi SDK経路へ置き換えたため、公式muse CLIは不要になりました。他の接続の認証方式は変更していません。

## 変更

- Muse Codeのログイン、APIキー発行・自動更新、生成をPi SDKのMetaプロバイダーに対応付け、接続専用の認証情報を使ってDSHのLLM routeへ登録します。
- Muse Code専用の `/muse-code/models` から通常モードとContributorモードのモデル一覧を取得します。一覧は接続に保存し、再起動後も使えます。複製した接続には認証情報とアカウントのモデル一覧を引き継ぎません。
- 通常版とContributor版を個別のスイッチで選べます。Contributor版は最初はオフです。Contributor選択では `x-tbh-contributor-mode: 1`、通常選択では `0` を送り、APIへは元のモデルIDを送ります。Contributorモードの内容はMetaの学習に利用され得るため、画面に利用条件の案内を表示します。
- ログイン直後、モデル画面を開いたとき、「モデル一覧を更新」でアカウントの一覧を取得します。一覧が空のときは読み込みの案内を表示します。
- キー発行の応答に含まれる契約・利用枠を表示します。
- 公式CLI・MSP用の部品と `@muse-code/sdk` 依存を削除しました。

## 検証と範囲

PR #24のGitHub Actionsでは、ビルド済みファイルの再現性、単体テスト147件、公式Hostとの互換性、runtime、Chromiumの390/768/1440px・light/dark、配布パッケージ、実DSH 0.2.1-alpha.2への空profile導入・再起動・接続CRUD・公開Release照合が成功しています。Release workflowでも同じ検証を実行してから配布ファイルとSHA256SUMSを公開します。

Muse Codeのruntime検証は、実Pi SDKとローカル応答fixtureで、両モードの一覧取得・保存、Hostへのroute登録、モデル表示、送信モデルIDとContributorヘッダーを確認します。実アカウントでのログイン完了、Wonder/Full生成、Contributor利用枠・課金を検証したものではありません。PRでは実DSHからMetaのログイン開始と端末コード取得まで確認されています。一覧の応答形式とContributorヘッダーは公式CLI 1.4.7の実装に基づき、公開API仕様ではありません。

変更元: https://github.com/Aero123421/dsh-pi-login/pull/24
