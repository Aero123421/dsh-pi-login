# SDKと独立したモデルカタログ

通信・認証は固定したPi SDKを使い、モデルの追加・上限・対応Effortはデータとして更新します。リモートからJavaScriptやSDKそのものを読み込みません。

## 取得元

| 接続 | 一覧・能力情報 | 通信 |
| --- | --- | --- |
| Pi標準接続、OpenCode Go / Zen | `https://pi.dev/api/models/providers/{provider}?types=chat` | 同梱Pi provider。Goのセッションヘッダー等を維持 |
| CommandCode | `https://api.commandcode.ai/provider/v1/models`。不足する能力はmodels.devの**同じサービス・同じID**だけで補完 | 返された`supported_endpoints`からAnthropic Messages / OpenAI Responses / Chat Completionsを選択 |
| Ollama Cloud | キー付きで`https://ollama.com/api/tags`、モデルごとに`/api/show` | `https://ollama.com/v1`のOpenAI互換API |
| Meta API、Muse Code、OpenAI ChatGPTログイン | 既存のアカウント専用取得処理 | 既存の専用認証・通信処理 |

Pi公開カタログの更新速度には依存します。提供元が追加したモデルが公開カタログに未掲載の場合、Pi経由ではまだ発見できません。Ollama CloudとCommandCodeは直接の一覧を使うため、この掲載待ちはありません。

## 更新・保存・設定の優先順位

標準の接続レコードが対象です。旧設定は既存の移行処理で接続レコードに移行します。移行できない読み取り専用の旧設定には、この自動更新を適用しません。

初回参照で取得を開始し、その後は約1時間ごとに更新します。PiはETagに対応します。手動更新も同じ処理を通し、同時取得をまとめます。HTTP 429ではRetry-Afterを尊重し、通常の失敗では少なくとも60秒空けて再試行します。プラグイン解除でタイマーと通信を停止します。

開いているモデル画面はHostの更新通知と保存済み状態の再読込に追従します。通知が届かない取得失敗も反映し、初回失敗と前回の取得結果を表示できる失敗を区別します。この画面側の再読込は外部APIへの取得を強制しません。画面を閉じると停止し、モデル保存中は競合する読込を抑制します。

取得成功時、接続内の`modelCatalog`文字列に版番号1のJSONとして保存します。モデル情報・取得日時・ETag・接続の識別ハッシュを含み、APIキーや応答ヘッダーは保存しません。再起動後は同じ接続・資格情報の世代・接続先であることを照合して復元します。設定のrevisionを使い、更新と名前変更等が競合しても他の設定を上書きしません。削除・鍵変更・接続先変更後に届いた結果は採用しません。

Piは同梱モデルに最新の取得データを重ねます。同梱IDを一覧から自動削除しないため、公開カタログは利用権限や廃止の最終判断ではありません。CommandCodeとOllama Cloudは取得一覧を候補にします。通信失敗時は前回の一覧と失敗表示を残します。Ollamaの認証失敗時はメモリ内の一覧を撤回し、キーの変更時は保存済み一覧の識別照合も失敗します。

明示的な`models`、`api`、独自URLを持つ接続では公開カタログを適用しません。`modelOverrides`などのユーザー指定は取得データより優先します。新しく見つかったIDは初期オフで、`enabledDiscoveredModels`に接続ごとに選択を保存します。既存モデルのON/OFFは維持します。

## Effortと版付きモデル

モデル名や`reasoning: true`だけからLow〜Maxを推測しません。Piは`thinkingLevelMap`、Ollamaは`thinking.values`と`thinking.default`、CommandCodeは明示されたEffortまたはmodels.devの同サービス・同IDの`reasoning_options`を使います。能力不明の場合はテキスト・サービス既定で扱い、未確認と表示します。上限が得られないGatewayには暫定値を使うため、実際の最大能力を意味しません。料金情報がない場合も無料であるという意味ではありません。

Ollamaの`[false, "low", "high", "max"]`にはOff / Low / High / Maxを対応させ、MediumやXHighは追加しません。`[false, true]`はOff / Onとして表示します。「サービス既定」はEffortを送らず、Offは`reasoning_effort: "none"`を送ります。将来の未知の段階は保存しますが、現在のDSH/Piで対応できるまでは選択肢にしません。

例として`deepseek-v4.1-flash:1017`が一覧に返れば、そのIDをそのまま送ります。`:1017-cloud`を返す一覧なら、その文字列を保持します。ローカルOllama向けのタグと直接Cloud API向けのIDを、名前から変換したり固定したりしません。

## 更新が必要な境界

同梱Pi providerで扱えるAPI形式と既知の送信先だけを採用します。未対応のAPI形式、新しい認証方式、別の送信先はスキップし、画面に一部未反映と表示します。これらはプラグイン／SDK更新が必要です。既存サービス内でのモデル追加や確認済みの能力更新はSDK更新なしで取り込みます。

Ollamaの`show`取得に失敗した場合は同じモデルの前回情報を再利用し、初回なら能力を推測しません。embedding専用モデルは候補から除外します。CommandCodeのモデル一覧は公開情報であり、契約の利用権限とは別です。利用枠取得の内部APIが変わってもモデル生成の処理には影響させません。

## 参考実装と検証

設計時に確認した実装：

- [Piのリモートカタログ](https://github.com/earendil-works/pi/blob/1402973a9dbe8c627341e04c9744c54953e285ca/packages/coding-agent/src/core/remote-catalog-provider.ts)：SDKとモデル定義の更新を分離、ETag対応。
- [Oh My Pi](https://github.com/can1357/oh-my-pi/tree/9d5d4ac5b50ac2bb5866e4202efc0cf785dfc57a)：Ollamaの検出方式を参照。固定のEffort段階は採用せず、`thinking.values`を読む。
- [OpenCode](https://github.com/anomalyco/opencode/tree/ba06ff9e0bf2dcefbbbc3a1d6094f3572d77c84e)：サービスごとのモデル定義・能力・通信オプションの扱いを参照。

自動テストは、一覧の保存と復元、ETag、失敗時保持、鍵変更・削除後の結果拒否、設定競合、版付きID、Effort、実Pi SDKからの送信内容、Goのセッションヘッダーを対象にします。外部応答はfixtureです。実アカウントでのCommandCode/Ollama Cloud生成、課金・残量、1017版の実配信は未検証です。モデルIDと能力のテスト成功を、実サービスでの提供保証とは扱いません。
