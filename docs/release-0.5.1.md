# 0.5.1

更新操作の照合と導入直前の確認を修正しました。

- 同じブラウザーでプロファイルを切り替えても、別プロファイルの操作IDを照合しません。認証済みHostの不透明な識別子で保存を分け、元プロファイルで最初の応答を失った操作は保持します。遅れて届く応答や別プロファイル宛ての要求は受け入れません。
- 他の画面が開始した最新操作を優先し、古い操作の保存で最新記録を上書きしません。
- 記録保存後にも導入済みの版・導入元・ON/OFFを再確認し、他画面で導入した新版を下げません。再起動の案内にはmanagerの結果と実際の導入版の一致が必要です。
- 導入キャンセルはpackage processの非ゼロ終了より優先し、実際のキャンセル結果を表示します。

ログイン、credential、provider/model/Fastの選択、配布元とsystem promptは変更しません。

検証：`npm test`（73件）、`npm run build`、`npm run test:compat`、`npm run test:runtime`、`npm run test:browser`、`npm run pack:plugin`、`npm run test:install`が成功しました。ブラウザー確認はChromiumを明示し、実DSHの空profileへのtgz導入、実行版0.5.1とlive Release確認を含みます。Windows・macOS実機、公開前の0.5.1タグへの自己更新は未検証です。
