// 将snake_case转换为camelCase
export function snakeToCamel(word: string): string {
  // 修复以下划线开头的情况
  if (word.startsWith('_')) {
    return '_' + word.substring(1).replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase());
  }
  return word.replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase());
}

// 将camelCase转换为snake_case
export function camelToSnake(word: string): string {
  return word.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

// 检查是否为全大写的SNAKE_CASE
export function isUpperSnakeCase(word: string): boolean {
  return word === word.toUpperCase() && word.includes('_');
}

// 检查是否全为小写
export function isAllLowerCase(word: string): boolean {
  return word === word.toLowerCase() && !word.includes('_');
}

// 检查是否全为大写
export function isAllUpperCase(word: string): boolean {
  return word === word.toUpperCase() && !word.includes('_');
}
