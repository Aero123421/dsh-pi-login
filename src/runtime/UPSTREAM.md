# 元アダプターと変更点

元ソースは[DeepSeek HarnessのPiアダプター](https://github.com/deepseek-ai/deepseek-harness/tree/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/llm/llm-pi-ai/src)です。MIT、Copyright (c) 2026 DeepSeek。

会話変換、推論設定、ツール履歴、画像、ストリームの処理を引き継いでいます。変更点は次のとおりです。

- Pi SDKをプラグインの依存関係として固定。
- 設定名前空間を`dsh-pi-login`に変更。
- `enabled`と`disabledModels`でプロバイダー・モデルを切り替え、設定変更時にモデル一覧を更新。
- `legacyImported`で既存設定の初回取り込みを記録。
- OpenAI OAuthにインストールIDを渡し、`dsh-pi-login/installation`に保存。
- Device Codeの有効期限通知をプラグインの待機制限に反映。
- MuseのThinking effortは、インストール済みPi SDKのカタログをそのまま継承。独自のモデル名ハードコードは追加しない。
- OpenAI/OpenAI Codexの対応モデルを通常版とFast版の別項目として公開。モデルID・認証・能力は共通で、選択した項目に応じて`service_tier=default`／`priority`を送信。
- Fast版のON/OFFを`enabledFastModels`で保存。設定画面と実行側の一覧は共通の選択処理から生成。
- 履歴の選択IDとAPIモデルIDを分けて保存し、通常版とFast版を切り替えてもPiの推論署名を再利用。

[Fastの実装と参照ソース](../../docs/fast.md)
