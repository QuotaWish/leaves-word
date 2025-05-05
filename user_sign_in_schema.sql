-- MySQL 8.0 用户打卡系统数据库设计
-- 基于千叶单词(leaves-word)项目

-- 用户表
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(64) NOT NULL COMMENT '用户名',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `password_hash` varchar(255) NOT NULL COMMENT '密码哈希',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态: 1-正常, 0-禁用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  UNIQUE KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 词典表
CREATE TABLE `dictionaries` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '词典ID',
  `name` varchar(64) NOT NULL COMMENT '词典名称',
  `description` text DEFAULT NULL COMMENT '词典描述',
  `word_count` int(11) NOT NULL DEFAULT '0' COMMENT '单词总数',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='词典表';

-- 单词表
CREATE TABLE `words` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '单词ID',
  `dictionary_id` bigint(20) NOT NULL COMMENT '所属词典ID',
  `word` varchar(128) NOT NULL COMMENT '单词',
  `info` json DEFAULT NULL COMMENT '单词详细信息(JSON格式)',
  `status` varchar(32) DEFAULT 'NORMAL' COMMENT '单词状态',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_dict_word` (`dictionary_id`, `word`),
  KEY `idx_word` (`word`),
  CONSTRAINT `fk_words_dictionary` FOREIGN KEY (`dictionary_id`) REFERENCES `dictionaries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='单词表';

-- 用户打卡日历表
CREATE TABLE `user_calendar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日历ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `year` int(4) NOT NULL COMMENT '年份',
  `month` int(2) NOT NULL COMMENT '月份(1-12)',
  `sign_days` varchar(32) NOT NULL DEFAULT '' COMMENT '签到天数位图(第n位表示第n天是否签到:1已签,0未签)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_year_month` (`user_id`, `year`, `month`),
  CONSTRAINT `fk_calendar_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户打卡日历表';

-- 用户签到详情表
CREATE TABLE `user_sign_data` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '签到ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `calendar_id` bigint(20) NOT NULL COMMENT '关联的日历ID',
  `day` int(2) NOT NULL COMMENT '签到日期(1-31)',
  `sign_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '签到时间',
  `duration` int(11) NOT NULL DEFAULT '0' COMMENT '学习时长(秒)',
  `word_count` int(11) NOT NULL DEFAULT '0' COMMENT '学习单词数量',
  `completed` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否完成任务: 1-是, 0-否',
  `mode_type` varchar(32) DEFAULT NULL COMMENT '学习模式',
  `stats_data` json DEFAULT NULL COMMENT '统计数据(JSON格式)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_calendar_day` (`user_id`, `calendar_id`, `day`),
  KEY `idx_calendar` (`calendar_id`),
  KEY `idx_user_date` (`user_id`, `sign_date`),
  CONSTRAINT `fk_sign_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sign_calendar` FOREIGN KEY (`calendar_id`) REFERENCES `user_calendar` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户签到详情表';

-- 用户学习单词记录表
CREATE TABLE `user_word_history` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `sign_id` bigint(20) NOT NULL COMMENT '关联的签到ID',
  `word_id` bigint(20) NOT NULL COMMENT '单词ID',
  `learned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '学习时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_sign_word` (`user_id`, `sign_id`, `word_id`),
  KEY `idx_sign` (`sign_id`),
  KEY `idx_word` (`word_id`),
  CONSTRAINT `fk_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_sign` FOREIGN KEY (`sign_id`) REFERENCES `user_sign_data` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_word` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户学习单词记录表';

-- 用户统计表
CREATE TABLE `user_stats` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `total_words` int(11) NOT NULL DEFAULT '0' COMMENT '总学习单词数',
  `total_days` int(11) NOT NULL DEFAULT '0' COMMENT '总打卡天数',
  `streak_days` int(11) NOT NULL DEFAULT '0' COMMENT '连续打卡天数',
  `max_streak_days` int(11) NOT NULL DEFAULT '0' COMMENT '最长连续打卡天数',
  `total_duration` bigint(20) NOT NULL DEFAULT '0' COMMENT '总学习时长(秒)',
  `last_sign_date` date DEFAULT NULL COMMENT '最后打卡日期',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user` (`user_id`),
  CONSTRAINT `fk_stats_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户统计表';

-- 用户学习单词进度表
CREATE TABLE `user_word_progress` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '进度ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `word_id` bigint(20) NOT NULL COMMENT '单词ID',
  `dictionary_id` bigint(20) NOT NULL COMMENT '词典ID',
  `first_learned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次学习时间',
  `last_reviewed_at` timestamp NULL DEFAULT NULL COMMENT '最后复习时间',
  `review_count` int(11) NOT NULL DEFAULT '0' COMMENT '复习次数',
  `mastery_level` tinyint(1) NOT NULL DEFAULT '0' COMMENT '掌握程度(0-5)',
  `next_review_at` timestamp NULL DEFAULT NULL COMMENT '下次复习时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_word` (`user_id`, `word_id`),
  KEY `idx_user_dict` (`user_id`, `dictionary_id`),
  KEY `idx_word` (`word_id`),
  KEY `idx_dictionary` (`dictionary_id`),
  CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_word` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_dict` FOREIGN KEY (`dictionary_id`) REFERENCES `dictionaries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户学习单词进度表';

-- 创建打卡相关的存储过程

-- 用户签到存储过程
DELIMITER $$
CREATE PROCEDURE `proc_user_sign_in`(
  IN p_user_id BIGINT,
  IN p_year INT,
  IN p_month INT,
  IN p_day INT, 
  IN p_duration INT,
  IN p_word_count INT,
  IN p_completed TINYINT,
  IN p_mode_type VARCHAR(32),
  IN p_stats_data JSON
)
BEGIN
  DECLARE v_calendar_id BIGINT;
  DECLARE v_sign_id BIGINT;
  DECLARE v_sign_days VARCHAR(32);
  DECLARE v_today DATE;
  DECLARE v_last_sign_date DATE;
  DECLARE v_streak_days INT;
  
  -- 设置今天日期
  SET v_today = CURDATE();
  
  -- 开始事务
  START TRANSACTION;
  
  -- 查找或创建日历记录
  SELECT id, sign_days INTO v_calendar_id, v_sign_days 
  FROM user_calendar 
  WHERE user_id = p_user_id AND year = p_year AND month = p_month
  LIMIT 1;
  
  IF v_calendar_id IS NULL THEN
    -- 创建新日历记录
    INSERT INTO user_calendar (user_id, year, month, sign_days)
    VALUES (p_user_id, p_year, p_month, '');
    
    SET v_calendar_id = LAST_INSERT_ID();
    SET v_sign_days = '';
  END IF;
  
  -- 更新签到位图
  IF LENGTH(v_sign_days) < p_day THEN
    SET v_sign_days = LPAD(v_sign_days, p_day, '0');
  END IF;
  
  SET v_sign_days = 
    CONCAT(
      LEFT(v_sign_days, p_day - 1),
      '1',
      IF(LENGTH(v_sign_days) > p_day, SUBSTRING(v_sign_days, p_day + 1), '')
    );
  
  -- 更新日历记录
  UPDATE user_calendar 
  SET sign_days = v_sign_days
  WHERE id = v_calendar_id;
  
  -- 添加或更新签到详情
  SELECT id INTO v_sign_id
  FROM user_sign_data
  WHERE user_id = p_user_id AND calendar_id = v_calendar_id AND day = p_day;
  
  IF v_sign_id IS NULL THEN
    -- 插入新签到记录
    INSERT INTO user_sign_data (
      user_id, calendar_id, day, duration, word_count, 
      completed, mode_type, stats_data
    ) VALUES (
      p_user_id, v_calendar_id, p_day, p_duration, p_word_count, 
      p_completed, p_mode_type, p_stats_data
    );
    
    SET v_sign_id = LAST_INSERT_ID();
  ELSE
    -- 更新签到记录
    UPDATE user_sign_data
    SET 
      duration = p_duration,
      word_count = p_word_count,
      completed = p_completed,
      mode_type = p_mode_type,
      stats_data = p_stats_data,
      sign_date = CURRENT_TIMESTAMP
    WHERE id = v_sign_id;
  END IF;
  
  -- 更新用户统计信息
  SELECT 
    last_sign_date, 
    streak_days
  INTO 
    v_last_sign_date, 
    v_streak_days
  FROM user_stats
  WHERE user_id = p_user_id;
  
  IF v_last_sign_date IS NOT NULL THEN
    -- 计算连续打卡天数
    IF DATEDIFF(v_today, v_last_sign_date) = 1 THEN
      -- 连续打卡
      SET v_streak_days = v_streak_days + 1;
    ELSEIF DATEDIFF(v_today, v_last_sign_date) > 1 THEN
      -- 中断连续打卡
      SET v_streak_days = 1;
    END IF;
  ELSE
    -- 首次打卡
    SET v_streak_days = 1;
  END IF;
  
  -- 更新用户统计
  INSERT INTO user_stats (
    user_id, total_words, total_days, streak_days, 
    max_streak_days, total_duration, last_sign_date
  ) VALUES (
    p_user_id, p_word_count, 1, v_streak_days,
    v_streak_days, p_duration, v_today
  )
  ON DUPLICATE KEY UPDATE
    total_words = total_words + p_word_count,
    total_days = total_days + IF(last_sign_date IS NULL OR last_sign_date < v_today, 1, 0),
    streak_days = v_streak_days,
    max_streak_days = GREATEST(max_streak_days, v_streak_days),
    total_duration = total_duration + p_duration,
    last_sign_date = v_today;
  
  COMMIT;
  
  -- 返回签到ID
  SELECT v_sign_id AS sign_id;
END$$
DELIMITER ;

-- 添加用户学习单词记录的存储过程
DELIMITER $$
CREATE PROCEDURE `proc_add_user_word_history`(
  IN p_user_id BIGINT,
  IN p_sign_id BIGINT,
  IN p_word_ids TEXT -- 逗号分隔的单词ID列表
)
BEGIN
  DECLARE v_word_id BIGINT;
  DECLARE v_dictionary_id BIGINT;
  DECLARE v_done INT DEFAULT FALSE;
  DECLARE v_pos INT DEFAULT 1;
  DECLARE v_next_pos INT;
  DECLARE v_word_ids_len INT;
  
  -- 开始事务
  START TRANSACTION;
  
  SET v_word_ids_len = LENGTH(p_word_ids);
  
  -- 循环处理每个单词ID
  WHILE v_pos <= v_word_ids_len DO
    SET v_next_pos = LOCATE(',', p_word_ids, v_pos);
    IF v_next_pos = 0 THEN
      SET v_next_pos = v_word_ids_len + 1;
    END IF;
    
    SET v_word_id = CAST(SUBSTRING(p_word_ids, v_pos, v_next_pos - v_pos) AS UNSIGNED);
    
    -- 获取词典ID
    SELECT dictionary_id INTO v_dictionary_id
    FROM words
    WHERE id = v_word_id;
    
    -- 添加学习记录
    INSERT INTO user_word_history (user_id, sign_id, word_id)
    VALUES (p_user_id, p_sign_id, v_word_id)
    ON DUPLICATE KEY UPDATE learned_at = CURRENT_TIMESTAMP;
    
    -- 更新或添加用户单词进度
    INSERT INTO user_word_progress (
      user_id, word_id, dictionary_id, 
      first_learned_at, last_reviewed_at,
      review_count, mastery_level, next_review_at
    ) VALUES (
      p_user_id, v_word_id, v_dictionary_id,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
      1, 1, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)
    )
    ON DUPLICATE KEY UPDATE
      last_reviewed_at = CURRENT_TIMESTAMP,
      review_count = review_count + 1,
      mastery_level = LEAST(mastery_level + 1, 5),
      next_review_at = CASE
        WHEN mastery_level < 5 THEN 
          DATE_ADD(CURRENT_TIMESTAMP, INTERVAL POW(2, LEAST(mastery_level + 1, 5)) DAY)
        ELSE NULL
      END;
    
    SET v_pos = v_next_pos + 1;
  END WHILE;
  
  COMMIT;
END$$
DELIMITER ;

-- 获取用户打卡日历数据的存储过程
DELIMITER $$
CREATE PROCEDURE `proc_get_user_calendar`(
  IN p_user_id BIGINT,
  IN p_year INT,
  IN p_month INT
)
BEGIN
  -- 基本日历信息
  SELECT 
    uc.id,
    uc.user_id,
    uc.year,
    uc.month,
    uc.sign_days,
    -- 获取该月份的打卡天数
    (LENGTH(uc.sign_days) - LENGTH(REPLACE(uc.sign_days, '1', ''))) AS total_sign_days,
    -- 判断是否连续打卡中
    EXISTS (
      SELECT 1 
      FROM user_stats us 
      WHERE us.user_id = p_user_id AND us.last_sign_date = CURDATE()
    ) AS is_signed_today,
    -- 获取用户当前连续打卡天数
    (SELECT streak_days FROM user_stats WHERE user_id = p_user_id) AS streak_days
  FROM 
    user_calendar uc 
  WHERE 
    uc.user_id = p_user_id AND uc.year = p_year AND uc.month = p_month;
  
  -- 签到详情
  SELECT 
    usd.id,
    usd.user_id,
    usd.calendar_id,
    usd.day,
    usd.sign_date,
    usd.duration,
    usd.word_count,
    usd.completed,
    usd.mode_type,
    usd.stats_data,
    -- 当天学习的单词列表
    (
      SELECT JSON_ARRAYAGG(w.word)
      FROM user_word_history uwh
      JOIN words w ON uwh.word_id = w.id
      WHERE uwh.user_id = p_user_id AND uwh.sign_id = usd.id
    ) AS word_list
  FROM 
    user_sign_data usd
  JOIN 
    user_calendar uc ON usd.calendar_id = uc.id
  WHERE 
    usd.user_id = p_user_id AND uc.year = p_year AND uc.month = p_month
  ORDER BY 
    usd.day;
END$$
DELIMITER ;

-- 获取用户学习统计数据的存储过程
DELIMITER $$
CREATE PROCEDURE `proc_get_user_stats`(
  IN p_user_id BIGINT
)
BEGIN
  -- 基本统计信息
  SELECT 
    us.total_words,
    us.total_days,
    us.streak_days,
    us.max_streak_days,
    us.total_duration,
    us.last_sign_date,
    -- 计算今日学习单词数
    IFNULL(
      (SELECT SUM(usd.word_count)
       FROM user_sign_data usd
       WHERE usd.user_id = p_user_id
       AND DATE(usd.sign_date) = CURDATE()),
      0
    ) AS today_words,
    -- 计算本周学习单词数
    IFNULL(
      (SELECT SUM(usd.word_count)
       FROM user_sign_data usd
       WHERE usd.user_id = p_user_id
       AND YEARWEEK(usd.sign_date) = YEARWEEK(CURDATE())),
      0
    ) AS week_words,
    -- 计算本月学习单词数
    IFNULL(
      (SELECT SUM(usd.word_count)
       FROM user_sign_data usd
       WHERE usd.user_id = p_user_id
       AND YEAR(usd.sign_date) = YEAR(CURDATE()) 
       AND MONTH(usd.sign_date) = MONTH(CURDATE())),
      0
    ) AS month_words,
    -- 计算掌握单词数(mastery_level >= 3)
    (SELECT COUNT(*)
     FROM user_word_progress uwp
     WHERE uwp.user_id = p_user_id
     AND uwp.mastery_level >= 3) AS mastered_words,
    -- 计算本月连续打卡天数
    (SELECT MAX(consecutive_days)
     FROM (
        SELECT 
          day, 
          (@rn := @rn + 1) AS rn,
          (day - @rn) AS grp
        FROM 
          (SELECT 
             DAY(usd.sign_date) AS day
           FROM user_sign_data usd
           JOIN user_calendar uc ON usd.calendar_id = uc.id
           WHERE usd.user_id = p_user_id
             AND YEAR(usd.sign_date) = YEAR(CURDATE())
             AND MONTH(usd.sign_date) = MONTH(CURDATE())
           GROUP BY DAY(usd.sign_date)
           ORDER BY day) AS d
        CROSS JOIN (SELECT @rn := 0) AS vars
     ) AS t
     GROUP BY grp
     ORDER BY COUNT(*) DESC
     LIMIT 1) AS month_consecutive_days
  FROM 
    user_stats us
  WHERE 
    us.user_id = p_user_id;
    
  -- 词典学习进度
  SELECT 
    d.id AS dictionary_id,
    d.name AS dictionary_name,
    d.word_count AS total_dictionary_words,
    COUNT(DISTINCT uwp.word_id) AS learned_words,
    ROUND(COUNT(DISTINCT uwp.word_id) * 100.0 / d.word_count, 2) AS progress_percentage
  FROM 
    dictionaries d
  LEFT JOIN 
    user_word_progress uwp ON d.id = uwp.dictionary_id AND uwp.user_id = p_user_id
  GROUP BY 
    d.id, d.name, d.word_count;
END$$
DELIMITER ; 