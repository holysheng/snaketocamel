import { 
  snakeToCamel, 
  camelToSnake, 
  isUpperSnakeCase,
  isAllLowerCase,
  isAllUpperCase
} from '../src/utils';
import { describe, expect, test } from '@jest/globals';

describe('命名风格转换函数测试', () => {
  describe('snakeToCamel', () => {
    test('应该将 snake_case 转换为 camelCase', () => {
      expect(snakeToCamel('hello_world')).toBe('helloWorld');
      expect(snakeToCamel('user_name')).toBe('userName');
      expect(snakeToCamel('api_request_url')).toBe('apiRequestUrl');
      expect(snakeToCamel('_private_var')).toBe('_privateVar');
    });

    test('应该处理连续的下划线', () => {
      expect(snakeToCamel('hello__world')).toBe('hello_World');
      expect(snakeToCamel('multiple___underscores')).toBe('multiple__Underscores');
    });

    test('应该保持原样如果没有下划线', () => {
      expect(snakeToCamel('hello')).toBe('hello');
      expect(snakeToCamel('alreadyCamel')).toBe('alreadyCamel');
    });
  });

  describe('camelToSnake', () => {
    test('应该将 camelCase 转换为 snake_case', () => {
      expect(camelToSnake('helloWorld')).toBe('hello_world');
      expect(camelToSnake('userName')).toBe('user_name');
      expect(camelToSnake('apiRequestUrl')).toBe('api_request_url');
    });

    test('应该处理首字母大写的单词', () => {
      expect(camelToSnake('HelloWorld')).toBe('hello_world');
      expect(camelToSnake('UserName')).toBe('user_name');
    });

    test('应该保持原样如果没有大写字母', () => {
      expect(camelToSnake('hello')).toBe('hello');
      expect(camelToSnake('world')).toBe('world');
    });
  });

  describe('命名风格判断函数', () => {
    describe('isUpperSnakeCase', () => {
      test('应该正确识别 SNAKE_CASE', () => {
        expect(isUpperSnakeCase('HELLO_WORLD')).toBe(true);
        expect(isUpperSnakeCase('USER_NAME')).toBe(true);
        expect(isUpperSnakeCase('API_URL')).toBe(true);
      });

      test('应该返回 false 对于非 SNAKE_CASE', () => {
        expect(isUpperSnakeCase('hello_world')).toBe(false);
        expect(isUpperSnakeCase('helloWorld')).toBe(false);
        expect(isUpperSnakeCase('HELLO')).toBe(false); // 没有下划线
      });
    });

    describe('isAllLowerCase', () => {
      test('应该正确识别全小写单词', () => {
        expect(isAllLowerCase('hello')).toBe(true);
        expect(isAllLowerCase('world')).toBe(true);
        expect(isAllLowerCase('test')).toBe(true);
      });

      test('应该返回 false 对于非全小写单词', () => {
        expect(isAllLowerCase('Hello')).toBe(false);
        expect(isAllLowerCase('helloWorld')).toBe(false);
        expect(isAllLowerCase('hello_world')).toBe(false);
      });
    });

    describe('isAllUpperCase', () => {
      test('应该正确识别全大写单词', () => {
        expect(isAllUpperCase('HELLO')).toBe(true);
        expect(isAllUpperCase('WORLD')).toBe(true);
        expect(isAllUpperCase('TEST')).toBe(true);
      });

      test('应该返回 false 对于非全大写单词', () => {
        expect(isAllUpperCase('Hello')).toBe(false);
        expect(isAllUpperCase('helloWorld')).toBe(false);
        expect(isAllUpperCase('HELLO_WORLD')).toBe(false); // 包含下划线
      });
    });
  });

  describe('命名风格转换流程测试', () => {
    function transformWord(word: string): string {
      // 模拟 extension.ts 中的转换逻辑
      if (word.includes('_')) {
        if (isUpperSnakeCase(word)) {
          // 从 SNAKE_CASE 转为 camelCase
          return snakeToCamel(word.toLowerCase());
        } else {
          // 从 snake_case 转为 SNAKE_CASE
          return word.toUpperCase();
        }
      } else if (isAllLowerCase(word) && !word.includes('_')) {
        // 纯小写转为纯大写
        return word.toUpperCase();
      } else if (isAllUpperCase(word) && !word.includes('_')) {
        // 纯大写转为纯小写
        return word.toLowerCase();
      } else {
        // 从 camelCase 转为 snake_case
        return camelToSnake(word);
      }
    }

    test('应该按照 camelCase -> snake_case -> SNAKE_CASE -> camelCase 顺序转换', () => {
      // 从 camelCase 开始
      const camelCase = 'helloWorld';
      
      // 第一次转换：camelCase -> snake_case
      const snakeCase = transformWord(camelCase);
      expect(snakeCase).toBe('hello_world');
      
      // 第二次转换：snake_case -> SNAKE_CASE
      const upperSnakeCase = transformWord(snakeCase);
      expect(upperSnakeCase).toBe('HELLO_WORLD');
      
      // 第三次转换：SNAKE_CASE -> camelCase
      const backToCamelCase = transformWord(upperSnakeCase);
      expect(backToCamelCase).toBe('helloWorld');
    });

    test('应该在纯小写和纯大写之间转换', () => {
      // 从小写开始
      const lowercase = 'hello';
      
      // 第一次转换：小写 -> 大写
      const uppercase = transformWord(lowercase);
      expect(uppercase).toBe('HELLO');
      
      // 第二次转换：大写 -> 小写
      const backToLowercase = transformWord(uppercase);
      expect(backToLowercase).toBe('hello');
    });
  });
});
