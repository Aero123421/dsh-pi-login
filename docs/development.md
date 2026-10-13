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
| `test` | ログインの入力・終了・有効期限、設定保存・再取得時の競合、Meta Museの推論強度、Fastモデルの対応判定とSDK送信・料金計算、日本語と英語の文言、配布用Client |
| `test:compat` | 公式のCordis・Authorization・Credentials・Connectionによる認証保存と解除 |
| `test:runtime` | 実SDKのモデル解決・認証保存・Device Codeの有効期限通知、ローカルサーバーへの生成、Fastモデルの履歴再利用・設定変更中の呼び出し・拒否時の動作、設定の取り込みとON/OFF |
| `test:browser` | ログイン画面、終了理由、再接続中の再取得、認証・Originチェック、モデル選択、明暗テーマ、狭い画面、プラグイン解除 |

モデル一覧更新の共通処理は単体テストで、Meta以外への委譲、未対応・不正なプロバイダーの拒否、同時更新の共有、破棄時の終了、公開する情報を確認します。Muse契約の再取得は単体テストで、OAuthとAPIキーの分離、契約状態、応答上限、取得失敗、アカウント変更を確認します。runtimeテストでは認証済みRPCからFullを選択し、実SDKによるリクエストとテスト用SSE応答を確認します。ブラウザテストでは共通の更新ボタンによるMetaと別のテスト用プロバイダーの再取得・モデル選択、未対応の案内、契約名・Full選択・APIキー優先時のエラーを確認します。いずれも実Metaアカウントや有料生成を使いません。[実アカウントで確認する項目](models.md#検証範囲と残る確認)

環境にChromiumがある場合は`DSH_TEST_CHROMIUM=/usr/bin/chromium npm run test:browser`を使えます。画面証拠をチェックアウト外に保存する場合は`DSH_TEST_ARTIFACT_DIR=/tmp/dsh-ui-evidence`を指定します。

runtimeテストの設定保存先とLLM登録先はテスト用サービスです。ブラウザテストは日本語を登録したテスト画面で行い、日本語プラグインやフォントは読み込みません。実アカウントは使用しません。

GitHub Actionsにも同じチェックを設定しています（`.github/workflows/ci.yml`）。配布ファイル、チェックサム、スクリーンショットは`artifacts`に出力します。

## GitHubからの配布

`main`にはビルド済みの`dist/`を含めます。変更後に`npm run build`を実行し、更新した`dist/`も一緒にコミットしてください。CIで再ビルドし、コミット済みのファイルとの差分が残ると失敗します。インストール時に実行するビルド用スクリプトは追加しません。

版を上げるときは`package.json`、`package-lock.json`、READMEのReleaseリンクを更新し、ビルドと検証を行います。GitHub Releasesにも`npm run pack:plugin`で作った配布ファイルと`SHA256SUMS`を置きます。

## 設定と認証

プラグイン設定は`dsh-pi-login`、既存の認証情報は`llm-pi-ai/<provider>`に保存します。OpenAI OAuthのインストールIDは`dsh-pi-login/installation`に保存します。本体の標準フォームはこの設定名前空間に未対応なので、設定画面に追加した操作欄を使います。

トークン更新はPi SDK、保存はDSのCredentialsサービスが担当します。ログインはAuthorization APIと認証済みConnectionを経由します。認証情報をlocalStorage・ログ・共有イベントには保存しません。認証URL・コード・入力待ちは操作ごとのチケットで扱い、キャンセルやプラグイン解除で破棄します。

ログインの待機時間は通常10分です。Device CodeはSDK通知の有効期限にトークン交換用の1分を加え、通常の待機時間より長ければ延長します。SDK側の期限切れ、プラグイン側の待機時間超過、手動キャンセルは別の終了理由として表示します。

## Thinking effort / Fastの実運用確認

- Pi SDKのモデルカタログを変更せず、`muse-spark-1.3` Standardでは既存の`Max`が表示され、Contributorではカタログ通り表示されないことを確認する。実プロバイダーが送信値を受け付けるかは別途E2Eで検証する。
- 通常版とFast版をそれぞれ選び、同じThinking effortとAPIモデルIDで`service_tier=default`／`priority`が送信されること、ON/OFFが再起動後も残ることを確認する。Fast版は最初はオフ。実装と参照ソースは[Fastの開発資料](fast.md)を参照。
- プラン・APIティアがFast非対応のとき、失敗を隠さず利用者へ示すことを確認する。Fastリクエストが実際に高速ティアで処理されたかは、レスポンスの`service_tier`および利用明細でも確認する。
- ユーザー認証を使った実API E2Eは、モックテストから確認できない。通信コストと契約条件に注意する。

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

## プラグイン更新UI（0.5.0）

更新コードは内部の`src/updates.mjs`、Client状態は`src/update-controller.mjs`で管理します。Hostは任意URLを受け取らず、固定repositoryの正式Releaseと同タグのmanifestを検査します。現行配布版のexact DSH peerと実行版が一致する場合だけ候補にします。範囲指定など判定できない互換性は導入せず表示します。tgzのSHA-256照合後にarchive内manifestも照合します。checksumは破損・取り違えの検出であり、発行者の署名ではありません。

GitHub shorthand／git+httpsの導入元は明示タグへ、Release URL／保存済み検証tgz／`local-dsh-pi-login-<導入版>.tgz`という名前の`file:`導入元は検証済みtgzへ更新します。ファイル名は配布経路の分類にだけ使い、旧ファイルの真正性を保証するものとは扱いません。その他の導入元は手動更新です。

Clientはbegin送信前にUUIDをsessionStorageへ保存します。HostはUUIDを検証してDSHの`PluginInstallRequestId`型へ変換し、profileへ操作記録を書いてからmanagerに委譲します。再接続では同IDを照合し、`waitForInstall()`のnullを成功に変換しません。実行版の反映、再起動待ち、失敗、取消、上位設定による無効化、結果不明を分けます。生のpackage出力や認証情報は記録・表示しません。

プラグインの解除は取得処理だけを中止します。開始済み導入はmanagerが所有し、その結果を書き戻す処理とprofile参照中のtgzを解除時に削除しません。承認済みbuild scriptを自動指定しません。応答生成やSDK・system promptは変更しません。

検証：`npm test`（64件）、`npm run build`、`npm run test:compat`、`npm run test:runtime`、Chromiumを指定した`npm run test:browser`が成功しました。ブラウザでは更新欄が共通フッターに1つだけあり、manager不在の説明、更新確認中の重複防止、候補・再起動待ち表示、390pxの日本語表示、解除を確認しました。`npm run pack:plugin`と`npm run test:install`を使い、実DSH `0.2.1-alpha.2`の独立した空profileへ0.5.0のtgzを導入し、再起動後の実行版とmanager対応、公開Releaseの確認を検証しました。実アカウント認証、Windows・macOS実機、公開前の0.5.0タグへの更新は未検証です。
