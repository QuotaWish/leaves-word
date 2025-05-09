-- CreateTable
CREATE TABLE `audio_file` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NULL,
    `content` MEDIUMTEXT NULL,
    `creator_id` BIGINT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` INTEGER NULL DEFAULT 0,
    `status` VARCHAR(50) NOT NULL DEFAULT 'UNKNOWN',
    `name` VARCHAR(255) NOT NULL DEFAULT '默认音频文件',

    INDEX `creator_id`(`creator_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER UNSIGNED NULL DEFAULT 0,
    `name` VARCHAR(100) NOT NULL,
    `sort_order` INTEGER NULL DEFAULT 0,
    `description` VARCHAR(500) NULL,
    `is_root` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_parent_id`(`parent_id`),
    INDEX `idx_sort_order`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dictionary_category` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dictionary_id` BIGINT UNSIGNED NOT NULL,
    `category_id` INTEGER UNSIGNED NOT NULL,
    `sort_order` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_category_id`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dictionary_word` (
    `dictionary_id` BIGINT NOT NULL,
    `word_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id` BIGINT NOT NULL,

    INDEX `word_id`(`word_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `english_dictionary` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `image_url` VARCHAR(255) NULL,
    `author` VARCHAR(255) NULL,
    `isbn` VARCHAR(13) NULL,
    `publication_date` DATE NULL,
    `publisher` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` BOOLEAN NULL DEFAULT false,
    `total_words` INTEGER NULL DEFAULT 0,
    `published_words` INTEGER NULL DEFAULT 0,
    `approved_words` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `english_word` (
    `id` BIGINT NOT NULL,
    `word_head` VARCHAR(255) NULL,
    `thumbnail` VARCHAR(255) NULL,
    `info` JSON NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` BOOLEAN NULL DEFAULT false,
    `status` VARCHAR(255) NULL,
    `manual_score` INTEGER NULL DEFAULT 0,
    `ai_score` INTEGER NULL,
    `reviewer` BIGINT NULL,
    `difficulty_level` INTEGER NULL DEFAULT 1,

    INDEX `idx_word_head`(`word_head`),
    INDEX `idx_difficulty`(`difficulty_level`),
    INDEX `idx_word_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `english_word_change_log` (
    `id` BIGINT NOT NULL,
    `english_word_id` BIGINT NOT NULL,
    `field_name` VARCHAR(255) NOT NULL,
    `old_value` TEXT NULL,
    `new_value` TEXT NULL,
    `change_time` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `changed_by` BIGINT NULL,

    INDEX `english_word_id`(`english_word_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_creator` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `word_id` BIGINT NOT NULL,
    `media_type` VARCHAR(50) NOT NULL,
    `media_url` VARCHAR(255) NULL,
    `creator_id` BIGINT NULL,
    `info` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `word_id`(`word_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(512) NULL,
    `content` TEXT NULL,
    `tags` VARCHAR(1024) NULL,
    `thumbNum` INTEGER NOT NULL DEFAULT 0,
    `favourNum` INTEGER NOT NULL DEFAULT 0,
    `userId` BIGINT NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_favour` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `postId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_postId`(`postId`),
    INDEX `idx_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_thumb` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `postId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_postId`(`postId`),
    INDEX `idx_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userAccount` VARCHAR(256) NOT NULL,
    `userPassword` VARCHAR(512) NOT NULL,
    `unionId` VARCHAR(256) NULL,
    `mpOpenId` VARCHAR(256) NULL,
    `userName` VARCHAR(256) NULL,
    `userAvatar` VARCHAR(1024) NULL,
    `userProfile` VARCHAR(512) NULL,
    `userRole` VARCHAR(256) NOT NULL DEFAULT 'user',
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isDelete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_unionId`(`unionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_config` (
    `user_id` BIGINT NOT NULL,
    `config_json` JSON NOT NULL,
    `update_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_status_change` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `word_id` BIGINT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `info` JSON NULL,
    `comment` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `game_type` VARCHAR(50) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `duration` INTEGER NOT NULL DEFAULT 0,
    `words_count` INTEGER NOT NULL DEFAULT 0,
    `correct_count` INTEGER NOT NULL DEFAULT 0,
    `wrong_count` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `game_data` JSON NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_user_id`(`user_id`),
    INDEX `idx_game_type`(`game_type`),
    INDEX `idx_created_at`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_points` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `total_points` INTEGER NOT NULL DEFAULT 0,
    `available_points` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_points_user_id_key`(`user_id`),
    INDEX `idx_level`(`level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `point_transaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_points_id` BIGINT NOT NULL,
    `amount` INTEGER NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `reference_id` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_user_points_id`(`user_points_id`),
    INDEX `idx_transaction_type`(`type`),
    INDEX `idx_transaction_time`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_progress` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `word_id` BIGINT NOT NULL,
    `action_type` VARCHAR(191) NOT NULL,
    `learning_details` JSON NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` TINYINT NOT NULL DEFAULT 0,
    `study_plan_id` BIGINT NULL,
    `source` VARCHAR(50) NULL,
    `device_info` JSON NULL,
    `attempt_count` INTEGER NOT NULL DEFAULT 1,
    `start_time` DATETIME(0) NULL,
    `end_time` DATETIME(0) NULL,

    INDEX `idx_learning_user_id`(`user_id`),
    INDEX `idx_learning_word_id`(`word_id`),
    INDEX `idx_learning_study_plan_id`(`study_plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_stats` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `total_words_learned` INTEGER NOT NULL DEFAULT 0,
    `total_review_time` INTEGER NOT NULL DEFAULT 0,
    `daily_streak` INTEGER NOT NULL DEFAULT 0,
    `longest_streak` INTEGER NOT NULL DEFAULT 0,
    `last_study_date` DATE NULL,
    `total_study_days` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `learning_stats_user_id_key`(`user_id`),
    INDEX `idx_daily_streak`(`daily_streak`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `icon_url` VARCHAR(255) NULL,
    `category` VARCHAR(50) NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 10,
    `requirements` JSON NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_achievement_category`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_achievement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `achievement_id` BIGINT NOT NULL,
    `achieved_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `progress` INTEGER NULL DEFAULT 0,
    `learning_stats_id` BIGINT NULL,

    INDEX `idx_achievement_id`(`achievement_id`),
    INDEX `idx_achieved_date`(`achieved_date`),
    UNIQUE INDEX `user_achievement_user_id_achievement_id_key`(`user_id`, `achievement_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_plan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NULL,
    `target_words` INTEGER NOT NULL DEFAULT 0,
    `daily_words` INTEGER NOT NULL DEFAULT 10,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_plan_user_id`(`user_id`),
    INDEX `idx_plan_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `word_collection` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `plan_id` BIGINT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `word_count` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_delete` TINYINT NOT NULL DEFAULT 0,

    INDEX `idx_collection_user_id`(`user_id`),
    INDEX `idx_is_public`(`is_public`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collection_word` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `collection_id` BIGINT NOT NULL,
    `word_id` BIGINT NOT NULL,
    `added_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `note` VARCHAR(500) NULL,

    INDEX `idx_collection_word_id`(`word_id`),
    UNIQUE INDEX `collection_word_collection_id_word_id_key`(`collection_id`, `word_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `audio_file` ADD CONSTRAINT `audio_file_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dictionary_word` ADD CONSTRAINT `dictionary_word_ibfk_1` FOREIGN KEY (`dictionary_id`) REFERENCES `english_dictionary`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dictionary_word` ADD CONSTRAINT `dictionary_word_ibfk_2` FOREIGN KEY (`word_id`) REFERENCES `english_word`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `english_word_change_log` ADD CONSTRAINT `english_word_change_log_ibfk_1` FOREIGN KEY (`english_word_id`) REFERENCES `english_word`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `media_creator` ADD CONSTRAINT `media_creator_ibfk_1` FOREIGN KEY (`word_id`) REFERENCES `english_word`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_config` ADD CONSTRAINT `user_config_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `game_record` ADD CONSTRAINT `game_record_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_points` ADD CONSTRAINT `user_points_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `point_transaction` ADD CONSTRAINT `point_transaction_user_points_id_fkey` FOREIGN KEY (`user_points_id`) REFERENCES `user_points`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `learning_progress` ADD CONSTRAINT `learning_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `learning_progress` ADD CONSTRAINT `learning_progress_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `english_word`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `learning_progress` ADD CONSTRAINT `learning_progress_study_plan_id_fkey` FOREIGN KEY (`study_plan_id`) REFERENCES `study_plan`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `learning_stats` ADD CONSTRAINT `learning_stats_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_achievement` ADD CONSTRAINT `user_achievement_learning_stats_id_fkey` FOREIGN KEY (`learning_stats_id`) REFERENCES `learning_stats`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_achievement` ADD CONSTRAINT `user_achievement_achievement_id_fkey` FOREIGN KEY (`achievement_id`) REFERENCES `achievement`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_achievement` ADD CONSTRAINT `user_achievement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `study_plan` ADD CONSTRAINT `study_plan_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `word_collection` ADD CONSTRAINT `word_collection_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `word_collection` ADD CONSTRAINT `word_collection_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `study_plan`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `collection_word` ADD CONSTRAINT `collection_word_collection_id_fkey` FOREIGN KEY (`collection_id`) REFERENCES `word_collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `collection_word` ADD CONSTRAINT `collection_word_word_id_fkey` FOREIGN KEY (`word_id`) REFERENCES `english_word`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

