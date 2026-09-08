# Multi Agent与多智能体协作

**Multi Agent与多智能体协作**

Multi Agent System（多智能体系统）是一种由多个角色化 Agent 共同完成复杂任务的智能应用架构。它的核心思想不是“多开几个模型一起聊天”，而是把复杂任务拆成若干职责稳定、工具边界清晰、上下文范围可控的子任务，再通过 Orchestrator（编排器）或 Manager Agent 统一分配、汇总、校验和终止。

单 Agent 更适合目标明确、步骤不多、工具数量有限的任务，比如一次制度问答、一次账务摘要查询、一次客服回复生成。但当任务涉及多数据源、多阶段判断、多角色审校、多份材料并行处理时，把所有职责都压给一个 Agent，就容易出现 Prompt 过长、工具误选、结果不可追踪、失败责任不清和成本失控。

所以，Multi Agent 的价值不是“Agent 越多越智能”，而是通过角色拆分降低单个 Agent 的复杂度，让系统更容易扩展、调试、评估和治理。

 Agent 的瓶颈看 Multi Agent

先用一个银行客服场景理解。

用户问：
| Plain Text我的信用卡为什么扣了年费？我现在能不能减免？如果可以，帮我生成一段给客户的回复。 |
| --- |

如果用单 Agent，它需要同时完成任务识别、规则检索、账务查询、权益判断、客服话术生成、风险审校和人工确认判断。Demo 阶段这样做可以跑通，但真实系统里会遇到几个问题。

第一，上下文会快速膨胀。一个 Agent 要同时看到工具说明、规则片段、客户数据、历史对话、安全要求、输出格式和评估标准。上下文越长，模型越容易漏掉关键约束。

第二，工具选择更容易混乱。系统里可能同时存在规则检索、客户画像、账务摘要、工单查询、话术生成、质检规则等工具。工具数量一多，单 Agent 误选、漏选或重复调用的概率会上升。

第三，责任边界不清。最后答错了，很难判断是检索材料错了、结构化数据错了、条件判断错了，还是生成回复时没有遵守审校规则。

第四，复杂任务难以并行。比如同时分析多份制度、多条客户记录、多种处理方案，单 Agent 往往只能顺序执行；多智能体可以让不同角色并行处理，再由汇总节点统一合并。

第五，评估粒度太粗。单 Agent 只能整体打分，而 Multi Agent 可以分别评估 Retriever 的命中率、Data Query 的参数准确率、Draft 的表达质量和 Review 的拦截效果。

因此，Multi Agent 适合解决的是“复杂任务如何拆分、协作、合并和治理”的问题，而不是简单追求更多模型调用。

## 

# **一、Multi Agent 的基本架构**

一个企业级 Multi Agent 系统通常由五类组件组成：Orchestrator、Specialist Agents、Shared State、Tool Runtime 和 Guardrail / Evaluation。

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/8adf7b5f2e1b4fe2aad6179ae9a36216.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121345Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=1fce465f1df0e304d371b11da51aef91d2a87162984f01c373da78be2aa436c0)

Orchestrator 是编排层，负责理解用户目标、拆解子任务、选择参与的 Agent、控制执行顺序、判断任务是否结束。它可以是一个规则编排器，也可以是一个 Manager Agent，还可以是 Workflow 与 Agent 的组合。

Specialist Agents 是专家 Agent。它们不应该拥有同样的 Prompt、同样的工具和同样的上下文，而应该围绕稳定职责设计。比如 Retriever Agent 只负责检索依据，Data Query Agent 只负责查询结构化业务数据，Draft Agent 只负责生成草稿，Review Agent 只负责事实、权限和风险审校。

Shared State 是共享状态层，用来保存任务目标、子任务状态、中间结果、证据引用、冲突记录、失败信息和最终决策。多 Agent 之间最好通过共享状态和结构化消息协作，而不是把所有原始数据互相复制。

Tool Runtime 是工具执行层，真正访问知识库、数据库、业务系统和外部 API。即使每个 Agent 负责不同角色，工具执行仍然要由后端统一做参数校验、权限过滤、超时控制、重试和审计。

Guardrail / Evaluation 是治理层，负责安全边界、结果校验、冲突检测、人工确认和效果评估。Multi Agent 会放大系统复杂度，如果没有治理层，多个 Agent 的错误会互相传递，最后更难排查。

## 

# **二、角色应该怎么拆**

Multi Agent 的角色拆分要围绕任务链路，而不是为了让架构图更复杂。一个银行客服 Agent 可以拆成 6 个典型角色。

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/0ab28b96629e4998a5792b8c041e56b3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121346Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c056b1db156c6d4f6440a9c5b78b916cf8aaa2d634b45c46b0f68d898dfd0f05)

Planner Agent 负责识别任务类型、拆解步骤和生成执行计划。它不应该直接查询核心业务数据，而是判断这个任务需要哪些子 Agent 参与。

Retriever Agent 负责检索制度规则、产品说明、FAQ 和合规话术。它的输出应该是带引用的证据片段，而不是直接给出业务结论。

Data Query Agent 负责查询结构化业务数据，比如客户脱敏画像、账务摘要、卡片状态、工单状态。它需要严格受 RBAC、数据范围和脱敏策略控制。

Reasoning Agent 负责把规则和数据合在一起做条件判断。比如规则说“消费 12 笔可减免”，客户当前只有 9 笔达标消费，它就应该输出“不满足条件”，而不是让 Draft Agent 自己猜。

Draft Agent 负责生成客户回复、坐席提示、报告摘要或工单草稿。它最好只看经过处理的结构化结论和引用证据，不直接看大量原始敏感数据。

Review Agent 负责审校事实一致性、引用完整性、权限边界、敏感字段和高风险动作。它不是为了“润色”，而是为了拦截错误输出。

这种拆法的关键是：每个 Agent 都有明确输入、输出、工具范围和评估指标。Retriever 看召回和引用，Data Query 看参数和权限，Reasoning 看条件判断，Draft 看表达和格式，Review 看拦截和安全。

## 

# **三、协作模式有哪些**

Multi Agent 不只有一种形态，常见模式可以分为顺序协作、并行协作、管理者模式和评审模式。

顺序协作是一个 Agent 的输出作为下一个 Agent 的输入。比如先由 Retriever 检索材料，再由 Reasoning 判断规则，再由 Draft 生成回复，最后由 Review 审校。它适合流程相对稳定的任务，问题是前面一步出错会传递到后面。

并行协作是多个 Agent 同时处理不同材料或不同子任务。比如一个 Agent 分析制度规则，一个 Agent 查询客户账务，一个 Agent 总结历史工单，最后由汇总节点整合。它适合多资料、多系统、多方案比较，问题是必须处理结果合并和冲突。

管理者模式是 Manager Agent 或 Orchestrator 负责拆解任务、分配子任务和汇总结果。企业系统里最常见的通常是这种模式，因为它能保留统一边界，不让多个 Agent 自由互相调用。

评审模式是多个 Agent 给出不同判断，再由 Review Agent 或规则引擎做汇总。它适合方案评估、风险分析、复杂报告审校，但成本较高，不能无限讨论。

实际工程里，经常是混合使用：外层 Workflow 控制主流程，Manager 负责动态拆解，关键步骤交给少量 Specialist Agents，最后由 Review 和 Guardrail 收口。

## 

# **四、状态、消息和证据怎么管理**

Multi Agent 比单 Agent 更依赖状态管理。因为系统必须知道每个 Agent 做了什么、依据是什么、是否失败、是否需要重试，以及最终结果引用了哪些中间产物。

一个可用的共享状态结构至少包含：
| 状态字段 | 说明 |
| --- | --- |
| task_id | 多智能体任务唯一标识 |
| goal | 用户原始目标、任务类型和约束 |
| subtasks | 拆解后的子任务、负责 Agent、执行状态 |
| agent_outputs | 各 Agent 的结构化输出和置信度 |
| evidence_refs | 规则片段、工具结果、文件引用、时间戳 |
| conflicts | 不同 Agent 输出之间的冲突记录 |
| decision | 汇总后的判断、输出策略和人审状态 |
| audit_log | Agent 调用、工具调用、耗时、成本和权限记录 |

这里要注意，Agent 之间传递的信息不建议是完整原始数据。更稳的方式是传递摘要、证据 ID、结构化字段和引用来源。原始数据保存在数据库、对象存储或日志系统中，只有具备权限的工具或后端服务才能读取。

比如 Data Query Agent 查询到账务明细后，不应该把完整流水直接交给 Draft Agent，而是输出脱敏后的结构化 Observation：
| Plain Textcard_type: 白金卡fee_transaction: 已扣年费 680 元qualified_consumption_count: 9rule_required_count: 12conclusion: 当前不满足自动减免条件evidence_ref: fee_rule_2026_v3#section_2 |
| --- |

Draft Agent 看到的是业务结论和证据引用，后端保留完整原始数据和审计链路。这样才能同时兼顾协作效率、安全边界和可追溯性。

## 

# **五、冲突和失败怎么处理**

多智能体系统一定会遇到冲突。比如 Retriever Agent 检索到的规则说“消费满 12 笔可减免”，Data Query Agent 查询到客户当前只有 9 笔达标消费，但 Draft Agent 却生成了“可以减免”的回复。如果没有冲突检测和 Review Agent，错误就会直接输出。

![](https://hxsay.com:19000/hxsay-image/quesion/imgs/95643705efb844a19881ccf3d69af682.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin_20260624_us-east-1_s3_aws4_request&X-Amz-Date=20260624T121346Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=eaff9dba499ff80125ed07a635fccca9b7cbaf1a255a58f78acbf976d53638f9)

冲突处理不能靠多个 Agent 无限讨论。企业系统更需要明确规则优先级、最大轮数、超时控制和人工介入条件。

常见策略有几类。

第一，证据优先级。结构化业务数据优先于模型推断，最新规则优先于旧规则，带来源引用的结论优先于无依据文本。

第二，冲突标记。不同 Agent 输出不一致时，要写入 conflicts 字段，进入 Review Agent 或人工确认，而不是让 Draft Agent 自行选择一个看起来顺的结论。

第三，部分失败处理。某个 Agent 工具超时或返回为空时，可以标记 partial\_result，允许有限重试、降级输出或转人工。不要把“没有查到”说成“没有问题”。

第四，输出拦截。最终回答和引用不一致、敏感字段未脱敏、权限不足、高风险动作未确认时，Review Agent 或 Guardrail 应该拦截，让系统重写、拒答或转人工。

第五，成本和轮数控制。多个 Agent 很容易把任务拖成多轮循环，所以必须有最大执行步数、最大耗时、最大模型调用次数和重复动作检测。

## 

# **六、Multi Agent、Workflow 和单 Agent 的边界**

Multi Agent 经常和 Workflow、单 Agent 混在一起。面试时可以按“决策主体和流程弹性”来区分。

Workflow 的核心特点是流程固定，步骤由开发者预先定义。它适合审批流、固定问答链路、标准作业流程。优点是稳定、可控、便宜，缺点是遇到开放式任务时灵活性不足。

单 Agent 的核心特点是一个模型决策体根据状态选择工具。它适合中等复杂度任务、多工具问答和流程辅助。优点是灵活，缺点是工具多、状态复杂、上下文长时容易失控。

Multi Agent 的核心特点是多个角色化 Agent 分工协作。它适合复杂分析、多资料处理、多系统查询、多角色审校和报告生成。优点是职责边界更清楚，缺点是状态管理、冲突处理、成本控制和安全治理更复杂。

真实项目里三者不是互斥关系。更常见的做法是：
| Plain Text外层 Workflow 控制主流程；中间 Manager Agent 做动态任务拆解；少量 Specialist Agents 处理关键子任务；后端 Tool Runtime、State、Guardrail 统一兜底。 |
| --- |

也就是说，Multi Agent 不应该替代所有流程控制。它更适合放在复杂判断、复杂材料处理和复杂审校环节。

## 

# **七、什么时候不适合 Multi Agent**

Multi Agent 不是越多越好。以下场景不建议一开始就做多智能体。

任务本身很短，一个 RAG 或单 Agent 就能解决。比如普通制度问答，单独引入 Planner、Retriever、Draft、Review 反而增加延迟。

工具数量很少，角色拆分不能带来明显收益。比如只有一个知识库检索工具和一个回复生成工具，拆多个 Agent 更多是在制造工程复杂度。

结果必须强一致，不能接受多个 Agent 生成不一致判断。比如资金交易、权限变更、核心账务写入，更应该用规则、事务和审批流，而不是多 Agent 自由协商。

系统还没有日志、状态和评估体系。如果单 Agent 的工具调用、状态持久化、安全边界都没做好，直接上 Multi Agent 只会把不可控问题放大。

成本和延迟要求很严格。多 Agent 会增加模型调用次数、上下文拼装成本、等待时间和调试难度，必须有缓存、并行策略、最大轮数和降级方案。

所以更稳的学习顺序是：先把单 Agent 的工具调用、状态管理、安全边界和评估体系做扎实，再考虑是否引入 Multi Agent。

## 

# **八、企业项目中怎么落地**

如果要把 Multi Agent 放进央国企技术岗项目里，不建议讲成“我用了 CrewAI 搭了多个角色”。框架名不是重点，重点是业务为什么需要拆分、每个角色有什么边界、状态怎么传递、冲突怎么处理。

可以围绕银行客服 Agent 这样表达：
| Plain Text项目里不是所有问题都交给一个 Agent。对于年费减免、账务解释、客服回复这类复杂任务，我把系统拆成 Planner、Retriever、Data Query、Reasoning、Draft 和 Review 几个角色。Planner 负责判断任务类型和拆解步骤；Retriever 只检索制度依据；Data Query 只查询脱敏业务数据；Reasoning 负责把规则和数据合并判断；Draft 生成坐席回复草稿；Review 检查事实、引用、权限和风险。多个 Agent 不直接传递原始敏感数据，而是通过共享状态传递结构化 Observation 和证据引用。如果规则和数据不一致、输出和引用不一致，或者涉及年费减免、额度调整、客户资料变更等高风险动作，系统会进入 Review 或人工确认。 |
| --- |

这段表达能体现三个能力：你知道 Multi Agent 不是堆角色；你知道企业系统要有状态、权限和审计；你知道多智能体的复杂度要被编排器和后端边界管住。

## 

# **九、常见追问**
| 面试问题 | 回答重点 |
| --- | --- |
| Multi Agent 和单 Agent 有什么区别？ | 单 Agent 是一个决策体处理全流程，Multi Agent 是多个角色化 Agent 分工协作，由编排层统一调度 |
| 为什么不用一个 Agent？ | 工具多、材料多、审校要求高时，单 Agent 容易上下文膨胀、工具误选、责任不清 |
| 多个 Agent 怎么通信？ | 通过共享状态、结构化 Observation、证据引用和消息队列，不建议互相传原始敏感数据 |
| 多个 Agent 结论冲突怎么办？ | 记录 conflicts，按证据优先级处理，进入 Review Agent 或人工确认 |
| Multi Agent 会不会成本很高？ | 会增加模型调用次数，要控制 Agent 数量、轮数、并行策略、缓存和降级方案 |
| 如何保证安全？ | 工具隔离、最小可见工具、用户权限透传、数据脱敏、审计日志、高风险动作人审 |
| 什么场景适合 Multi Agent？ | 多资料处理、多系统查询、复杂分析、报告生成、事实审校和风险审校 |
| 什么场景不适合 Multi Agent？ | 简单问答、强一致写操作、低延迟任务、缺少状态和评估体系的系统 |

## 

# **十、最后的准备标准**

准备 Multi Agent，不是背框架名，而是能讲清下面这几件事：
| Plain Text为什么单 Agent 不够；多 Agent 的角色如何拆分；谁负责调度、汇总和终止；Agent 之间传递什么信息；共享状态、证据引用和审计日志怎么保存；冲突、失败、高风险动作怎么处理；为什么有些场景不应该使用 Multi Agent。 |
| --- |

最后可以把 Multi Agent 总结成一句面试表达：
| Plain TextMulti Agent 是一种面向复杂任务的角色化协作架构。它通过 Orchestrator 统一编排多个 Specialist Agents，让不同 Agent 分别处理检索、数据查询、条件判断、草稿生成和审校。它的价值是降低单 Agent 的上下文压力和工具选择复杂度，但前提是系统必须有共享状态、权限边界、冲突处理、审计日志和成本控制。 |
| --- |

能讲到这个程度，就说明你理解的 Multi Agent 不是“多个模型聊天”，而是一个可以落到企业应用里的多角色任务编排系统。
