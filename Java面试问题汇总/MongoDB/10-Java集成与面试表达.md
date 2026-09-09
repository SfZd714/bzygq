# MongoDB Java 集成与面试表达

Java 项目接入 MongoDB，重点不是“能不能连上库”，而是能不能把文档模型、连接配置、访问层分工、索引治理和一致性边界落到可维护的工程结构里。Spring Data MongoDB 能减少大量驱动样板代码，但它不会替开发者决定哪些数据适合 MongoDB、哪些查询应该建索引、哪些业务必须回到关系型数据库。

这一章按真实项目落地的顺序展开：先接入依赖和连接串，再看 Repository 与 MongoTemplate 的分工，然后讲实体映射、索引治理、事务与读写关注，最后整理适用边界和面试表达。Docker 本地体验只作为辅助，不把安装流程当成重点。

![images/mongodb-java-integration-stack.png](../_images/5dbaf7667fcd4ac68800b7ed85f9857c.png)

images/mongodb-java-integration-stack.png

## 一、依赖、连接串和本地体验

Spring Boot 项目通常通过 spring-boot-starter-data-mongodb 接入 MongoDB。这个 starter 会引入 MongoDB Java Driver，并自动配置 MongoClient、MongoDatabaseFactory、MongoTemplate 和 Repository 支持。

 
org.springframework.boot 
spring-boot-starter-data-mongodb 

最简单的本地连接可以只写单机地址：

spring: 
data: 
mongodb: 
uri: mongodb://127.0.0.1:27017/demo

生产环境更常见的是连接复制集或 Atlas 集群。连接串不只是主机地址，还可以承载认证库、副本集名称、读写关注、读偏好、超时和重试写入等配置。

spring: 
data: 
mongodb: 
uri: mongodb://app\_user:${MONGO\_PASSWORD}@mongo1:27017,mongo2:27017,mongo3:27017/shop?authSource=admin&replicaSet=rs0&w=majority&readConcernLevel=majority&readPreference=primary&retryWrites=true

这条连接串里有几个点要会解释：
| 配置项 | 含义 |
| --- | --- |
| app_user:${MONGO_PASSWORD} | 应用账号和密码，密码通过环境变量或配置中心注入 |
| authSource=admin | 指定认证库，业务库可以是 shop，账号可能建在 admin |
| replicaSet=rs0 | 告诉驱动按复制集拓扑发现节点，支持 Primary 切换 |
| w=majority | 写入等待多数节点确认，降低主节点故障后的回滚风险 |
| readConcernLevel=majority | 读取多数提交数据，提升一致性但可能增加等待成本 |
| readPreference=primary | 默认从主节点读取，避免读从库带来的复制延迟问题 |
| retryWrites=true | 开启可重试写入，但业务接口仍要自己保证幂等 |

本地体验 MongoDB 可以用 Docker 快速启动。它的作用是让开发者验证语法、连接和简单 CRUD，不应该把它等同于生产部署。

docker run --name local-mongo -p 27017:27017 -v /data/mongodb:/data/db -d mongo 
mongosh "mongodb://127.0.0.1:27017/demo"

面试中如果被问“Spring Boot 怎么连 MongoDB”，不要只背依赖和 YAML。更稳的回答是：用 Spring Data MongoDB 接入，连接串里要体现部署形态、认证、副本集和读写关注；本地可以 Docker 跑单机，生产要按复制集或分片集群配置，并对密码、超时、连接池和重试写入做治理。

## 二、Repository 和 MongoTemplate 的分工

Spring Data MongoDB 常用访问方式有两类：Repository 和 MongoTemplate。Repository 适合简单、稳定、可读性强的 CRUD；MongoTemplate 适合动态条件、复杂查询、局部更新、聚合管道、字段投影和游标分页。

Repository 的优点是代码短，能通过方法名派生查询，也可以写 @Query。例如订单快照集合：

@Document(collection = "order\_snapshots") 
public class OrderSnapshotDocument { 
 
@Id 
private String id; 
 
private Long userId; 
 
private String orderNo; 
 
private String status; 
 
private BigDecimal amount; 
 
private Instant createdAt; 
 
private List items; 
}

public interface OrderSnapshotRepository 
extends MongoRepository { 
 
Optional findByOrderNo(String orderNo); 
 
List findTop20ByUserIdAndStatusOrderByCreatedAtDesc( 
Long userId, 
String status 
); 
}

这种写法适合“按订单号查一条”“按用户和状态查最近 20 条”这样的稳定查询。但如果条件是动态组合，或者需要控制返回字段、批量更新、聚合统计，继续用超长方法名会让代码变得难维护。

MongoTemplate 更接近显式查询构造：

Query query = Query.query( 
Criteria.where("userId").is(userId) 
.and("status").is("PAID") 
).with(Sort.by(Sort.Direction.DESC, "createdAt")) 
.limit(20); 
 
query.fields() 
.include("orderNo") 
.include("amount") 
.include("createdAt"); 
 
List snapshots = 
mongoTemplate.find(query, OrderSnapshotDocument.class);

局部更新也更适合用 MongoTemplate 明确写出条件和变更字段：

Query query = Query.query( 
Criteria.where("orderNo").is(orderNo) 
.and("status").is("CREATED") 
); 
 
Update update = new Update() 
.set("status", "PAID") 
.set("paidAt", Instant.now()); 
 
UpdateResult result = 
mongoTemplate.updateFirst(query, update, OrderSnapshotDocument.class);

这类写法能避免为了改一个字段就读出整份文档再保存，减少误覆盖并发字段的风险。面试里可以把分工说成一句话：Repository 负责简单稳定的对象访问，MongoTemplate 负责需要显式控制查询、投影、更新和聚合的场景；访问层选择不是喜好问题，而是可维护性和性能可控性的取舍。

## 三、实体映射、字段治理和索引治理

Java 实体映射决定了对象字段如何落到 BSON 文档。常见注解包括 @Document、@Id、@Field、@Indexed、@CompoundIndex、@Version 等。实体类不只是 DTO，它承载了集合名、主键、字段名、索引意图和版本兼容策略。

@Document(collection = "order\_snapshots") 
@CompoundIndex( 
name = "idx\_user\_status\_created", 
def = "{'userId': 1, 'status': 1, 'createdAt': -1}" 
) 
public class OrderSnapshotDocument { 
 
@Id 
private String id; 
 
@Indexed(unique = true) 
private String orderNo; 
 
@Field("user\_id") 
private Long userId; 
 
private String status; 
 
private BigDecimal amount; 
 
private Instant createdAt; 
 
@Version 
private Long version; 
}

@Id 默认映射到 MongoDB 的 \_id。如果 Java 字段是 String，Spring Data 可以在一定条件下与 ObjectId 做转换，但工程上要统一主键类型，避免同一个集合里既有字符串业务 id，又有 ObjectId 字符串造成查询混乱。业务编号例如 orderNo 应该单独建字段，不能把技术主键当成外部订单号。

@Field 可以解决 Java 命名和文档字段命名不一致的问题，但不要滥用。字段名一旦进入线上集合，就会影响历史数据兼容、索引名称、聚合脚本和排障查询。字段重命名最好配合数据迁移或双读双写策略，不要只改 Java 注解。

索引注解可以表达意图，但不等于线上索引治理已经完成。Spring Data MongoDB 的自动建索引需要显式开启；即使开启，也要谨慎评估启动时建索引对大集合的影响。生产环境更稳妥的方式通常是：开发阶段用注解或程序化 IndexOperations 描述索引，发布前由迁移脚本、运维流程或数据库变更单控制索引创建。

mongoTemplate.indexOps(OrderSnapshotDocument.class) 
.ensureIndex(new Index() 
.on("userId", Sort.Direction.ASC) 
.on("status", Sort.Direction.ASC) 
.on("createdAt", Sort.Direction.DESC) 
.named("idx\_user\_status\_created"));

索引治理要围绕查询模式，而不是围绕字段数量。复合索引 { userId: 1, status: 1, createdAt: -1 } 适合按用户、状态过滤再按时间倒序查询；它不适合只按 createdAt 查全站数据。索引过少会慢查询，索引过多会增加写入成本和存储成本。真正稳的做法是结合慢查询、explain、数据量和写入频率定期审查。
| 治理点 | 常见问题 | 稳妥做法 |
| --- | --- | --- |
| 主键 | _id、业务编号混用 | 技术主键和业务编号分开设计 |
| 字段命名 | Java 改名导致历史文档不兼容 | 字段变更要有迁移和兼容策略 |
| 索引注解 | 以为写了注解线上就一定生效 | 明确自动建索引策略和变更流程 |
| 唯一索引 | 历史脏数据导致创建失败 | 上线前清洗数据并确认唯一性 |
| 复合索引 | 字段顺序随意 | 按高频查询的过滤、排序和分页设计 |

## 四、事务、读写关注和一致性配置

MongoDB 支持多文档事务，但 Java 项目里要先理解它的定位。MongoDB 最自然的原子性仍然是单文档原子更新；多文档事务用于少量确实需要跨文档、跨集合同步一致的场景，而不是弥补文档建模随意的万能方案。

在 Spring Data MongoDB 中，可以配置 MongoTransactionManager 接入 Spring 的 @Transactional：

@Configuration 
public class MongoTxConfig { 
 
@Bean 
MongoTransactionManager transactionManager(MongoDatabaseFactory factory) { 
return new MongoTransactionManager(factory); 
} 
}

@Service 
public class RefundService { 
 
@Transactional 
public void refund(String orderNo) { 
orderRepository.markRefunding(orderNo); 
refundRepository.createRefund(orderNo); 
accountFlowRepository.appendRefundFlow(orderNo); 
} 
}

事务通常要求部署形态支持会话和事务能力，生产中一般建立在复制集或分片集群上。事务内部的操作会引入会话、快照、锁等待、复制确认和更多网络往返；事务越大、持续时间越长、涉及文档越多，对吞吐影响越明显。因此，事务应该短小、明确、可重试，避免在事务中做远程调用、长时间计算或等待用户输入。

读写关注也要和事务一起理解。writeConcern 决定写入等多少副本确认，readConcern 决定读取什么一致性视图，readPreference 决定从 Primary 还是 Secondary 读。它们可以在连接串中配置，也可以在关键操作或事务层面单独配置。

MongoTemplate reliableTemplate = mongoTemplate 
.withWriteConcern(WriteConcern.MAJORITY) 
.withReadConcern(ReadConcern.MAJORITY) 
.withReadPreference(ReadPreference.primary());

关键业务写入通常更倾向 majority，以降低主节点故障后的回滚风险；读从库可以分摊压力，但会引入复制延迟，不适合“刚写完立刻读最新结果”的链路。可重试写入可以提升瞬时故障下的成功率，但必须配合业务幂等，比如请求号、订单号、唯一索引或状态机条件。

面试里可以这样收束：MongoDB 事务能用，但先看文档边界能否用单文档原子性解决；确实跨集合一致时再启用事务，并把事务做短。读写关注是可靠性和性能的权衡，关键写入用多数确认，读从库要接受旧数据风险。

## 五、适用与不适用场景

Java 项目选择 MongoDB 时，最重要的不是“公司有没有用”，而是业务数据是否符合文档模型。适合的场景通常有几个特征：字段变化较快，结构半固定；经常围绕一个对象整体读取；跨对象强关联少；可以接受通过索引和聚合解决主要查询；数据生命周期和容量增长可预估。

典型适用场景包括内容管理、用户画像、配置中心、商品扩展属性、订单详情快照、运营活动草稿、设备元数据、短期日志事件等。它们的共同点是数据形态不完全统一，或者读取时更关心一个对象的完整快照。

不适合的场景也要讲清楚：核心账务、账户余额、强审计流水、复杂库存扣减、多表复杂经营报表、强外键关系、需要大量跨集合事务的业务，通常更适合 MySQL、PostgreSQL 或专门分析型数据库。MongoDB 支持事务和聚合，但不代表它是关系型数据库和数仓的替代品。
| 业务场景 | 建议 | 原因 |
| --- | --- | --- |
| 用户画像、内容草稿 | 适合 | 字段变化快，整体读取多 |
| 商品扩展属性 | 适合 | 不同类目字段差异大 |
| 订单详情快照 | 可考虑 | 详情读取方便，但支付账务应谨慎 |
| 登录 session、短期日志 | 适合 | 可配合 TTL 管理生命周期 |
| 银行账户余额 | 不优先 | 强一致、审计和约束要求高 |
| 多表复杂报表 | 不优先 | SQL 和分析型数据库更自然 |
| 大规模监控指标 | 视情况 | MongoDB 时序集合可承接一部分，专业监控场景仍需专门系统 |

落地时还要注意几个工程边界。第一，不要把“schema 灵活”理解成字段随便写，线上仍然需要字段规范、版本兼容和数据质量治理。第二，不要用大文档和无限数组承接所有关系，文档大小和热点更新会成为瓶颈。第三，不要为每个字段都建索引，索引会增加写入和存储成本。第四，不要让 MongoDB 承担它不擅长的强事务核心链路。

## 六、面试五步回答和常见追问

MongoDB 的面试回答可以按“五步法”组织：定位、模型、性能、一致性、边界。

1. 定位：MongoDB 是文档型 NoSQL 数据库，底层以 BSON 文档保存数据，Java 项目常用 Spring Data MongoDB 接入。
2. 模型：它适合围绕业务聚合根保存半结构化对象，减少多表关联，但建模要围绕查询方式、文档大小和生命周期设计。
3. 性能：查询性能依赖索引、投影、聚合管道顺序和分页方式；Repository 适合简单查询，复杂查询和聚合用 MongoTemplate 更可控。
4. 一致性：复制集提供高可用，关键写入可以用 writeConcern: majority；读一致性和读位置由 readConcern、readPreference 控制；事务支持但要短小谨慎。
5. 边界：它适合内容、画像、配置、扩展属性、快照和短期事件，不适合核心账务、复杂关联、强审计和大量跨集合事务。

可以把完整回答压缩成下面这样：

Java 项目里接入 MongoDB 通常用 Spring Data MongoDB，引入 starter 后通过连接串配置副本集、认证、读写关注和重试写入。简单 CRUD 用 Repository，动态查询、聚合、投影、局部更新和游标分页用 MongoTemplate。实体类用 @Document、@Id、@Field 表达集合和字段映射，索引可以用注解或程序化方式描述，但生产上要有独立治理流程。MongoDB 适合半结构化、围绕聚合对象读取的数据，比如内容、画像、配置、商品扩展属性和订单快照；强事务、复杂关联、账务审计仍然优先关系型数据库。

常见追问可以这样准备：
| 追问 | 回答重点 |
| --- | --- |
| Repository 和 MongoTemplate 怎么选 | Repository 适合简单稳定查询，MongoTemplate 适合动态条件、聚合、投影、批量更新和精细控制 |
| 连接串里为什么要写多个节点 | 复制集要让驱动发现拓扑和 Primary，某个节点不可达时仍能连接 |
| ObjectId 能不能当订单号 | 不建议。它是技术主键，不表达业务连续性、可读性和外部展示规则 |
| 索引注解能不能直接用于生产 | 可以表达索引意图，但生产创建要考虑数据量、锁和变更流程，不能无脑自动建 |
| 为什么查询慢 | 未命中索引、复合索引顺序不对、深分页、大文档、聚合顺序不合理或条件选择性差 |
| MongoDB 事务怎么用 | 配置 MongoTransactionManager 后可用 @Transactional，但事务要短小，优先利用单文档原子性 |
| 读从库有什么风险 | Secondary 可能落后 Primary，刚写完立刻读可能读到旧数据 |
| Docker 本地启动能代表生产吗 | 不能。Docker 单机只用于开发体验，生产要关注复制集、认证、备份、监控、容量和读写关注 |
| MongoDB 有事务后还要 MySQL 吗 | 要。MongoDB 事务是补充能力，不是强关系、强约束和复杂账务模型的完整替代 |

如果只用一句话收尾，可以说：MongoDB 在 Java 项目中最稳的使用方式，是把它放在文档边界清晰、查询模式可预估、索引能治理的一类业务里；Spring Data 负责降低接入成本，真正决定系统质量的是建模、索引、一致性和选型边界。
