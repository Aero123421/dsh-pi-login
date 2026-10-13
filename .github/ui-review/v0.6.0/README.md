# 0.6.0 UI comparison

Linux Chromiumで公式DSH UI部品と認証済みHost Connectionを使用したfixtureです。実アカウント・OS実機の証拠ではありません。

既存の「設定 → モデル」動線とnative primitivesを保ち、footerに接続・モデルと利用状況を集約しました。provider-cardの重複ログイン欄を取り除き、サービス別の折りたたみ、接続名、検索、詳細画面へ整理しています。Muse CodeはPi Meta Model APIと別に、モデル選択・Contributorの同意を表示します。

| 幅 / テーマ | 変更前 | 変更後 | Muse Contributor |
| --- | --- | --- | --- |
| 390px / light | ![変更前](before-390-light.png) | ![変更後](after-390-light.png) | ![Muse Contributor](muse-390-light.png) |
| 390px / dark | ![変更前](before-390-dark.png) | ![変更後](after-390-dark.png) | ![Muse Contributor](muse-390-dark.png) |
| 768px / light | ![変更前](before-768-light.png) | ![変更後](after-768-light.png) | ![Muse Contributor](muse-768-light.png) |
| 768px / dark | ![変更前](before-768-dark.png) | ![変更後](after-768-dark.png) | ![Muse Contributor](muse-768-dark.png) |
| 1440px / light | ![変更前](before-1440-light.png) | ![変更後](after-1440-light.png) | ![Muse Contributor](muse-1440-light.png) |
| 1440px / dark | ![変更前](before-1440-dark.png) | ![変更後](after-1440-dark.png) | ![Muse Contributor](muse-1440-dark.png) |

キーボードのTab・フォーカス復帰、44px程度の操作領域、390×760pxの同意画面、50接続の検索を確認しました。モデル画面を開くだけで利用状況や生成を要求せず、Contributorはチェックボックスで同意するまで保存できません。

![同意前の状態](muse-consent-required-mobile.png)
![キーボードのフォーカス復帰](keyboard-return-focus.png)
![利用状況](usage-mobile.png)

WebKitの取得はネットワークポリシーで拒否されました。Safari、Windows/macOS/iPad実機、Tailscale、スクリーンリーダー実機は未検証です。
