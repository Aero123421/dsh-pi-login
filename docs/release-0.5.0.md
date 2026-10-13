# 0.5.0

「設定 → モデル」のPi共通欄にプラグイン更新確認を追加しました。モデル一覧の再取得とは別操作です。候補・変更内容・対応DSHを確認してから更新できます。

- 正式Releaseの固定タグまたは検証済みtgzを標準plugin managerへ渡します。GitHub／tgzの導入経路とbundleのON/OFFを維持し、build scriptの許可を自動追加しません。
- ログイン・設定保存の途中には更新しません。既存の`llm-pi-ai`認証情報、provider/model/Fastの選択、SDK、system promptは変更しません。
- 切断後は保存した操作IDとmanager結果を照合します。結果不明、取消、導入失敗、上位設定、再起動待ち、実行版反映を区別します。新しい版が実際に動作し、導入版も一致したときだけ更新済みと表示します。
- manager不在、read-only、開発用導入元、互換性不明では理由と手動更新先を表示します。

検証：unit 64件、build、公式Cordis／認証／Connection互換チェック、runtime／Fastテスト、公式UIのPlaywright（日本語・light/dark・390px・更新候補と再起動待ち・解除）、pack、実DSH 0.2.1-alpha.2の空profileへのtgz導入と再起動後の0.5.0実行版確認が成功しました。実アカウント、Windows・macOS実機は未検証です。公開前の0.5.0 Releaseタグへの自己更新は公開後の確認対象です。
