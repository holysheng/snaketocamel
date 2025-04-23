// 'vscode' 模块包含 VS Code 扩展 API
// 导入此模块并在下面的代码中使用别名 vscode 引用它
import * as vscode from 'vscode';
import { camelToSnake, isAllLowerCase, isAllUpperCase, isUpperSnakeCase, snakeToCamel } from './utils';

// 当扩展被激活时调用此方法
// 您的扩展在第一次执行命令时被激活
export function activate(context: vscode.ExtensionContext) {
  console.log('恭喜，您的扩展 "snaketocamel" 现在已激活！');

  // 命令已在 package.json 文件中定义
  // 现在使用 registerCommand 提供命令的实现
  // commandId 参数必须与 package.json 中的 command 字段匹配
  const disposable = vscode.commands.registerCommand('snaketocamel.toggleCase', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const document = editor.document;
    const selection = editor.selection;

    // 获取光标位置
    const position = selection.active;

    // 获取光标下单词的范围
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      return;
    }
    // 获取单词文本
    const word = document.getText(wordRange);

    // 判断命名方式并生成新名称
    let newWord: string;

    // 检查命名风格并转换
    if (word.includes('_')) {
      if (isUpperSnakeCase(word)) {
        // 从 SNAKE_CASE 转为 camelCase
        newWord = snakeToCamel(word.toLowerCase());
      } else {
        // 从 snake_case 转为 SNAKE_CASE
        newWord = word.toUpperCase();
      }
    } else if (isAllLowerCase(word) && !word.includes('_')) {
      // 纯小写转为纯大写
      newWord = word.toUpperCase();
    } else if (isAllUpperCase(word) && !word.includes('_')) {
      // 纯大写转为纯小写
      newWord = word.toLowerCase();
    } else {
      // 从 camelCase 转为 snake_case
      newWord = camelToSnake(word);
    }

    try {
      // 使用重构API执行重命名操作
      // 创建一个重命名编辑并应用它
      const workspaceEdit = new vscode.WorkspaceEdit();
      const uri = document.uri;

      // 获取所有引用位置
      const locations = await vscode.commands.executeCommand<vscode.Location[]>(
        'vscode.executeReferenceProvider',
        uri,
        position
      );

      if (locations && locations.length > 0) {
        // 在所有引用位置进行替换
        for (const location of locations) {
          const range = location.range;
          workspaceEdit.replace(location.uri, range, newWord);
        }
      } else {
        // 如果找不到引用，至少替换当前位置
        workspaceEdit.replace(uri, wordRange, newWord);
      }

      // 应用编辑
      const success = await vscode.workspace.applyEdit(workspaceEdit);

      if (success) {
        // 使用状态栏消息，只显示1秒
        vscode.window.setStatusBarMessage(`已将 "${word}" 重命名为 "${newWord}"`, 1000);
      } else {
        throw new Error('重命名失败');
      }
    } catch (error) {
      console.error('重命名操作失败', error);
      vscode.window.showErrorMessage(`重命名失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  });

  context.subscriptions.push(disposable);
  console.log('扩展激活完成，命令已注册');
}

// 当扩展被停用时调用此方法
export function deactivate() { }

// 重新导出工具函数，以保持向后兼容性
export { camelToSnake, isAllLowerCase, isAllUpperCase, isUpperSnakeCase, snakeToCamel } from './utils';
