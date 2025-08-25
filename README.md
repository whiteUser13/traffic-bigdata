# HTC-TransportBigData-Vue

该仓库存储HTC团队交通融合大数据可视化系统的前端部分，此README将声明此仓库的规范。

在使用本仓库之前，请先学习**版本控制工具** `Git` 和 **代码托管平台** `Github` 的基本使用。

## 1 仓库克隆

建议使用SSH方式克隆仓库，而非HTTP。

## 2 仓库提交

你的Commit应该规范、易读，以下为commit的基本格式：

`<type>(<scope>): <subject>`

- `type`：提交的类型，用来说明提交的性质，常见的类型包括：

  - `feat`：新增功能

  - `fix`：修复 bug

  - `docs`：仅仅修改文档

  - `style`：不影响代码含义的更改（空格、格式、缺少分号等）

  - `refactor`：在不改变代码外在行为的前提下，对代码做出修改，以改进程序的内部结构

  - `test`：增加测试

  - `chore`：构建过程或辅助工具的变动

- `scope`：影响的范围或模块。它指明此次提交影响的代码范围。范围可以是文件名，如`src/store/index.js`，也可以是模块名称，如`Data Space`。如果是针对全局的更改，建议使用`all`。

- `subject`：使用祈使句简洁的描述本次提交的内容。

以下是一些常用的例子：

- 新增功能：`feat(user-profile): 添加头像上传功能`

- 修复 bug： `fix(auth): 修复密码哈希函数`

- 修改文档：`docs(readme): 更新部署流程`

- 代码风格调整：`style(button): 调整了按钮的border-radius`

- 重构代码：`refactor(user-service): 简化数据获取逻辑`

额外规则：

1. Breaking Changes（可选）：如果提交中有破坏性变更，必须在提交信息的最后增加 `BREAKING CHANGE` 并说明变更内容。例如：

```
feat(auth): 添加TOKEN处理
BREAKING CHANGE: 变更TOKEN授权方式，在授权之前需要额外验证步骤
```