# DSH・モデル互換性（2026-10-29）

調査基準はプラグインのmain `6cf438592296346d567ec422ece24937f647592f`。この変更は未リリースです。Issue #51の手動rollback後に更新確認が止まる問題の修正を含みます。進行中のPR #48の表示修正は含めません。プラグインの版は0.8.1のままです。配布には別途版の更新とReleaseが必要です（[Issue #49](https://github.com/Aero123421/dsh-pi-login/issues/49)）。

## 対象版と配布元

| 公式配布 | 確認した版 | 本体コミット |
| --- | --- | --- |
| npm `@deepseek-ai/dsh@latest` | `0.2.1-rc.2` | `687f282e8625c6b8d11ff58211a90524be2e4317` |
| 調査時のnpm `@deepseek-ai/dsh@next` | `0.2.1-rc.4` | `504a01a9578abc2c6f1fb896b1dc322c9fe24f66` |
| npm `@deepseek-ai/dsh@alpha` | `0.2.2-alpha.2` | `f3803c96974ad4a94195fb97e5c637e9c2a3afe3` |
| npm `@earendil-works/pi-ai@latest` | `1.4.0` | タグ`v1.4.0`: `4a080252f06caf63a525d7873c5d94d3c23887e0` |

DSHの公開npm版に安定版はありません。`latest`もrcです。本体の公式配布元は[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness/releases)、[npmの@deepseek-ai/dsh](https://www.npmjs.com/package/@deepseek-ai/dsh)。`upstream.json`は最新alphaの不変コミットに固定します。対応peer範囲は変更しません。

基本受入対象はnpm latestのrc.2です。alphaは追加の互換検証対象で、nextのrc.4は版・ソース情報を確認しましたが最終候補の実Host検査はしていません。alphaのplugin managerにはrc.2に無い`listVersions`・`updateBundle`・`readBundleDetail`が追加されています。本プラグインはrc.2でも使える既存APIを維持します。

PR公開前の再確認ではnpm nextが`0.2.1-rc.5`へ進んでいました（npm tarball SHA-1: `8e1bfd31869414f7a5ec10c34403a852ac9c3dc7`）。対応する公式Git tag・コミットは確認できず、rc.5での実行検査は未実施です。latestとalphaの上表の版は維持されていました。

隔離導入した公式`dsh-0.2.2-alpha.2.tgz`のSHA-256は`3c8fd2338d0e89b1a72484abc22fc9f7452088a5ad8e122566065ef5a803ea7a`、npmのSHA-1は`c149de1694cc156a79765faca2e90af8f237c40a`です。

## モデル・認証の対応

| 接続 | 一覧・認証と確認した境界 |
| --- | --- |
| OpenAI API | Pi 1.4.0と公開Piカタログ。APIキーの認証・利用権限はChatGPT契約と別。aliasやモデルIDを勝手に別IDへ変換しません。 |
| OpenAI SIWC | [公式SIWC仕様](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)のアカウント別`/v1/models`。`slug`と順序、`visibility`を使用し、生成は公開Responses。未取得・取得失敗時に静的一覧で契約上の利用可否を代用しません。 |
| OpenAI Codex OAuth | SIWCと別のSDK provider。`gpt-5.5`と`gpt-5.3-codex-spark`は[上流の非対応判定](https://github.com/earendil-works/pi/pull/11173)に従い、旧キャッシュ・公開カタログからも候補へ戻しません。OpenAI API側の同名IDは残します。 |
| Anthropic | [公式Models API](https://platform.claude.com/docs/en/api/models/list)と[SDK provider](https://github.com/earendil-works/pi/blob/v1.4.0/packages/ai/src/providers/anthropic.ts)を照合。APIキーとClaude契約OAuthを分けます。カタログ掲載はその認証での利用保証ではありません。 |
| Google / Vertex | [公式モデル一覧](https://ai.google.dev/gemini-api/docs/models)と[Google provider](https://github.com/earendil-works/pi/blob/v1.4.0/packages/ai/src/providers/google.ts)。Gemini APIキーとVertexの認証を分けます。現在のPiにはGemini CLI/Antigravity OAuthはありません。 |
| Meta / Muse Code | [公式モデル](https://dev.meta.ai/docs/models)、[Muse変更履歴](https://dev.meta.ai/docs/muse-code/changelog)。Model APIとMuse Codeの一覧・契約を分離。FullやContributorはアカウント一覧に返ったものだけを扱い、`::contributor`は選択ID、送信IDは提供元の値です。 |
| OpenCode Zen / Go | [公式モデル一覧](https://opencode.ai/v2/docs/console/models/)、[推論API](https://opencode.ai/v2/docs/console/api/inference/)。PiネイティブproviderとGoのsession headerを維持。無料chatモデルは第三者クライアントで403となる公式制約があります。SDKの旧endpoint表記と現行文書のfamily別pathの互換性は未確認です。 |
| CommandCode | [公式Provider API](https://commandcode.ai/docs/provider)、[モデルとCLI aliases](https://commandcode.ai/docs/reference/cli/models)。公開一覧の`supported_endpoints`で送信形式を選び、CLI専用aliasをAPIへ推測適用しません。Haiku 5.5は[公式adaptive thinking仕様](https://platform.claude.com/docs/en/models/haiku-5-5/overview)に合わせます。 |
| Ollama Cloud | [公式OpenAI互換仕様](https://docs.ollama.com/api/openai-compatibility)、[tags](https://docs.ollama.com/api/tags)。キー付き一覧とshowの情報を使い、版・tag付きIDはそのまま保持します。local向け`:cloud`との名前変換はしません。 |
| その他のPi provider | [SDK 1.4.0のprovider実装](https://github.com/earendil-works/pi/tree/v1.4.0/packages/ai/src/providers)を維持。42 provider、1,599 chat定義の静的メタデータを取得しました。各社の認証済みliveモデルAPIを全件照合した結果ではありません。 |

モデル一覧、モデル能力、アカウントの利用権限、実生成成功は別の確認です。静的SDK一覧と公開Pi一覧はアカウント権限の証拠ではありません。新しい動的モデルは初期オフ、既存のON/OFF、Fast、Thinking、明示モデル・能力上書きは保持します。未対応protocolや送信先はスキップし、未知の能力を推測して追加しません。

## 最小修正

- Pi SDK 1.4.0を実際に同梱し、版固定・置換箇所数・最終JSON検証を維持して既存stream patchを適合。
- DSH 0.2.2-alpha.2のsystem message変換を取り込み。非対応モデルでは履歴内の位置を保ったsystem-reminderへ変換し、対応モデルはnative system roleを維持。
- Codexの確認済み非対応2 IDを、取得・保存済み一覧の両経路で除外。保存済み選択設定は消さず、OpenAI APIの候補には影響させません。
- CommandCodeのHaiku 5.5にadaptive thinkingを指定。Haiku 4.5は従来のbudget方式を維持。
- 新規Piモデルの`requiresReasoningContentOnAssistantMessages`を保持。SDKが読む正しいfield名を通し、文字列など不正な型は採用しません。
- Issue #51：成功確認済みの更新記録がある場合に、健全な導入版と実行版の一致した手動rollbackを照合して更新確認へ戻します。実行版不一致、結果不明、失敗・取消・復帰失敗、不健全な導入状態ではこの判定を適用しません。旧記録を保持し、日英の表示を上方変更・rollback両方に合う「別の版」へ修正します。

Pi 1.4.0で追加されたMiniMax M3.1 Flashのlow〜maxと、xAI Grok 4.3/4.5のxhighも、実SDKのカタログ・選択可能effortで確認します。[公式変更履歴](https://github.com/earendil-works/pi/blob/v1.4.0/packages/ai/CHANGELOG.md#140---2026-10-21)

## 検証の区別

実SDKのstreamとHTTP送信内容は、ローカルSSE・fetch fixtureで検査します。公式DSHの型・Cordis・Authorization・Credentials・Connectionとの結合、隔離プロファイルへの配布tgz導入・起動・設定保持を別に検査します。これらを実サービスへのログイン・推論・課金・契約枠の確認とは扱いません。

`npm test`は344件成功、失敗・skipとも0。`npm run build`、`test:compat`、`test:runtime`、`test:peers`、Chromiumの`test:browser`、`pack:plugin`も成功しました。rc.2の隔離Hostで起動、接続CRUD、Credentials保存、移行、再起動、モデル選択、削除を確認し、alphaでも起動を確認しました。rc.2の導入検査はlive Release照合を省略したfunctional harnessであり、完全な`test:install`成功とはしません。Issue #51固有のrollbackはmock manager・一時profileと実UpdateControllerで検査しています。

別環境の統合検証では、11プラグインを併用するrc.2の独立smokeで同時登録、停止・再有効化、再接続を確認しました。分離prefix構成の依存解決差によるpeer警告は残っています。Host版は対応範囲内ですが、警告が解消したとは扱いません。

実アカウントへのログイン、資格情報取得、有料推論、Contributorの実利用枠、各社の認証済み最新モデル一覧、全OS・全機能の組合せは未実施です。ローカルのlive Release照合は`api.github.com`への通信規則による403で実行できませんでした。
