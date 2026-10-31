# Fastモデル

## 選択と設定

`GPT-6.1 Sol`と`GPT-6.1 Sol Fast`を同じモデル一覧に並べます。既存のモデル用ON/OFFを使い、専用のFastスイッチやアイコンは追加しません。

通常版は既存の`disabledModels`で管理します。Fast版は最初はオフで、オンにした選択IDを`enabledFastModels`に保存します。通常版のON/OFFはFast版に影響しません。プロバイダーをオフにしても両方の選択と認証情報は残ります。

`modelChoices()`が設定画面とアダプターの一覧を生成します。アダプターは有効な項目だけをDSのLLMサービスに公開し、無効な項目の解決・実行を拒否します。DSのモデル選択と内部サブエージェントはこの一覧を使います。別プロセスのCodexサブエージェントは、Codex本来の設定とモデル名を使います。

Fastの内部選択IDは`<APIモデルID>::fast`です。APIへは元のモデルIDと`service_tier=priority`を送ります。通常版は`default`を明示し、OpenAIプロジェクトの既定ティアを引き継ぎません。内部IDがユーザー定義のモデルと衝突した場合は設定エラーになります。

## 対応判定

モデル名の部分一致は使いません。公式資料で対応を確認したID、Pi SDKのモデル、プロバイダー、プロトコル、接続先が一致するときだけFast版を追加します。

- OpenAI API：`gpt-5`、`gpt-5-mini`、`gpt-5.1`、`gpt-5.2`、`gpt-5.4`、`gpt-5.4-mini`、`gpt-5.5`、`gpt-5.6-sol`／`terra`／`luna`、`gpt-6-astra`／`sol`／`luna`、`gpt-6.1-sol`。
- OpenAI Codex：上記のうち`gpt-5.5`以降の列挙したモデル。
- SDKに存在しないID、未確認の新モデル、独自の接続先、他プラグインのモデルには追加しません。

対応表はSDK更新時に公式資料と照合します。動的な能力情報の更新は[Issue #6](https://github.com/Aero123421/dsh-pi-login/issues/6)で扱います。

## SDK呼び出しと履歴

Pi SDK `1.4.0`の`streamSimple()`は`serviceTier`を引き継ぎません。`buildBaseOptions()`もこの項目を含めません。対象モデルでは、SDKの`buildBaseOptions()`と`Models.stream()`を使います。これにより推論強度の変換、トークン上限、ヘッダー、通信方式、SDKのティア別料金計算を保ちます。非対象モデルは既存の呼び出しを使います。

APIペイロードだけを書き換えると、Codexがレスポンスでティアを省略した場合のSDK料金計算にFast指定が届きません。SDKオプションにもティアを渡すため、既存の正式なストリーム経路を使っています。DSに渡す使用量は従来どおりトークン数です。

保存履歴の`model`は選択IDです。Fast版では既存のversion 2のreplay情報に任意の`wireModel`を追加し、Piへ履歴を渡すときは元のAPIモデルIDを復元します。推論署名とツール履歴の形式は維持します。通常版の既存履歴には新しいフィールドを追加しません。

Fastが拒否された場合に通常版で再送しません。接続先が実際に採用するティアと料金は、実アカウントでレスポンスと利用明細を確認する必要があります。

## 参照した実装

2026-10-11時点で次のソースを確認しました。外部プラグインのコードは取り込んでいません。

| ソース | 確認した扱い |
| --- | --- |
| [DS Harness Codexサブエージェント](https://github.com/deepseek-ai/deepseek-harness/blob/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/subagent/subagent-codex/README.md) | モデル名をCodexへそのまま渡す。Fastを独自に指定しない。 |
| [Codexのモデル能力](https://github.com/openai/codex/blob/8c0f7011674145da7e10627769fb221c74fbf7a0/codex-rs/protocol/src/openai_models.rs) | カタログの`service_tiers`から対応を判定し、モデルIDとは別にティアを扱う。 |
| [Codexのティア変換](https://github.com/openai/codex/blob/8c0f7011674145da7e10627769fb221c74fbf7a0/codex-rs/protocol/src/config_types.rs) | Fastの送信値は`priority`。 |
| [Pi SDK](https://github.com/earendil-works/pi/blob/v1.4.0/packages/ai/src/api/openai-codex-responses.ts) | 正式なストリームオプションで`serviceTier`を渡し、料金計算にも使う。 |
| [pi-codex-fast](https://github.com/calesennett/pi-codex-fast/blob/e8c9eaf044d3c407f73c96c316680ddd4da6641e/extensions/codex-fast.ts)、[pi-codex-fast-mode](https://github.com/SI-RUI-ZHANG/pi-codex-fast-mode/blob/e2ef957395097476a97cc54cdcb680e19efa5598/extensions/core.ts) | 送信前フックで`service_tier=priority`を付ける。対応判定はモデル名に依存する。 |
| [OpenCode Codex認証](https://github.com/numman-ali/opencode-openai-codex-auth/blob/bec2ad69b252ef4ad7dd33b9532ff8b4fdb6d016/lib/request/helpers/model-map.ts) | 表示用のモデル項目を実際のAPIモデルIDへ対応付ける。 |

公式仕様：[API Fast](https://developers.openai.com/api/docs/guides/fast-mode)、[対応モデルと料金](https://developers.openai.com/api/docs/pricing)、[Codex Fast](https://learn.chatgpt.com/docs/agent-configuration/speed)。
