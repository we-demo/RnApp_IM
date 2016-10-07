# AwesomeProject

## Roadmap

- [x] 聊天消息 + 输入框
- [x] 键盘弹出 布局调整
- [ ] 输入框多行自动撑高
- [x] WebSocket + Server
- [x] 模拟器 + 真机调试
- [ ] 打包发布
- [ ] i18n

## Troubleshootings

- [如何配置React Native真机调试-iOS](http://www.open-open.com/lib/view/open1456707122859.html) -- 开发者证书、设备信任证书
- [Building your app for production](https://facebook.github.io/react-native/docs/running-on-device-ios.html#building-your-app-for-production) -- Project -> Scheme -> Edit Scheme -> Build Configuration = Release
- App ID with Identifier 'xxx' is not available -- ios/XXX.xcodeproj/project.pbxproj 替换四处PRODUCT_BUNDLE_IDENTIFIER
- 报错 INVALID_STATE_ERR 后卡住不动 -- 检查Websocket是否为localhost或错误IP
- [OSX上安卓模拟器如何打开调试菜单](http://stackoverflow.com/a/37497678) -- Cmd+M
- [Enabling the Gradle Daemon](https://docs.gradle.org/2.14.1/userguide/gradle_daemon.html#N10473)
- [Generating Signed APK ](https://facebook.github.io/react-native/docs/signed-apk-android.html)
- [Handling the Keyboard in React Native](http://blog.arjun.io/react-native/mobile/cross-platform/2016/04/01/handling-the-keyboard-in-react-native.html)
