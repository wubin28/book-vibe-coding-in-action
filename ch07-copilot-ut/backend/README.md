# 单元测试说明文档

## 项目结构

```
src/
├── __tests__/
│   └── server.test.ts   # 单元测试文件
├── index.ts             # 应用入口点
└── server.ts            # 后端主要逻辑
.env                     # 环境变量
jest.config.js           # Jest配置
package.json             # 项目依赖
tsconfig.json            # TypeScript配置
```

## 安装步骤

1. 确保你已安装Node.js（推荐v16+）和npm

2. 安装依赖项：
```bash
npm install
```

3. 设置环境变量：
在项目根目录创建`.env`文件并添加以下内容：
```
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
```

## 运行测试

执行以下命令运行单元测试：
```bash
npm test
```

## 项目说明

### 依赖注入设计

本项目使用InversifyJS作为依赖注入容器，使组件解耦并提高可测试性。主要组件包括：

1. **IOpenAIClient接口**：定义了OpenAI客户端的契约

2. **ApiService类**：处理与DeepSeek API的交互逻辑

3. **依赖注入容器**：在`setupContainer()`函数中配置

### 测试策略

测试采用了以下策略：

1. **模拟外部依赖**：使用jest-mock-extended模拟OpenAI客户端和Express响应

2. **验证正确调用**：确保以正确的参数调用DeepSeek API

3. **验证错误处理**：测试API调用失败时的错误处理逻辑

## 扩展建议

1. 添加更多单元测试，覆盖路由处理逻辑
2. 增加集成测试，使用supertest测试HTTP端点
3. 实现日志记录服务，便于调试和监控

## 注意事项

- 本项目使用ES模块规范
- 确保tsconfig.json中的配置正确支持装饰器
- 测试环境运行在Node.js环境，而非浏览器环境