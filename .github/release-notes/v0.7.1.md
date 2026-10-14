# 0.7.1

保存済みのAI接続がある状態でDSHを再起動すると、プラグインが起動に失敗し、「Could not load the providers.」と表示される不具合を修正しました。実行中の版が表示されず、接続追加や更新確認も使えなくなる症状が対象です。

原因は、起動途中のプラグインをまだ列挙しないHostの設定サービスから、保存済み接続を読もうとしていたことです。接続の読み取りをプラグイン自身のlive Configへ変更し、設定の保存・revision照合は引き続きHostの設定サービスで行います。接続・認証情報・モデル設定を削除する必要はありません。

## エラー画面からの復旧

プラグイン自身の「更新を確認」が使えない場合は、DSH標準のプラグイン管理から `github:Aero123421/dsh-pi-login` を再導入し、DSHを再起動してください。特定の版を固定して使う場合はこのReleaseのtgzを導入してください。設定やCredentialsの削除、プラグインのアンインストールは不要です。

CLIでWeb profileへ導入している場合の例:

```sh
dsh plugin --profile web add -w github:Aero123421/dsh-pi-login
```

## 検証

修正前の0.7.0では、実DSH 0.2.1-alpha.2にAPIキー接続を保存したまま再起動すると `connection-unavailable` で起動が失敗し、プラグインRPCが404になることを再現しました。修正後は同じ条件で接続一覧と実行版を取得できました。

導入テストを変更し、保存したAPIキー接続とMuse Code接続を残した再起動を必須にしました。実Credentialsの認証状態、旧CLI形式のMuse設定、保存済みモデル一覧・Contributor選択、profile世代更新を確認します。新規profileの初回起動、接続CRUD・複製・削除、単体テスト147件、公式Hostとの互換性、実Pi SDKによるローカルruntime fixtureも検証します。Release workflowでは画面テスト・配布チェックサム・オンラインの公開Release照合まで成功してから公開します。

実アカウントでのMuse生成・課金とOS実機は未検証です。
