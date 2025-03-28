# 配音视频资源管理

## 目录结构
- video-resource.ts: 视频资源配置文件
- README.md: 说明文档

## 视频文件存放
视频文件应存放在项目的 public/videos/dub 目录下，并在 video-resource.ts 中使用相对路径引用。

## 视频资源配置
在 video-resource.ts 中配置视频资源信息，包括：
- type: 视频类型
- title: 视频标题
- desc: 视频描述
- author: 作者信息
- url: 视频文件路径（相对于 public 目录）