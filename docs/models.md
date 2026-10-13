# モデル一覧とMuse Wonder

## Muse Wonder

MetaのMuse Wonderを`muse-wonder-1.0`として追加しています。APIは既存のMetaプロバイダーのResponses API、認証は既存のAPIキーまたはMetaログインを使います。プラグインの設定画面とHarnessのモデル一覧は同じ補完カタログを使用します。

Pi SDK `1.1.0`には未収録のため、`src/runtime/catalog-additions.ts`で補完しています。同じIDがSDKに追加されたらSDKの情報を優先します。既存モデルの順序、明示的なモデル一覧、ON/OFF、モデルごとの設定上書きは保持します。

根拠はmodels.devの[モデル定義](https://github.com/anomalyco/models.dev/blob/ad059c238d070e1132f9d5ced2fe5d50d44c0ee4/models/meta/muse-wonder-1.0.toml)と[Metaプロバイダー定義](https://github.com/anomalyco/models.dev/blob/ad059c238d070e1132f9d5ced2fe5d50d44c0ee4/providers/meta/models/muse-wonder-1.0.toml)です。これらは[Metaの告知](https://research.meta.ai/blog/muse-wonder)と2026年10月12日のMeta API確認結果を参照しています。この開発環境ではMeta公式サイトへの接続が許可されておらず、公式ページと実APIを直接再検証していません。

- コンテキストは1,048,576トークン。出力はカタログ記載の実用上の上限131,072トークンを使用します。Metaが公表した独立した出力上限という意味ではありません。
- Thinking effortは`minimal`、`low`、`medium`、`high`、`xhigh`、`max`。`off`は選択肢に含めません。
- このアダプターが扱える入力はテキストと画像です。カタログに記載されたPDF・音声・動画入力は、現在のPi SDK／Harnessの入力型では追加していません。
- 補完カタログの料金情報は未取得です。内部の0は無料という意味ではありません。後に料金公開を引用する資料もありますが、この環境では直接再検証していません。Harnessはこの値から料金表示を行いません。

単体テストで、実SDKとMetaプロバイダーによるモデルID、全推論レベル、画像付きResponsesリクエスト、ローカルのSSE応答を確認しています。runtimeテストで、ビルド済みプラグインのモデル選択、能力情報、ON/OFFを確認します。実アカウントでの生成・契約ごとの利用可否は別途確認が必要です。

## 再読み込みで取得できる範囲

0.4.1では、プロバイダー共通の「モデル一覧を更新」を使います。現在、実APIからの再取得に対応するのはMetaのMuseログインです。未対応のプロバイダーでは更新ボタンの代わりに案内を表示します。通常の画面再表示やSDKの`refresh()`とは別の操作です。

1. MetaにMuseのアカウントでログインする。
2. プロバイダーを有効にし、「モデルを選ぶ」を開く。
3. 「モデル一覧を更新」で契約状態とモデル一覧を確認する。
4. 一覧に追加されたモデルを選んで有効にする。新しい候補は自動では有効にならない。

保存済みOAuthのidentity tokenを`POST https://api.meta.ai/muse-code/key`で交換し、`is_subs_active`、`subs_tier_name`、`subs_tier_id`を読み取ります。契約の有効性が明確な`true`の場合、そのキーと`x-api-version: 1.0.0`で`GET https://api.meta.ai/v1/models`を取得します。契約名だけからモデルの権限を推測しません。表示は契約状態とプラン名だけで、トークン・キー・メールアドレスを画面やRPCに返しません。

Full（`muse-wonder-full-1.0`）やContributorの候補は、そのアカウントの応答に実際に含まれるIDだけを追加します。SDKの能力情報は優先し、未知のモデルは一覧の能力情報がある場合に使用します。IDだけが返った場合は、画像対応や推論レベルを推測せず、テキスト入力と接続先既定の推論を使用します。トークン上限はプロバイダー設定の`defaultContextWindow`／`defaultMaxTokens`（既定262,144／32,768）を使用し、未検証であることを表示します。これは実際のモデルの最大能力を表す値ではありません。設定で推論レベルを強制している場合、能力未確認のモデルではその指定が拒否されることがあります。

新しい候補の選択は`enabledDiscoveredModels`に保存します。明示的な`models`一覧は置き換えず、`disabledModels`と既存のモデル設定を維持します。取得した能力情報はプロセス内だけ保持するため、再起動後は一覧の再取得が必要です。別アカウントへのログインで取得済みの一覧を破棄し、実行時にもアカウントを確認します。キー参照、Authorizationヘッダー、標準外の接続先を上書きした設定では、このMuse用の操作を拒否します。新モデルの実行には取得元のMuseログインのキーを使い、通常版や別のキーへ自動で切り替えません。キーの有効期限が切れた場合は再読み込みが必要です。

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
