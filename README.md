# AwesomeProject

## Roadmap

- [x] 聊天消息 + 输入框
- [x] 键盘弹出 布局调整
- [ ] 输入框多行自动撑高
- [x] WebSocket + Server
- [ ] 真机调试 + 打包发布

## Troubleshootings

- [如何配置React Native真机调试-iOS](http://www.open-open.com/lib/view/open1456707122859.html) -- 开发者证书、设备信任证书
- [Building your app for production](https://facebook.github.io/react-native/docs/running-on-device-ios.html#building-your-app-for-production) -- Project -> Scheme -> Edit Scheme -> Build Configuration = Release
- App ID with Identifier 'xxx' is not available -- ios/XXX.xcodeproj/project.pbxproj 替换四处PRODUCT_BUNDLE_IDENTIFIER
- 报错 INVALID_STATE_ERR 后卡住不动 -- 检查Websocket是否为localhost或错误IP

