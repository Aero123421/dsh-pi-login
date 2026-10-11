# 元アダプターと変更点

元ソースは[DeepSeek HarnessのPiアダプター](https://github.com/deepseek-ai/deepseek-harness/tree/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/llm/llm-pi-ai/src)です。MIT、Copyright (c) 2026 DeepSeek。

会話変換、推論設定、ツール履歴、画像、ストリームの処理を引き継いでいます。変更点は次のとおりです。

- Pi SDKをプラグインの依存関係として固定。
- 設定名前空間を`dsh-pi-login`に変更。
- `enabled`と`disabledModels`でプロバイダー・モデルを切り替え、設定変更時にモデル一覧を更新。
- `legacyImported`で既存設定の初回取り込みを記録。
- OpenAI OAuthにインストールIDを渡し、`dsh-pi-login/installation`に保存。
- Device Codeの有効期限通知をプラグインの待機制限に反映。
- Meta Muse Spark 1.3のStandard/Contributor別の推論強度を公式仕様に合わせ、Standardの`Max`を公開。`reasoningEfforts`明示上書きは優先。
- OpenAI/OpenAI Codexの対象GPTモデルにFast（`service_tier=priority`）をオプトインで追加。Pi SDK 1.1.0の`streamSimple()`はティア指定を引き継がないため、Fast時だけ`Models.stream()`と通常の共通オプションを利用。
- Fastのモデル別ON/OFF、DSH Web UIとConnection経由の認証済み設定保存を追加。

OAuthとトークン処理にはPi SDKを使います。DSとSDKの更新手順は[開発ガイド](../../docs/development.md)を参照してください。
