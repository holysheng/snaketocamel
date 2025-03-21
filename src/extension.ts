// 'vscode' 模块包含 VS Code 扩展 API
// 导入此模块并在下面的代码中使用别名 vscode 引用它
import * as vscode from 'vscode';

// 当扩展被激活时调用此方法
// 您的扩展在第一次执行命令时被激活
export function activate(context: vscode.ExtensionContext) {

  // 使用控制台输出诊断信息 (console.log) 和错误 (console.error)
  // 此代码行仅在扩展被激活时执行一次
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
    if (word.includes('_')) {
      // 从snake_case转为camelCase
      newWord = snakeToCamel(word);
    } else {
      // 从camelCase转为snake_case
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
}

// 将snake_case转换为camelCase
export function snakeToCamel(word: string): string {
  return word.replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase());
}

// 将camelCase转换为snake_case
export function camelToSnake(word: string): string {
  return word.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

// 当扩展被停用时调用此方法
export function deactivate() { }
