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
| `test` | 接続・routeの分離、移行の原子性と再試行、認証の遅延完了・プロフィール切替、利用状況とモデル一覧のキャッシュ、秘密値の公開防止、ログインの入力・終了・有効期限、Fast・Thinking・replay、日本語と英語の文言 |
| `test:compat` | 公式のCordis・Authorization・Credentials・Connectionによる認証保存と解除 |
| `test:runtime` | ビルド済みプラグインと公式RPCによる旧設定の移行、独立した接続の登録・鍵変更・削除、実SDKでのAPI A+B／Gateway／OAuth A+Bのローカル生成、token refreshの世代確認、Fast・Thinking・履歴の接続境界、429・認証欠落時の切替禁止 |
| `test:browser` | 接続追加・設定・モデル・利用状況、ログイン画面、再接続・プロフィール切替、認証・Originチェック、キーボード、明暗テーマ、390／768／1440px、多数接続、解除 |
| `pack:plugin` | ビルド済みファイル・locale・ドキュメントを含むtgzとSHA-256 |
| `test:install` | 実DSH `0.2.1-alpha.2`の空profileへ導入し、APIキー接続とMuse Codeの保存済み一覧・Contributor選択を残して再起動し、接続・認証・実行版・update manager・公開Release照合を確認。実Settings画面で8選択肢・オフの再起動保持・確認付き接続削除・Credentials削除・再起動後の非復活を検証 |

モデル一覧更新の共通処理は単体テストで、Meta以外への委譲、未対応・不正なプロバイダーの拒否、同時更新の共有、破棄時の終了、公開する情報を確認します。Muse契約の再取得は単体テストで、OAuthとAPIキーの分離、契約状態、応答上限、取得失敗、アカウント変更を確認します。runtimeテストでは認証済みRPCからFullを選択し、実SDKによるリクエストとテスト用SSE応答を確認します。ブラウザテストでは共通の更新ボタンによるMetaと別のテスト用プロバイダーの再取得・モデル選択、未対応の案内、契約名・Full選択・APIキー優先時のエラーを確認します。いずれも実Metaアカウントや有料生成を使いません。[実アカウントで確認する項目](models.md#検証範囲と残る確認)

環境にChromiumがある場合は`DSH_TEST_CHROMIUM=/usr/bin/chromium npm run test:browser`を使えます。画面証拠をチェックアウト外に保存する場合は`DSH_TEST_ARTIFACT_DIR=/tmp/dsh-ui-evidence`を指定します。

`test:install`はNode.js 22.19.0以上、DSH CLI `0.2.1-alpha.2`、pnpm `11.28.5`をPATHに必要とします。公式CLIの`dsh plugin`はpnpmへ委譲します。以下はユーザーのhomeやglobal環境を変更せずに検証用CLIを用意する方法です。pnpmの版は固定した公式ソースの`packageManager`に合わせています。

```sh
npm install --prefix .cache/dsh-cli --ignore-scripts @deepseek-ai/dsh@0.2.1-alpha.2 pnpm@11.28.5
PATH="$PWD/.cache/dsh-cli/node_modules/.bin:$PATH" npm run test:install
```

CLI依存の導入と配布tgzの追加ではbuild scriptsを許可しません。CLIやpnpmが見つからない場合は、段階・終了コード・安全なエラー分類を表示し、rawの設定出力は公開しません。

runtimeテストの設定保存先とLLM登録先はテスト用サービスです。ブラウザテストは日本語を登録したテスト画面で行い、日本語プラグインやフォントは読み込みません。実アカウントは使用しません。

GitHub Actionsにも同じチェックを設定しています（`.github/workflows/ci.yml`）。配布ファイル、チェックサム、スクリーンショットは`artifacts`に出力します。

## GitHubからの配布

`main`にはビルド済みの`dist/`を含めます。変更後に`npm run build`を実行し、更新した`dist/`も一緒にコミットしてください。CIで再ビルドし、コミット済みのファイルとの差分が残ると失敗します。インストール時に実行するビルド用スクリプトは追加しません。

版を上げるときは`package.json`、`package-lock.json`、READMEのReleaseリンクを更新し、ビルドと検証を行います。GitHub Releasesにも`npm run pack:plugin`で作った配布ファイルと`SHA256SUMS`を置きます。

## 設定と認証

設定は`dsh-pi-login/connections`です。`connectionId`、DSH履歴の`routeId`、Pi SDKのnative `serviceId`、`credentialRecordId`を別々に扱います。接続名の変更でIDは変わりません。新しい認証情報は`llm-pi-ai/<credentialRecordId>`、移行した認証は元の`llm-pi-ai/<provider>`を参照します。OpenAI OAuthのインストールIDは`dsh-pi-login/installation`です。本体の標準フォームはこの設定名前空間に未対応なので、公式Slot内の操作欄を使います。

各接続のSDK collectionとCredentials storeはnative serviceを1件のrecordへ対応付けます。別接続のrecord列挙や環境変数による認証への切替はしません。再ログイン・APIキー変更で認証世代を進め、遅れて完了した古いOAuth refreshの保存を拒否します。呼び出し開始時の設定と認証を保持し、次の呼び出しから変更を使います。replayのopaque状態はroute・接続・認証世代・endpoint・protocolを確認し、境界が変わった場合は本文だけを再利用します。

独自endpointはHost設定の`trustedEndpointOrigins`にoriginを列挙してから使用します。RPCのURL指定では信頼を追加できません。URLのuser/password/query/fragmentは拒否し、秘密ヘッダーは`headerRefs`からCredentialsで解決します。生のキー・ヘッダー値は設定一覧、Client、利用状況、公開イベントへ返しません。

トークン更新はPi SDK、保存はDSのCredentialsサービスが担当します。ログインはAuthorization APIと認証済みConnectionを経由します。認証情報をlocalStorage・ログ・共有イベントには保存しません。認証URL・コード・入力待ちは操作ごとのチケットで扱い、キャンセルやプラグイン解除で破棄します。

ログインの待機時間は通常10分です。Device CodeはSDK通知の有効期限にトークン交換用の1分を加え、通常の待機時間より長ければ延長します。SDK側の期限切れ、プラグイン側の待機時間超過、手動キャンセルは別の終了理由として表示します。

## 接続移行と回復

初回起動はプロファイル単位で`providers`を`connections`へ変換し、`connectionMigrationVersion: 1`、`legacyImported: true`と旧設定の除去を、同じrevisionに対する1回の`settings.mutate()`で保存します。既存route・モデル/Fast/Thinking設定を維持し、資格情報は元のrecordへ参照するため複製しません。再起動後に完了版を確認し、重複接続を作りません。設定保存が失敗した場合は旧設定とCredentialsを残します。

同じ旧設定が`apiKeyEnv`を選択しつつ保存済みOAuthも持つ場合は、元routeのAPI参照接続とオフの保存済みOAuth接続へ分けます。OAuth grantは元のrecordに1件だけ保持し、API接続には別のrecord IDを割り当てます。API側の変更・削除でOAuthを消しません。この複合ケースでは、旧履歴の認証先を断定できないためopaque replayを流用しません。通常のOAuth1件は接続1件へ移行します。

更新前にプロファイルの設定とCredentialsストアをバックアップします。旧設定の直接記載した`headers`は移行を止めます。カスタムヘッダーが必要な場合は旧版の設定と値を安全に保管してから旧`headers`を取り除いて移行し、新しい接続の`headerRefs`をHost設定でCredentials参照へ設定します。APIの秘密値をGitHubやログへ貼らないでください。独自routeのID・protocol・モデル宣言が検証に通らない場合は、旧版を維持して元設定を修正するか、接続を追加し直してください。画面の表示名だけから認証先を推測して補修しません。

旧版へ戻す場合、新しい`connections`は旧版では読めません。設定のバックアップを復元し、移行後に削除・変更した資格情報がある場合はCredentialsのバックアップも復元します。アンインストール後の組み込みPiは元の組み込み設定を使います。

## Account Usageと検証範囲

Account Usageは生成のtoken/cost記録とは別のreadonly snapshotです。`sourceObservedAt`とHostの`checkedAt`を区別し、提供元が返した期間・scope・使用率・quotaだけを正規化します。内部HTTP APIに安定性保証はありません。期間や共有契約枠をアカウント名・プラン名から推測しません。接続・profile・認証世代・endpoint・principalごとにキャッシュを分離し、更新の共有、期限、古い値の上限、429のRetry-After、abortを扱います。Usage更新はモデル登録やSDK設定を再構築しません。

| 範囲 | 自動検証 | 別途必要な確認 |
| --- | --- | --- |
| 旧設定の移行 | 成功・revision競合・再試行・header修復停止・秘密値非複製 | 利用者の実profile／Credentialsバックアップからの移行 |
| 複数接続 | 実SDKと公式Host、API A+B／Gateway／OAuth A+Bをfixtureで実行、鍵変更・削除・refresh競合・replay分離 | 実OAuthアカウント、契約枠、課金明細 |
| UI | ローカルChromium、幅・theme・keyboard・多数接続・profile切替 | Windows／macOS Desktop、iPad PWA、Safari／WebKit、Tailscaleの実接続 |
| 導入・更新 | tgz・checksum・固定package版、空profile導入、既存self-updateの単体回帰 | 公開前タグからの実自己更新、実利用profileでの更新・再起動 |

ローカルのSSEやOAuth token responseはfixtureです。自動検証を実アカウントのログイン・生成・利用枠・課金の検証とは表記しません。認証情報を使う手動E2Eでは実サービス、endpoint、課金区分、Contributor条件を先に確認します。

0.6.0のtgzは実DSH `0.2.1-alpha.2`の独立した空profileへの導入・起動、実行版0.6.0、update manager対応、認証済みRPCでの接続追加・実Credentials保存・認証をコピーしない複製・削除、再起動後の移行記録とprofile世代更新を確認しました。この開発環境では`api.github.com`へのproxy CONNECTが403で拒否されるため、live Release照合は未検証です。通常の`test:install`はこれを失敗として扱います。明示した`DSH_TEST_OFFLINE_RELEASE=1`では`blocked/network`だけを許容し、導入・CRUD・再起動と取得失敗の表示を検証します。「最新版」の判定には変換しません。CIとRelease workflowはオフライン指定を使わず、live Release照合まで成功することを要求します。起動ログに一時的なブラウザ認証URLが含まれる場合があるため、生ログを公開成果物へ含めません。

Muse Code接続はPi SDKのMetaプロバイダーでログイン・生成し、モデル一覧（`/muse-code/models`）とContributorヘッダーだけを専用に扱います（`src/muse-code-catalog.mjs`）。結合確認は`scripts/runtime-check.mjs`の「Meta Muse Code」で、一覧の両モード取得・保存・Hostへのroute登録・SDK送信時のヘッダーを検証します。[詳細](models.md#meta-muse-code)

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

検証：`npm test`（65件）、`npm run build`、`npm run test:compat`、`npm run test:runtime`、Chromiumを指定した`npm run test:browser`が成功しました。ブラウザでは更新欄が共通フッターに1つだけあり、manager不在の説明、更新確認中の重複防止、候補・再起動待ち表示、390pxの日本語表示、解除を確認しました。`npm run pack:plugin`と`npm run test:install`を使い、実DSH `0.2.1-alpha.2`の独立した空profileへ0.5.0のtgzを導入し、再起動後の実行版とmanager対応、公開Releaseの確認を検証しました。実アカウント認証、Windows・macOS実機、公開前の0.5.0タグへの更新は未検証です。
