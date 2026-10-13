# 0.6.1

Muse Codeのログイン開始を妨げていた不具合を修正し、AI接続画面を簡素化しました。

- 公式Muse Code CLI 1.4.7のContributor設定キー `contributor_mode_enabled` と未設定の値に対応しました。macOSのFinderやDockから起動したHostでも、公式インストーラーの既定配置 `~/.local/bin/muse` を探します。
- CLIに必要なメソッドがない場合と、その他の通信・実行エラーを区別して表示します。OAuth認証保存時の `api_key` は任意としました。
- 接続一覧に名前・認証方法・状態・オン/オフ・モデル操作をまとめました。接続名から状態、利用状況、設定、複製、削除を開けます。
- OAuthは「追加してログイン」で認証を開始し、成功すると接続をオンにします。接続がオフのままでもモデルを選べます。Muse Codeのモデルは単一選択で、選ぶと保存します。
- 日時はUI言語で表示し、タッチ端末の操作領域と秘密入力欄の自動入力抑制を調整しました。
- 検証用の公式ソース生成を原子的に書き込み、並列テストで空のモジュールを読む競合を修正しました。

PR #23のGitHub Actionsでは、ビルド済みファイルの再現性、単体テスト167件、公式Hostとの互換性、実SDKを使うローカルruntime fixture、Chromiumの390/768/1440px・light/dark、配布パッケージ、実DSH 0.2.1-alpha.2への独立した空profile導入・再起動・接続CRUD・公開Release照合が成功しています。Release workflowでも同じ検証を実行してから配布ファイルとSHA256SUMSを公開します。

PRでは実Muse CLI 1.4.7-R6101.1からログインURLとユーザーコードを返すところまで確認されています。実アカウントでの承認・ログイン完了、Wonder1/Full生成、Contributor枠・課金、Windows/macOS実機、Safari/iPad PWAは未検証です。Muse Codeの通常DSH LLMへのtool bridgeは引き続き未検証です。

変更元: https://github.com/Aero123421/dsh-pi-login/pull/23
