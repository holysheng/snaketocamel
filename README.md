# 蛇形驼峰命名转换

这个VSCode扩展可以帮助你在编辑代码时快速切换变量命名风格，在蛇形命名法（snake_case）和驼峰命名法（camelCase）之间互相转换。

## 特点

- 直接在光标下的单词上操作，无需选中单词
- 智能判断当前的命名风格并自动转换
- 可通过快捷键快速切换命名风格
- 自动使用VSCode的重构功能，更新所有引用

## 使用方法

1. 将光标放在需要转换的变量名上（不需要选中）
2. 按下快捷键 `Ctrl+Shift+U`（在Mac上是 `Cmd+Shift+U`）或通过命令面板执行`切换命名风格（蛇形/驼峰）`命令
3. 变量名将自动在snake_case和camelCase之间切换，并且所有引用都会被更新

### 重构功能

插件默认使用重构功能，会：
1. 自动分析当前光标下单词的命名风格
2. 生成对应的新命名风格（蛇形转驼峰或驼峰转蛇形）
3. 自动查找并更新所有引用位置，完成重构
4. 无需用户手动操作，自动完成整个过程

这种方式会同时更新所有引用，非常适合重命名变量、函数等标识符。

## 示例

- `user_name` ↔ `userName`
- `first_login_time` ↔ `firstLoginTime`
- `camelCase` ↔ `camel_case`