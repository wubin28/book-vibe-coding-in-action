# 《Vibe编程实战》（Vibe Coding in Action）配套代码

《Vibe编程实战》（Vibe Coding in Action）是一本讲解如何依靠AI编写代码的编程实用指南，面向非IT背景人士、资深IT人士和IT新人。全书通过7个实战案例——批量修改文件名、将Markdown文档转换为Word格式、"一键减少AI幻觉"扣子应用、Excel数据可视化、Excel数据分析、Web应用原型和前后端分离Web应用开发，全面展示Vibe编程的实战技巧与避坑策略。不同于市面上仅面向专业开发者的图书，本书首次面向广大受众，既包含适合个人的快速项目开发流程，也涵盖从需求分析到代码评审的完整企业开发流程，让任何人都能运用Vibe编程快速解决实际问题，实现“人人皆可Vibe编程”的愿景。

## 目录（持续更新中）

```plaintext
序言
前言
Vibe编程的价值
目标读者
如何阅读
本书配套代码
致谢
作者简介
技术审稿者简介

第1章 颠覆传统的Vibe编程
1.1 用豆包批量改文件名
1.2 用灵码IDE将Markdown文档转为Word
1.3 什么是Vibe编程
1.4 Vibe编程极简史
1.5 如何颠覆传统
1.6 代码生成的原理
1.7 比代码还重要的提示词
1.8 Vibe编程的风险
1.8.1 Vibe编程的四个典型场景
1.8.2 Vibe编程工具像孙悟空
1.9 Vibe编程完整过程
1.10 用实战体验Vibe编程

第2章 用扣子实现提示词优化应用
2.1 “一键减少AI幻觉”应用需求分析
2.2 编排
2.3 预览
2.4 发布
2.5 试用
2.6 分享

第3章 用DeepSeek可视化Excel数据
3.1 需求分析
3.2 生成HTML代码
3.3 运行HTML代码
3.4 浏览HTML代码
3.5 增加需求

第4章 用元宝分析Excel数据
4.1 需求分析
4.2 生成Python代码
4.3 运行Python代码
4.4 浏览Python代码
4.5 增加需求

第5章 用bolt、Trae和Cursor快速实现产品原型
5.1 Promptyoo-1 Web应用需求分析
5.1.1 描述业务需求
5.1.2 将业务需求转为PRD时踩坑
5.1.3 让AI提供软件架构与技术栈建议
5.2 在Vibe需求中包含严格技术栈要求时踩坑
5.3 用bolt的Enhance prompt时踩坑
5.3.1 用bolt直接导入Figma线框图时踩坑
5.3.2 从Cursor生成的架构图中得到启发
5.3.3 在bolt提示词中插入Figma线框图时踩坑
5.4 用bolt单次对话成功生成第一阶段Vibe需求代码
5.5 用Claude更换Vibe需求持久化方案时踩坑
5.6 用bolt单次对话成功生成两个阶段Vibe需求代码
5.7 用Cursor生成C4 model架构图
5.8 用Trae修复Next.js应用中的Bug
5.8.1 修复1个严重偏离预期的Bug
5.8.2 补充实现2个尚未实现的功能与项目rule文件
5.8.3 修复1个API密钥安全性问题

第6章 用GitHub Copilot实现前后端分离Web应用
6.1 Promptyoo-0 Web应用需求分析
6.2 架构设计与Ask模式
6.2.1 前后端分离的架构
6.2.2 用Ask子模式获取架构建议
6.2.3 自动生成提交信息
6.3 任务拆解
6.4 用户界面与Vision
6.4.1 拼凑用户界面
6.4.2 为拼凑界面生成文字描述
6.5 用bolt生成React前端代码
6.5.1 在本地电脑运行前端
6.5.2 看懂前端代码与/explain和#codebase
6.5.3 格式化代码
6.5.4 用Inline Chat的/doc为代码加注释
6.5.5 用Inline Chat的/fix修复问题
6.6 Node.js后端代码
6.6.1 备好发给后端的提示词与Edit子模式
6.6.2 生成后端代码与Agent子模式
6.6.3 修复运行错误与@terminal
6.6.4 点按钮无反应与Ask子模式下的/fix
6.7 实现流式响应功能与Exclude Files

第7章 用GitHub Copilot保护代码逻辑不被破坏
7.1 前端单元测试
7.1.1 搭建测试框架与/setupTests
7.1.2 验证按钮的前端单元测试与/tests
7.1.3 验证前端单元测试的保护效果
7.1.4 生成其他关键前端单元测试
7.2 后端单元测试
7.2.1 用/setupTest时踩坑
7.2.2 用Claude聊天机器人时踩坑
7.2.3 换思路用好Claude聊天机器人
7.2.4 验证后端单元测试的保护效果
7.3 代码评审
7.3.1 软件架构可视化与/explain
7.3.2 用Review and Comment评审代码

第8章 用实战来体验Vibe编程
8.1 非IT背景人士皆可Vibe编程
8.2 资深IT人士视Vibe编程工具如悟空
8.3 IT新人插上Vibe编程的翅膀
8.4 Vibe编程工具使用技巧与避坑指南
8.4.1 豆包
8.4.2 扣子
8.4.3 DeepSeek
8.4.4 元宝
8.4.5 Lovable
8.4.6 Trae
8.4.7 GitHub Copilot
8.4.8 Claude聊天机器人

附录
附录1.1 使用终端
附录1.2 下载本书配套代码
附录1.3 安装或升级Visual Studio Code
附录6.1 在Visual Studio Code中安装或升级插件
GitHub Copilot
Markdown Preview Mermaid Support
附录6.2 Linear MCP服务器的配置
附录6.3 安装git
附录6.4 在个人目录解压zip包
附录6.5 在Visual Studio Code内置终端运行命令npm
附录6.6 在Visual Studio Code内置终端运行命令时出错
```

## 版权许可协议

[《Vibe编程实战》（Vibe Coding in Action）](https://github.com/wubin28/book-vibe-coding-in-action) © 2025 作者 [吾真本](https://github.com/wubin28) 采用 [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1) 许可协议

本书采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议（CC BY-NC-ND 4.0）进行许可。

该协议允许你分享本书，但有以下严格限制：

- 署名（BY）：分享时必须注明吾真本为原作者，不得隐瞒或更改此信息。
- 非商业性使用（NC）：本书仅限非商业用途，不得用于盈利或商业项目。
- 禁止演绎（ND）：你可以分享本书的原始版本，但不得改编、修改或重新创作。换言之，不能对本书内容进行任何改变或添加。

这个协议具体意味着：

- 可以分享，但不得更改：你可以在网上分享本书，但必须保持原样，不得修改任何内容。
- 禁止商业用途：本书不得用于任何商业环境，如广告、出版物或付费项目。
- 保护原作完整性：此协议帮助原作者维护作品的完整性和原创性，防止他人进行二次创作或商业利用。

简而言之，CC BY-NC-ND 4.0 是一个相对严格的协议。它允许自由分享本书，但禁止任何形式的改编或商业利用。

## 本书内容范围与结构

本书共分五部分：

第一部分：用一章介绍Vibe编程的基本情况和发展。

第二部分：用三章分别讲解如何使用扣子、DeepSeek和元宝这三款Vibe编程工具（支持手机、电脑和网页端）完成生活和工作中的常见项目。这部分内容适合所有读者，包括非IT背景人士、资深IT人士和IT新人：

- 提示词优化扣子应用
- Excel数据可视化
- Excel数据分析

第三部分：用一章介绍产品经理如何运用云AI IDE和本地AI原生IDE Vibe编程工具，快速创建Web应用原型。使用的Vibe编程工具包括：

- 云AI IDE：bolt.new
- 本地AI原生IDE：Trae国际版Pro

第四部分：用两章展示IT人士（包括IT新人和资深IT人士）如何利用云AI IDE和配有AI插件的IDE Vibe编程工具，开发一个前后端分离的提示词优化Web应用，从而掌握不熟悉的新技术。使用的Vibe编程工具包括：

- 云AI IDE：bolt.new
- 配有AI插件的IDE：GitHub Copilot

第五部分：用一章总结Vibe编程对非IT背景人士、资深IT人士和IT新人的意义，并为这三类人群提供运用Vibe编程的最佳实践指南

## 写作特点

本书不盲目采信Vibe编程工具厂商的官方文档和网红发布的内容，也不简单罗列网上可查的功能清单，而是通过具体的Vibe编程实战项目（作为暗线），系统讲解非IT背景人士、IT新人和资深IT人士如何利用Vibe编程解决实际问题（作为主线），为读者提供第一手的实践参考资料。

## 1本同类书情况

截至2025年5月中旬，国内外图书市场仅有1本有代表性的相关图书正在创作中：

- 《Vibe Coding: The Future of Programming》；Addy Osmani；计划2025年8月出版；O’Reilly。该书虽已在线提供目录预览和两章试读，但主要面向职业软件开发者，缺乏对非 IT 背景人士如何运用 Vibe 编程解决实际问题的探讨

![Vibe Coding: The Future of Programming](vibe-coding.png)

## 本代码库仓库结构

每章都有独立的目录，包含相应的项目代码示例。结构组织如下：

```
/ch01
...
/ch06-copilot-feat
    ├── /frontend
    ├── /backend
    ├── /prompts
...
```

## 克隆配套代码

```
git clone https://github.com/wubin28/book-vibe-coding-in-action.git

# 或者
# git clone https://gitee.com/wubin28/book-vibe-coding-in-action.git

cd book-vibe-coding-in-action
```

## 如何运行代码

- [运行第5章代码](ch05-bolt-trae/README.md)

- [运行第6章代码](ch06-copilot-feat/README.md)

- [运行第7章代码](ch07-copilot-ut/README.md)

## 贡献

本仓库与书籍创作同步维护。如果你发现任何问题、有改进建议或想要贡献代码，欢迎提出问题或提交拉取请求。

## 如何联系

作者vx: wuzhenben001；备注：vca

祝你vibe编程愉快！✨