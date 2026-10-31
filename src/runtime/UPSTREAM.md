# 元アダプターと変更点

元ソースは[DeepSeek HarnessのPiアダプター](https://github.com/deepseek-ai/deepseek-harness/tree/687f282e8625c6b8d11ff58211a90524be2e4317/packages/llm/llm-pi-ai/src)です。MIT、Copyright (c) 2026 DeepSeek。

会話変換、推論設定、ツール履歴、画像、ストリームの処理を引き継いでいます。変更点は次のとおりです。

- Pi SDKをプラグインの依存関係として固定。
- 設定名前空間を`dsh-pi-login`に変更。
- `enabled`と`disabledModels`でプロバイダー・モデルを切り替え、設定変更時にモデル一覧を更新。
- `legacyImported`で既存設定の初回取り込みを記録。
- OpenAI OAuthにインストールIDを渡し、`dsh-pi-login/installation`に保存。
- Device Codeの有効期限通知をプラグインの待機制限に反映。
- SDK収録済みのMuseモデルは、Thinking effortを含めてPiカタログを継承。SDK未収録のMuse Wonderは[根拠付きの補完カタログ](../../docs/models.md)に追加し、SDK収録後はSDK側の情報を優先。
- Museログインの契約確認と認証済みモデル一覧の再取得を追加。新しい候補は明示的に選択し、設定したモデル一覧とON/OFFを維持。実行時に取得元のアカウントを確認し、通常のAPIキーへ切り替えない。
- OpenAI/OpenAI Codexの対応モデルを通常版とFast版の別項目として公開。モデルID・認証・能力は共通で、選択した項目に応じて`service_tier=default`／`priority`を送信。
- Fast版のON/OFFを`enabledFastModels`で保存。設定画面と実行側の一覧は共通の選択処理から生成。
- 履歴の選択IDとAPIモデルIDを分けて保存し、通常版とFast版を切り替えてもPiの推論署名を再利用。

[Fastの実装と参照ソース](../../docs/fast.md)

- モデル一覧の再取得は`ProviderCatalogs`にプロバイダーごとのセッションを登録し、画面・RPC・一覧の検証・ログイン後の破棄・実行時認証を共通経路で扱う。Museの契約確認、専用ヘッダーと説明文はMeta側の登録処理に置く。新モデルの選択判定には共通の`DISCOVERED_MODEL`タグを使用する。

DSH `0.2.2-alpha.2` / `f3803c96974ad4a94195fb97e5c637e9c2a3afe3` を検証基準にしています。画像の送信と `imageRequestTarget()` は同じ予算・寸法計算を使い、明示した資格情報が欠ける接続はチャットの候補を公開しません。設定画面のモデル一覧は編集用として残します。

同版の会話途中のsystem message変換を取り込み、モデルがネイティブ対応する場合だけsystem roleを渡します。それ以外は元の位置のuser role内へsystem-reminderとして残し、閉じタグをエスケープします。初期system promptと接続ごとのreplay境界は保持します。

Pi 1.4.0のストリーム性能修正と配布方式は [SDKパッチ](../../docs/pi-stream-patch.md) を参照してください。完成したツール引数の `argumentsError` はエラーとして終了し、有効な空引数へ変換しません。
