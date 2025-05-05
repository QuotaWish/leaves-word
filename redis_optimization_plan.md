# Redis优化用户打卡系统方案

本文档提供了基于Redis优化千叶单词打卡系统的完整技术方案，重点关注连续打卡、最长连续打卡等高频操作的性能优化，同时保证数据的可靠性和一致性。

## 一、Redis数据结构设计

### 1. 用户当日打卡状态
```
Key: user:sign:daily:{userId}:{date}
Type: String
Value: "1"或"0"（已打卡或未打卡）
过期时间: 3天
```

### 2. 用户连续打卡计数器
```
Key: user:sign:streak:{userId}
Type: String
Value: 连续打卡天数
过期时间: 无（永久保存）
```

### 3. 用户最长连续打卡记录
```
Key: user:sign:max_streak:{userId}
Type: String
Value: 最长连续打卡天数
过期时间: 无（永久保存）
```

### 4. 月度打卡位图（替代MySQL中的sign_days字段）
```
Key: user:sign:monthly:{userId}:{year}:{month}
Type: Bitmap
Value: 位图，第n位表示当月第n天是否打卡
过期时间: 45天（保留足够时间进行数据持久化）
```

### 5. 连续打卡排行榜
```
Key: leaderboard:streak
Type: Sorted Set
Score: 连续打卡天数
Member: 用户ID
过期时间: 无（永久保存）
```

### 6. 累计打卡排行榜
```
Key: leaderboard:total_days
Type: Sorted Set
Score: 累计打卡天数
Member: 用户ID
过期时间: 无（永久保存）
```

## 二、实现流程

### 1. 用户打卡流程

```
用户打卡 -> Redis先处理 -> 定时/异步持久化到MySQL
```

具体步骤：

1. 检查今日是否已打卡（Redis）
   ```
   GET user:sign:daily:{userId}:{today}
   ```

2. 检查昨日是否打卡（Redis）
   ```
   GET user:sign:daily:{userId}:{yesterday}
   ```

3. 更新连续打卡天数
   ```
   如果昨日打卡 -> INCR user:sign:streak:{userId}
   如果昨日未打卡 -> SET user:sign:streak:{userId} 1
   ```

4. 更新最长连续打卡记录
   ```
   GET user:sign:max_streak:{userId}
   如果当前连续打卡天数 > 最长连续打卡天数：
     SET user:sign:max_streak:{userId} {当前连续打卡天数}
   ```

5. 更新月度打卡位图
   ```
   SETBIT user:sign:monthly:{userId}:{year}:{month} {day-1} 1
   ```

6. 更新排行榜
   ```
   ZADD leaderboard:streak {连续打卡天数} {userId}
   ZADD leaderboard:total_days {累计打卡天数} {userId}
   ```

7. 标记今日已打卡
   ```
   SET user:sign:daily:{userId}:{today} 1 EX 259200
   ```

### 2. 数据持久化方案

#### 定时任务持久化

设置每日凌晨执行的定时任务，将Redis中的打卡数据持久化到MySQL：

```sql
-- 伪代码
BEGIN TRANSACTION;
  -- 更新user_calendar表的签到位图
  UPDATE user_calendar SET 
    sign_days = {从Redis读取的月度打卡位图}
  WHERE user_id = {userId} AND year = {year} AND month = {month};
  
  -- 更新user_stats表的连续打卡和最长连续打卡天数
  UPDATE user_stats SET
    streak_days = {从Redis读取的连续打卡天数},
    max_streak_days = {从Redis读取的最长连续打卡天数},
    last_sign_date = {最后打卡日期}
  WHERE user_id = {userId};
COMMIT;
```

#### 异步持久化触发

每次用户打卡后，通过消息队列异步触发持久化操作：

1. 用户打卡成功
2. 发送消息到队列（可使用Redis Stream或RabbitMQ）
3. 消费者处理消息，执行数据持久化

#### 双写保障

对于关键操作（如连续打卡突破历史记录），采用双写策略：

```
用户打卡 -> Redis更新 -> 立即MySQL更新
```

#### 数据恢复机制

当Redis数据丢失时，从MySQL恢复数据：

```
启动时/Redis故障恢复后：
1. 读取MySQL中用户最近的打卡记录
2. 重建Redis中的连续打卡计数器和位图数据
```

## 三、接口优化

### 1. 用户当前打卡状态接口

原接口：`proc_get_user_calendar`
优化后：优先从Redis获取当月打卡数据

```
1. 检查Redis是否有完整数据:
   - GET user:sign:monthly:{userId}:{year}:{month}
   - GET user:sign:streak:{userId}

2. 如果Redis有完整数据，直接返回
3. 如果Redis无数据，从MySQL获取并重建Redis缓存
```

### 2. 用户统计信息接口

原接口：`proc_get_user_stats`  
优化后：混合读取策略

```
1. 从Redis获取实时数据:
   - 连续打卡天数: GET user:sign:streak:{userId}
   - 最长连续打卡: GET user:sign:max_streak:{userId}

2. 从MySQL获取历史聚合数据:
   - 累计单词量、累计学习时长等
```

### 3. 排行榜接口（新增）

```
1. 连续打卡排行:
   ZREVRANGE leaderboard:streak 0 9 WITHSCORES

2. 累计打卡排行:
   ZREVRANGE leaderboard:total_days 0 9 WITHSCORES
```

## 四、故障处理策略

### 1. Redis故障

当Redis不可用时：
- 临时切换到MySQL直接读写
- Redis恢复后，执行全量数据重建

### 2. 数据不一致修复

定期（如每周）执行校验任务：
- 比对Redis和MySQL中的打卡数据
- 发现不一致时进行修复
- 记录修复日志以便后续分析

### 3. 防止数据丢失

- Redis持久化配置（RDB+AOF混合模式）
- Redis主从复制+哨兵/集群保障高可用
- 定期备份Redis数据

## 五、实现示例

以更新连续打卡天数为例，伪代码如下：

```javascript
async function updateUserStreak(userId) {
  // 获取今天和昨天的日期
  const today = getFormattedDate(new Date());
  const yesterday = getFormattedDate(new Date(Date.now() - 86400000));
  
  // 检查昨天是否打卡
  const yesterdaySigned = await redis.get(`user:sign:daily:${userId}:${yesterday}`);
  
  // 更新连续打卡天数
  let currentStreak;
  if (yesterdaySigned === '1') {
    // 连续打卡
    currentStreak = await redis.incr(`user:sign:streak:${userId}`);
  } else {
    // 连续中断，重新计数
    currentStreak = 1;
    await redis.set(`user:sign:streak:${userId}`, 1);
  }
  
  // 更新最长连续打卡记录
  const maxStreak = await redis.get(`user:sign:max_streak:${userId}`);
  if (!maxStreak || currentStreak > parseInt(maxStreak)) {
    await redis.set(`user:sign:max_streak:${userId}`, currentStreak);
    
    // 关键节点双写保障
    await mysql.execute(
      'UPDATE user_stats SET max_streak_days = ? WHERE user_id = ?',
      [currentStreak, userId]
    );
  }
  
  // 更新排行榜
  await redis.zadd('leaderboard:streak', currentStreak, userId);
  
  // 标记今日已打卡
  await redis.set(`user:sign:daily:${userId}:${today}`, '1', 'EX', 259200);
  
  // 触发异步持久化
  await messageQueue.send('user.sign.updated', { userId, date: today });
}
```

## 六、性能与资源估算

### 1. Redis内存占用估算

假设系统有10万用户，每天活跃用户约1万：

- 每个用户当日打卡状态: ~50字节
- 每个用户连续打卡计数器: ~50字节
- 每个用户最长连续打卡记录: ~50字节
- 每个用户月度打卡位图: ~100字节
- 排行榜: ~10KB

估算总内存占用:
- 活跃用户数据: 1万 * (50 + 50 + 50 + 100) 字节 ≈ 2.5MB
- 所有用户数据: 10万 * (50 + 50) 字节 ≈ 10MB
- 排行榜: ~10KB
- 总计: 约12.5MB

### 2. 网络带宽估算

假设每天1万次打卡操作：
- 每次操作平均6个Redis命令
- 每个命令请求/响应约100字节
- 日均流量: 1万 * 6 * 100 * 2(请求+响应) ≈ 12MB/天

### 3. MySQL负载减轻

- 读操作减少约80%
- 写操作减少约50%（通过批量异步持久化）

## 七、优化收益

1. **性能提升**
   - 打卡操作响应时间: 从平均50ms降至<5ms
   - 查询连续打卡信息: 从平均30ms降至<3ms
   - 排行榜生成: 从秒级降至毫秒级

2. **系统稳定性**
   - 高峰期MySQL负载降低
   - 系统整体并发能力提升

3. **用户体验**
   - 打卡反馈更快速
   - 统计数据实时更新
   - 排行榜更新更及时

4. **成本效益**
   - 减少了MySQL连接数和查询量
   - 节省了数据库存储空间
   - 降低了数据库扩容需求

## 八、部署与监控建议

### 1. 部署架构

```
客户端 -> API服务器 -> Redis集群(主从+哨兵) -> 消息队列 -> 持久化服务 -> MySQL
```

### 2. 监控指标

- Redis命令执行时间
- 连接池使用情况
- 内存使用率
- 主从同步状态
- 持久化任务执行状态
- MySQL与Redis数据一致性

### 3. 报警机制

- Redis内存使用率>80%
- Redis与MySQL数据不一致率>1%
- 持久化任务失败
- 连续打卡数据异常变化

## 结论

本方案通过Redis优化用户打卡系统，在保证数据可靠性的前提下，显著提升了系统性能，特别是针对连续打卡、最长连续打卡等高频操作。方案实现了读写分离、异步持久化、故障恢复等机制，平衡了性能与数据一致性的需求。