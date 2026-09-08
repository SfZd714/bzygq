# MCP与企业工具接入 (1)

**MCP与企业工具接入**

MCP（Model Context Protocol，模型上下文协议）是一种用于连接大模型应用与外部工具、资源和上下文的开放协议。它的核心目标不是让模型本身更聪明，而是给 Agent 提供一套标准化的外部能力接入方式，让模型应用可以通过统一接口发现工具、读取资源、使用提示模板，并把调用结果带回执行循环。

前面讲 Tool Calling 时，我们关注的是“一个工具怎么被模型选择、怎么被后端校验和执行”。MCP 关注的是更上层的问题：当企业 Agent 需要接入很多系统时，工具、资源、鉴权、返回格式和上下文如何统一管理。

如果一个银行客服 Agent 只接一个函数，用 Function Calling 直接封装就够了。但真实系统往往要访问业务规则库、信用卡系统、CRM、客服工单、日志平台、文件系统、代码仓库和第三方 API。每个系统都单独硬编码到 Agent 主服务里，后面会很难维护。MCP 的价值，就是把这些外部能力封装成标准化 Server，由 Agent Host 侧通过 MCP Client 统一连接。

# 从接入问题看：为什么不能一直硬编码

早期做 Agent demo，经常是这样接工具：
| Plain TextAgent -> 信用卡系统专用代码Agent -> 业务规则库专用代码Agent -> CRM 专用代码Agent -> 客服工单专用代码Agent -> 日志平台专用代码 |
| --- |

这种方式能跑通，但进入企业项目后会暴露几个问题。

第一，工具发现混乱。Agent 主服务里散落着很多适配代码，模型到底能用哪些工具、每个工具什么时候用、参数格式是什么，很难统一管理。

第二，权限链路混乱。信用卡系统、CRM、工单系统各有自己的权限模型，如果只在 Agent 入口做一次判断，很容易出现下游系统越权查询。

第三，返回格式混乱。一个系统返回 JSON，一个系统返回文档片段，一个系统返回日志文本，模型拿到的上下文不稳定，也不利于审计。

第四，维护边界混乱。新增一个工具就要改 Agent 主服务，业务系统团队和 Agent 团队耦合越来越重。

MCP 解决的正是这个接入层问题：让外部系统通过 MCP Server 暴露标准能力，Agent Host 通过 MCP Client 连接这些能力。

## 

# **一、MCP 架构怎么拆**

可以把 MCP 理解成 Agent 使用外部能力的一层标准连接协议。

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/b3af39c07258414db455db653eb2c391.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121134Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=7913f0a4a35885d85bd2edde86b6a84ff09809ce3dce524bce1ba91afe7c124e)

MCP Host 是用户正在使用的 AI 应用，比如聊天助手、IDE、内部办公助手或企业智能客服工作台。Host 负责承载用户交互、模型推理、任务状态和执行循环。

MCP Client 是 Host 内部的连接组件，负责和 MCP Server 建立连接，发现 Server 暴露了哪些 Tools、Resources 和 Prompts，并把模型选择的调用请求转发出去。

MCP Server 是外部能力的标准化适配层。它不等于大模型，也不等于 Agent 本身，而是负责把真实系统封装成模型应用可以理解和调用的能力。

外部系统才是真正的数据和业务来源，比如数据库、文件系统、信用卡服务、CRM、知识库、工单系统、日志平台和代码仓库。

一个请求可以这样走：
| Plain Text1. 用户在 Agent Host 里提出任务2. Agent 判断需要访问信用卡年费交易和业务规则3. MCP Client 发现 card-service-server 暴露的工具4. Agent 选择 query_card_fee_transaction5. MCP Client 把结构化参数发送给 MCP Server6. MCP Server 校验身份和参数后调用真实信用卡服务7. MCP Server 返回结构化结果和原始引用8. Agent 基于结果继续推理或输出答案 |
| --- |

这里最重要的是：MCP Server 靠近业务系统，所以它不能只是“转发请求”，还要承担工具描述、参数约束、用户身份传递、结果裁剪和调用审计。

## 

# **二、Tools、Resources、Prompts 的边界**

很多人只记得 MCP 可以接工具，但 MCP 更重要的是把不同类型的上下文分开。

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/5e20b88032d34cf9a7b94316b3dc79a3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121135Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=ce52fe77309fc5de4f14cceba101ec4a7b5c1d188c65b9820a4ccffde6edb713)

Tools 是可执行动作，比如查询年费交易、检索业务规则、生成客服工单草稿、读取日志摘要。Tool 往往需要参数，部分 Tool 可能有副作用，因此必须考虑权限、风险等级和审计。

Resources 是可读取资源，比如产品说明、制度文档、客户脱敏摘要、配置文件、日志片段、代码文件。Resource 的重点是“读取上下文”，不应该被设计成会修改业务状态的动作。

Prompts 是可复用提示模板，比如客服话术模板、质检摘要模板、风险提示模板、工单摘要模板。它的价值是让不同任务复用同一套提示结构，而不是每个 Agent 都手写一份 Prompt。

企业里最好不要把所有东西都做成 Tool。能读的资料先按 Resource 暴露，真正需要执行动作的能力再做成 Tool，能复用的任务范式则沉淀成 Prompt。

## 

# **三、MCP 和 API 网关有什么区别**

MCP 看起来像 API 接入层，但它不是传统 API 网关的替代品。

API 网关主要服务“程序调用程序”，它关注路由、鉴权、限流、负载均衡和服务治理。MCP 主要服务“模型应用理解并调用外部能力”，它关注工具发现、自然语言描述、上下文资源、提示模板、结构化返回和模型可用性。

可以这样对比：
| 对比项 | API 网关 | MCP |
| --- | --- | --- |
| 使用者 | 前端、后端服务 | Agent、LLM 应用 |
| 核心能力 | 路由、鉴权、限流、负载均衡 | 工具发现、资源暴露、上下文提供 |
| 返回设计 | 面向业务代码 | 面向模型理解和审计追踪 |
| 工具描述 | 通常不需要自然语言说明 | 需要让模型理解用途和边界 |
| 典型位置 | 企业服务入口 | Agent 与外部能力之间 |

底层真实调用仍然可能经过 API 网关、服务网关、数据库代理或文件服务。MCP 更像模型应用侧的标准化接入层。

一句话：
| Plain TextAPI 网关解决服务调用治理，MCP 解决模型应用如何发现、理解和使用外部能力。 |
| --- |

## 

# **四、企业 MCP Server 怎么拆**

企业 MCP Server 不建议做成一个“大而全”的万能 Server。更好的方式是按业务领域拆分，让权限、工具描述和责任边界更清楚。

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/59892e14dab84e7f95a52b7866251d71.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121135Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=d46a3320d71e63b09e5f13e30c82044649d2c583725db58f40894fcb1f79df08)

在银行客服 Agent 场景里，可以这样拆：
| MCP Server | 暴露能力 |
| --- | --- |
| bank-policy-server | 年费、额度、还款、理财等业务规则检索 |
| card-service-server | 卡片状态、年费交易、消费达标情况查询 |
| crm-service-server | 客户脱敏画像、服务历史、客户等级查询 |
| service-ticket-server | 客服工单查询、工单草稿生成、处理进度查询 |
| quality-log-server | 客服日志、质检记录、链路追踪 |

这样拆有几个好处。

第一，权限边界清楚。信用卡系统和客服质检系统不是一个权限域，不应该放在一个 Server 里随便混用。

第二，工具描述更聚焦。一个 Server 只暴露某个领域的 Tools 和 Resources，模型更容易选对能力。

第三，问题定位更容易。某个工具失败时，可以快速定位到对应业务团队和外部服务。

第四，团队维护边界更清楚。业务系统团队可以维护自己的 MCP Server，Agent 团队只负责连接和编排。

## 

# **五、MCP 接入时的权限链路**

MCP 不能变成“模型访问内网的万能钥匙”。企业接入时至少要传递用户身份、角色、部门、数据范围和任务上下文，一个稳妥链路是：

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/40c4d6d4ddf140aebfeec2ae760226c0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121135Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e3ec75c774ff6f61228282fd50ff8dc346981f041545063c8dde97ff02b993e2)

权限不能只在 Host 判断一次。MCP Server 侧也要校验，因为它是真正靠近数据和工具的地方。外部系统最好也继续按自己的 RBAC 和数据范围做兜底。

放到银行场景里，坐席 A 只能查询自己服务范围内的客户，MCP Server 就不能因为模型请求里有某个 customer\_id 就直接调用接口。它必须把当前用户身份传给后端服务，由业务系统按坐席权限过滤数据。

## 

# **六、MCP 返回内容怎么给模型看**

MCP Server 返回结果时，要同时考虑两类消费者：模型和系统。

模型需要的是简洁摘要、结构化字段、关键证据和可引用依据。系统需要的是原始数据引用、调用日志、错误码、耗时和操作者信息。

例如日志检索 Server 不应该把 10MB 日志原文直接返回给模型，而应该返回：
| JSON{"status": "success","summary": "在 14:02-14:05 之间出现 37 次数据库连接超时，主要集中在 order-service。","evidence": ["order-service timeout at 14:02:31","order-service timeout at 14:03:08"],"resource_ref": "log_query_20260623_001"} |
| --- |

这样模型能继续判断，审计人员也能通过 resource\_ref 找到原始日志。这个思路和 Tool Calling 里的 Observation 一样：不要把大段原始数据直接塞回模型，而是返回摘要、证据和引用。

## 

# **七、MCP 适合先接什么能力**

央国企和银行场景里，MCP 接入建议从低风险、高价值能力开始。
| 优先级 | 能力 | 原因 |
| --- | --- | --- |
| P0 | 业务规则检索 | 风险低，价值直观 |
| P0 | 账单和卡片状态摘要查询 | 能直接支撑客服辅助 |
| P0 | 客服记录读取 | 适合多轮问题承接和坐席辅助 |
| P1 | 客服话术和质检摘要生成 | 能提效，但不直接对客发送 |
| P1 | 日志检索 | 支撑客服系统运维和问题定位 |
| P2 | 创建客服工单草稿 | 可以辅助流程，但必须人审 |
| P3 | 正式账务操作 | 风险高，不建议早期开放 |

不要一上来就让 MCP Server 暴露“修改数据”“提交审批”“发送通知”“减免账务”这类能力。先做查询、检索、解析、草稿生成，风险小得多，也更容易在企业内部过审。

## 

# **八、MCP 和前几篇内容怎么串起来**

可以把前几篇合在一起理解。

Tool Calling 解决“模型如何提出结构化动作，后端如何校验并执行”。State 管理解决“多步骤任务做到哪一步，工具结果怎么保存和恢复”。MCP 解决“这些工具、资源和提示模板如何被标准化接入 Agent”。

因此，一个企业 Agent 的完整链路可以这样说：
| Plain TextAgent Runtime 负责执行循环；Tool Calling 负责结构化动作；State Store 负责任务进度和恢复；MCP 负责把企业工具、资源和 Prompt 标准化接进来；安全治理负责权限、人审、审计和风险控制。 |
| --- |

这比只说“我接了 MCP”更有技术深度。

## 

# **九、面试表达模板**

可以这样回答：
| Plain Text我理解 MCP 主要解决 Agent 和外部工具、资源、上下文之间的标准化连接问题。如果系统只有一两个函数，用 Function Calling 直接封装就够了。但银行客服 Agent 往往要访问业务规则库、信用卡系统、CRM、客服工单和日志平台，如果都写在 Agent 主服务里，工具发现、权限传递和返回格式会很混乱。MCP 可以把这些能力拆成不同的 MCP Server，由 Host 侧的 MCP Client 统一连接。设计时我会区分 Tools、Resources 和 Prompts：Tool 是可执行动作，Resource 是可读取上下文，Prompt 是可复用任务模板。企业落地时，MCP Server 侧也必须做用户身份校验、工具白名单、参数校验、数据范围过滤和调用审计。早期接入我会优先选择只读查询、业务规则检索、日志摘要和工单草稿，不会直接开放账务修改、额度调整这类高风险操作。 |
| --- |

下一篇收束到真正上线时绕不开的问题：Agent 的安全边界、评估体系和面试表达。
