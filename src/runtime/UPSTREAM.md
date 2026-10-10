# Piアダプターの由来

このディレクトリはDeepSeek HarnessのPiアダプターを基にしています。

- 元ソース: https://github.com/deepseek-ai/deepseek-harness/tree/d743267388641bc76f17c45ce8b4c231aed1d32c/packages/llm/llm-pi-ai/src
- ライセンス: MIT、Copyright (c) 2026 DeepSeek
- Pi SDKの依存関係: このプラグインのpackage.jsonで固定し、DS本体のPiとは別に更新します。

元の会話変換、推論設定、ツール履歴、画像処理、ストリーム処理を維持しています。変更は、設定の名前空間を`dsh-pi-login`にすること、`enabled`と`disabledModels`を認識すること、設定変更でモデル一覧を更新すること、既存設定の初回取り込みを記録することです。

OpenAIのOAuthにはプラグイン用のインストールIDを渡します。IDはCredentialsサービスの`dsh-pi-login/installation`に保存し、ログイン情報とは分けています。PiがOAuthプロトコルを所有し、このディレクトリで認証先やトークン処理を複製しません。

DSの更新時には、このソースと元アダプターとの差分を確認します。SDKの更新は`npm run update:pi`で行い、アダプター互換性を検証してから配布します。
