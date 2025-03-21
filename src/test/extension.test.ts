import * as assert from 'assert';

// 你可以从 'vscode' 模块导入和使用所有 API
// 也可以导入你的扩展进行测试
import * as vscode from 'vscode';
import { camelToSnake, snakeToCamel } from '../extension';

suite('扩展测试套件', () => {
  vscode.window.showInformationMessage('开始所有测试。');

  test('蛇形转驼峰测试', () => {
    assert.strictEqual(snakeToCamel('user_name'), 'userName');
    assert.strictEqual(snakeToCamel('first_login_time'), 'firstLoginTime');
    assert.strictEqual(snakeToCamel('snake_case_string'), 'snakeCaseString');
  });

  test('驼峰转蛇形测试', () => {
    assert.strictEqual(camelToSnake('userName'), 'user_name');
    assert.strictEqual(camelToSnake('firstLoginTime'), 'first_login_time');
    assert.strictEqual(camelToSnake('camelCaseString'), 'camel_case_string');
  });
});