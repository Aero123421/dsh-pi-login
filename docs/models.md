# モデル一覧とMuse Wonder

## Metaの2つの経路

「Meta Model API（Pi経由）」と「Meta Muse Code」は別の連携です。ログインしたアカウント、実行endpoint、契約・データ利用条件を混同しません。

| 連携 | 実行とモデルの確認 |
| --- | --- |
| Meta Model API（Pi経由） | Pi SDKのResponses API。`muse-wonder-1.0`は Pi SDK 1.3.0 の定義を使い、SDKに同じIDが無いときだけ補完します。Full等の追加モデルは認証したアカウントのAPI応答に実際に返ったIDだけを使います。 |
| Meta Muse Code | Pi SDKのMetaログインとResponses API。モデル一覧はMuse Code専用の`/muse-code/models`、Contributorはリクエストヘッダーで選択します。 |

## Meta Muse Code

HTTPの項目名とヘッダーは公式Muse Code CLI 1.4.7の実装を基準に、[1.4.10までの公式変更履歴](https://dev.meta.ai/docs/muse-code/changelog)と照合しています。CLI本体のセッション・サブエージェント実装はこのプラグインには含みません。

- **ログイン:** `auth.meta.com`の端末コード（CLIと同じクライアントID）で本人確認し、`POST https://api.meta.ai/muse-code/key`でAPIキーを発行します。Pi SDKの`meta`プロバイダーがこれを行い、期限切れ時に再発行します。認証情報は接続専用の`llm-pi-ai/<credentialRecordId>`に保存します。
- **モデル一覧:** CLIと同じ`GET https://api.meta.ai/muse-code/models`を、`x-tbh-contributor-mode: 0`と`1`の両方で読み込みます。Model APIの`/v1/models`はWonder FullなどMuse Code専用のモデルを含まないため使いません。行の`id`／`display_label`／`context_limit`／`output_limit`／`reasoning_effort_variants`を読み、画像・音声生成用のモデルや非公開の行は除外します。
- **推論レベル:** Pi SDKの`thinkingLevelMap`、またはMuse一覧の`reasoning_effort_variants`（および同義のeffort配列）と`defaultReasoningEffort`にある値だけを有効にします。表示名にMaxやContributor Maxが含まれていても、一覧にそのeffortが無ければ`max`は選びません。配列が無い、空、または未知の値だけの行は、Max対応の根拠にしません。その選択は未確認と表示し、`max`と`xhigh`は出しません。`minimal`から`high`は、一覧がeffortを省略したときの選択用です。例外は、公開資料で推論レベルが決まっている`muse-wonder-1.0`のStandardだけです。そのStandardの一覧がeffortを省略したときは`minimal`から`max`までを使います。Contributor側とWonder Fullにはこの既定を使いません。Contributorの`max`が実APIのeffort一覧に含まれるかは、この環境では実アカウントを呼んでいないため未確認です。
- **Contributor:** `1`の一覧にあるモデルに「<名前> Contributor」の選択肢（`<id>::contributor`）を追加します。最初はオフで、`enabledContributorModels`に保存します。送信時はContributor版に`x-tbh-contributor-mode: 1`、通常版に`0`を付け、APIへは提供元が返した実モデルIDを送ります。`-contributor`付きの実IDが返る場合はその記述子・能力情報を使い、通常版と1つのContributor選択へまとめます。その実IDがなく、Contributorモードの一覧にbase IDがある場合はbase IDとヘッダーで選択します。同じbase IDでも、effort・既定effort・出力上限・コンテキストがモードごとに違うときは、Contributor選択にStandardの記述子を使いません。baseが返らないContributor専用IDは、その実IDだけをオフで提示し、通常版を作りません。[MetaのContributor利用条件](https://dev.meta.ai/help/subscriptions/muse-code-contributor-mode)
既に保存された0.7.0/0.7.1の一覧にも同じ整理を適用します。旧native Contributor行の既定オン状態を新しい選択の承認へ変換しません。明示したContributor選択は維持し、旧native行に明示的なオフが残る場合はオフを優先します。ユーザーがまとめられたContributor選択をオンにした時だけ、その実IDの旧オフを解除し、通常版のオフには触れません。

- **保存:** 読み込んだ一覧（ID・名前・上限・effort・既定effort・Contributor可否と、モード間で違うContributor側の同じ項目）を接続の`museCatalog`に保存し、再起動後もモデル選択とルーティングに使います。認証情報や認証応答は保存しません。アカウントが途中で変わった場合は保存しません。複製した接続には一覧も認証情報も引き継ぎません。古い保存済み一覧にContributor側の差分が無い場合は、次に一覧を読み込んだときから分かれます。
- **利用状況:** キー発行の応答に含まれる契約と利用枠を表示します。

一覧の応答形式とContributorヘッダーの値はCLIの実装から読み取ったもので、公開仕様ではありません。実アカウントでのログイン、Wonder／Fullの生成、Contributorの利用枠・課金は未検証です。

## Muse Wonder

MetaのMuse Wonderを`muse-wonder-1.0`として扱います。APIは既存のMetaプロバイダーのResponses API、認証は既存のAPIキーまたはMetaログインを使います。

Pi SDK 1.3.0 の meta カタログにこのIDがあるため、設定画面とHarnessのモデル一覧はその定義を使います。`src/runtime/catalog-additions.ts`の補完は、同じIDがSDKに無い場合だけ入ります。1.1.0 には無かったため補完を残しています。既存モデルの順序、明示的なモデル一覧、ON/OFF、モデルごとの設定上書きは保持します。

根拠はmodels.devの[モデル定義](https://github.com/anomalyco/models.dev/blob/ad059c238d070e1132f9d5ced2fe5d50d44c0ee4/models/meta/muse-wonder-1.0.toml)と[Metaプロバイダー定義](https://github.com/anomalyco/models.dev/blob/ad059c238d070e1132f9d5ced2fe5d50d44c0ee4/providers/meta/models/muse-wonder-1.0.toml)です。これらは[Metaの告知](https://research.meta.ai/blog/muse-wonder)と2026年10月12日のMeta API確認結果を参照しています。この開発環境ではMeta公式サイトへの接続が許可されておらず、公式ページと実APIを直接再検証していません。

- コンテキストは1,048,576トークン。出力はカタログ記載の実用上の上限131,072トークンを使用します。Metaが公表した独立した出力上限という意味ではありません。
- Thinking effortは`minimal`、`low`、`medium`、`high`、`xhigh`、`max`。`off`は選択肢に含めません。
- このアダプターが扱える入力はテキストと画像です。カタログに記載されたPDF・音声・動画入力は、現在のPi SDK／Harnessの入力型では追加していません。
- 補完カタログの料金 0 は未取得であり、無料という意味ではありません。SDK 1.3.0 の定義を使うときは、そのカタログの料金が入ります。Harnessはこの値から料金表示を行いません。この環境では Meta 公式の料金ページを直接再検証していません。

単体テストで、実SDKとMetaプロバイダーによるモデルID、全推論レベル、画像付きResponsesリクエスト、ローカルのSSE応答を確認しています。runtimeテストで、ビルド済みプラグインのモデル選択、能力情報、ON/OFFを確認します。実アカウントでの生成・契約ごとの利用可否は別途確認が必要です。

## Pi Meta Model APIで再読み込みできる範囲

0.4.1では、プロバイダー共通の「モデル一覧を更新」を使います。現在、実APIからの再取得に対応するのはMetaのMuseログインです。未対応のプロバイダーでは更新ボタンの代わりに案内を表示します。通常の画面再表示やSDKの`refresh()`とは別の操作です。

1. MetaにMuseのアカウントでログインする。
2. プロバイダーを有効にし、「モデルを選ぶ」を開く。
3. 「モデル一覧を更新」で契約状態とモデル一覧を確認する。
4. 一覧に追加されたモデルを選んで有効にする。新しい候補は自動では有効にならない。

保存済みOAuthのidentity tokenを`POST https://api.meta.ai/muse-code/key`で交換し、`is_subs_active`、`subs_tier_name`、`subs_tier_id`を読み取ります。契約の有効性が明確な`true`の場合、そのキーと`x-api-version: 1.0.0`で`GET https://api.meta.ai/v1/models`を取得します。契約名だけからモデルの権限を推測しません。表示は契約状態とプラン名だけで、トークン・キー・メールアドレスを画面やRPCに返しません。

Full（`muse-wonder-full-1.0`）やContributorを名前に含む候補は、そのアカウントのAPI応答に実際に含まれるIDだけを追加します。このAPIモデルの選択でMuse Code本体のContributor modeを設定したことにはなりません。SDKの能力情報は優先し、未知のモデルは一覧の能力情報がある場合に使用します。IDだけが返った場合は、画像対応や推論レベルを推測せず、テキスト入力と接続先既定の推論を使用します。トークン上限はプロバイダー設定の`defaultContextWindow`／`defaultMaxTokens`（既定262,144／32,768）を使用し、未検証であることを表示します。これは実際のモデルの最大能力を表す値ではありません。設定で推論レベルを強制している場合、能力未確認のモデルではその指定が拒否されることがあります。

新しい候補の選択は接続ごとの`enabledDiscoveredModels`に保存します。明示的な`models`一覧は置き換えず、`disabledModels`と既存のモデル設定を維持します。モデルのON/OFFやThinking変更だけでは、取得済み一覧と契約情報を失いません。取得した能力情報はプロセス内だけ保持するため、再起動後は一覧の再取得が必要です。別アカウントへのログインで取得済みの一覧を破棄し、実行時にもアカウントを確認します。キー参照、Authorizationヘッダー、標準外の接続先を上書きした設定では、この取得操作を拒否します。取得したaccess keyはその接続の標準OAuth Credentialsへ保存します。新モデルの実行には同じ接続の認証を使い、通常版や別のキーへ自動で切り替えません。鍵の再取得はHost側の同じ契約処理を共有します。

一覧の取得が失敗した場合は、前回の完全な一覧を保持してエラーを表示します。不完全なページ、JSON異常、過大な応答は採用しません。回数制限では自動再試行せず、待ってから再試行する案内を表示します。契約の無効化を確認した場合やアカウント変更時には、以前の候補を使用しません。

## プロバイダー共通の再取得処理

`src/provider-catalogs.mjs`の`ProviderCatalogs`にプロバイダー名と処理を登録します。画面・`refresh-models` RPC・選択前の検証は、選択したプロバイダーの処理だけを呼びます。未登録のプロバイダーからMetaの取得処理を呼ぶことはありません。

登録は`{ session, presentation?, errorCodes?, errors?, authorizeModel? }`です。

- `session.refresh()`は取得した一覧をセッション内に保持します。`catalog(provider)`はSDKを含むモデルMap、`version`は変更時に増える数値です。変更後はHostの一覧更新イベントも通知します。
- `validate()`でアカウント変更などを確認し、`invalidate()`でログイン後の一覧を破棄します。`dispose()`はプラグイン解除時に保留中の取得を終了します。共通側でも同時更新をまとめ、解除後の結果を返しません。
- `presentation(models)`は公開用の`status: { message, detail? }`と`notes`を返します。`message`と`notes`は日英の翻訳キーです。セッションの内部状態・認証情報はRPCに渡しません。
- `errorCodes`は取得側のエラーを共通コードへ変換し、`errors`はそのコードに対するプロバイダー固有の翻訳キーです。未定義の例外は共通の取得失敗に変換し、生の応答や秘密値を返しません。
- `authorizeModel(model, profile)`は実行時に`{ apiKey, headers? }`を返せます。必要なヘッダーと認証は取得側が指定し、共通アダプターは特定プロバイダーの接続方法を決めません。

取得したモデルに共通の`DISCOVERED_MODEL`シンボル（`{ verified: boolean }`）を付けると、選択は`enabledDiscoveredModels`で管理され、初期状態はオフになります。モデルの能力情報とアカウント権限の確認は各実装の責任です。Museの契約取得・専用ヘッダー・契約説明・エラー文言は`src/meta-catalog-provider.mjs`と`src/meta-catalog.mjs`に置いています。ほかのプロバイダーは認証方法とモデル取得APIを確認してから同じ登録先に追加します。

## 検証範囲と残る確認

ローカルでは契約交換・一覧取得をモックし、公式Harnessの認証済みRPCと実Pi SDKを通してFullの選択、リクエスト、SSE応答、アカウント変更時の拒否を確認しています。ブラウザでは契約表示、FullのON/OFF、取得失敗時の一覧保持とAPIキー優先のエラー、390px／1000pxの表示を確認しています。

本人のPower Usage／Maximum UsageのキーでFullが一覧に返るか、実際に生成できるか、Contributorの利用枠が適用されるかは未検証です。一覧にIDが載ることは生成や課金の検証ではありません。一覧にFullがないことも利用不可の断定材料ではなく、この版ではその場合に候補を推測して追加しません。必要ならMuse本体／MSPとの連携を別途検討します。

調査上の根拠: [MuseでWonder Contributorが応答した第三者の報告](https://github.com/HarjjotSinghh/helicon/pull/131)、[FullのIDとプラン条件をMeta仕様から引用する報告](https://github.com/HarjjotSinghh/helicon/issues/132)、[サブスクリプションキーを解析する別クライアントの実装](https://github.com/can1357/oh-my-pi/blob/818dd42b73ab1caad17fa06d4edcc3a97086dc57/packages/ai/src/registry/oauth/muse-code.ts)。これらはこのプラグインによる実アカウント検証を意味しません。Muse本体のContributor実行モードと、このAPI経路のContributorモデルIDは区別して扱います。

## OpenAI ChatGPTログイン

[SIWC仕様](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)に従い、アカウントのトークンで `GET https://api.openai.com/v1/models` を読み、`models[]` の `slug`、`display_name`、`visibility: "list"` から候補を作ります。返された順序を保ち、ログイン・認証変更・再起動・キャッシュ期限で再取得します。設定の上書きと、アカウントが提供するモデルの有無は別に検査します。

既知IDの能力はPi 1.3.0の定義を使います。`gpt-6.1-sol` の既定コンテキストは従来 `openai-codex` OAuthが500,000、`openai` のSIWCとAPIキーが272,000です。Fastも共通です。明示したコンテキスト上書きは維持します。SIWC一覧には各モデルのコンテキスト・推論能力の保証がないため、未知IDは接続設定の保守的な上限、テキスト入力、接続先既定の推論で初期オフにします。

SIWCは公開 `/v1/responses` を使い、`store: false`、`stream: true` を送ります。Codex専用 `wham/usage` へのSIWCトークン送信は行いません。アカウント利用枠の公開契約が確認できないため、Usageは未対応です。独自接続先へのSIWCトークン転送も対応しません。

モデル一覧の形式・認証世代・取得失敗・解除・SDK送信値はfixtureで検証します。実SIWCアカウントのログイン、500K入力の生成、アカウント固有の能力と課金は未検証です。

Museのeffort一覧は文字列と `tier` / `id` / `name` 形式を受け付けます。`tier` は公式MSPの型にもありますが、同形式が `/muse-code/models` の実応答で返ることは未確認です。StandardとContributorは各モードの情報を使い、Maxを一律に追加・削除しません。WonderとWonder Fullは別IDです。
