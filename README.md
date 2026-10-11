# DS Harness Piログイン

Pi対応プロバイダーのログインとモデル選択をDeepSeek Harnessに追加します。Pi SDKはプラグイン側で更新します。

対応版：DS Harness `0.2.1-alpha.2`。SDK：`@earendil-works/pi-ai` `1.1.0`。

## 導入

サイドバーの「Plugins → Add plugin」を開き、次のURLを入力します。

```text
https://github.com/Aero123421/dsh-pi-login/releases/download/v0.2.1/local-dsh-pi-login-0.2.1.tgz
```

「Install」→「Enable now」を押し、アプリを再起動します。[配布ファイルとチェックサム](https://github.com/Aero123421/dsh-pi-login/releases/tag/v0.2.1)はGitHub Releasesにあります。

WebプロファイルではCLIからも追加できます。

```sh
dsh plugin --profile web add https://github.com/Aero123421/dsh-pi-login/releases/download/v0.2.1/local-dsh-pi-login-0.2.1.tgz
```

## 使い方

「設定 → モデル」のPi接続欄で、プロバイダーとログイン方法を選びます。認証を終えたら「プロバイダーを有効にする」を押し、「モデルを選ぶ」で使うモデルをオンにします。

プロバイダーが有効なとき、オンにしたモデルをチャットやエージェントで使えます。モデルをオフにすると一覧と実行対象から外れます。プロバイダーをオフにしても認証情報とモデルの選択は残ります。

`apiKeyEnv`で指定したAPIキーはログイン認証より優先されます。切り替えるには、認証後に表示される「保存済みの認証を使う」を選びます。

## 既存の設定

組み込みのPiアダプターを停止し、このプラグインのアダプターを使います。初回起動で既存の設定をコピーし、保存済みの認証情報を引き継ぎます。システムプロンプトは変更しません。

アンインストールして再起動すると組み込みアダプターに戻ります。元の設定が使われるため、このプラグインで変更したON/OFFは反映されません。

## 更新と検証

新しいモデルへの対応にはプラグインの更新が必要です。ログインし直すだけではSDKのモデル一覧は更新されません。SDK更新後に追加されたモデルは、設定でモデル一覧を限定していなければ有効になります。以前オフにしたモデルはオフのままです。

テストには公式ソース、Pi SDK、モック認証、ローカルの生成サーバーを使っています。実アカウントのOAuth、実プロバイダーへの生成リクエスト、公式デスクトップへのインストール、Windows・macOS実機は未検証です。

[開発・テスト・更新手順](docs/development.md) · [元アダプターと変更点](src/runtime/UPSTREAM.md)

コードは[MIT](LICENSE)です。DeepSeekの著作権表示を保持しています。
