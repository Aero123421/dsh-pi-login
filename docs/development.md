# 開発・テスト・更新

[upstream.json](../upstream.json)に検証する公式コミットを固定しています。初回のビルドでソースを`.cache/upstream`に取得します。メニュー、スイッチ、入力欄、モーダルはこのソースから取り込み、ReactはHostと共有します。

## テスト

ソースからビルドするにはNode.js 22.19.0以上が必要です。

```sh
npm ci
npm run build
npm test
npm run test:compat
npm run test:runtime
npx playwright install chromium
npm run test:browser
npm run pack:plugin
```

| コマンド | 確認する内容 |
| --- | --- |
| `test` | ログインの入力・終了・有効期限、設定保存・再取得時の競合、日本語と英語の文言、配布用Client |
| `test:compat` | 公式のCordis・Authorization・Credentials・Connectionによる認証保存と解除 |
| `test:runtime` | 実SDKのモデル解決・認証保存・Device Codeの有効期限通知、ローカルサーバーへの生成、設定の取り込みとON/OFF |
| `test:browser` | ログイン画面、終了理由、再接続中の再取得、認証・Originチェック、モデル選択、明暗テーマ、狭い画面、プラグイン解除 |

runtimeテストの設定保存先とLLM登録先はテスト用サービスです。ブラウザテストは日本語を登録したテスト画面で行い、日本語プラグインやフォントは読み込みません。実アカウントは使用しません。

GitHub Actionsにも同じチェックを設定しています（`.github/workflows/ci.yml`）。配布ファイル、チェックサム、スクリーンショットは`artifacts`に出力します。

## 設定と認証

プラグイン設定は`dsh-pi-login`、既存の認証情報は`llm-pi-ai/<provider>`に保存します。OpenAI OAuthのインストールIDは`dsh-pi-login/installation`に保存します。本体の標準フォームはこの設定名前空間に未対応なので、設定画面に追加した操作欄を使います。

トークン更新はPi SDK、保存はDSのCredentialsサービスが担当します。ログインはAuthorization APIと認証済みConnectionを経由します。認証情報をlocalStorage・ログ・共有イベントには保存しません。認証URL・コード・入力待ちは操作ごとのチケットで扱い、キャンセルやプラグイン解除で破棄します。

ログインの待機時間は通常10分です。Device CodeはSDK通知の有効期限にトークン交換用の1分を加え、通常の待機時間より長ければ延長します。SDK側の期限切れ、プラグイン側の待機時間超過、手動キャンセルは別の終了理由として表示します。

## Pi SDKの更新

```sh
npm run update:pi
# バージョンを指定する場合
npm run update:pi -- 1.1.0
```

このコマンドはSDKを指定版、またはnpmの`latest`版に固定し、プラグインのパッチ版を上げます。同じSDK版なら変更しません。Dependabotには週1回の更新確認を設定しています（`.github/dependabot.yml`）。

更新後にビルドとテストを実行し、新しい配布ファイルを作ります。利用者はプラグインを更新してアプリを再起動します。実行中にSDKをダウンロードして切り替える処理はありません。

## DSの公式版への更新

1. `upstream.json`のコミットとバージョンを変更し、古い`.cache/upstream`を退避します。
2. `src/runtime`と[元アダプター](../src/runtime/UPSTREAM.md)を比較します。
3. HostのpeerDependencies、UI部品、認証・LLM APIの互換性を確認し、ビルドとテストを実行します。
