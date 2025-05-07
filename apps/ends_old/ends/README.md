团队仓库中的目录格式如下所示：
```
.
├── component-def
│   └── comp-def-A.yaml #服务模版
├── configs
│   └── configmap-A.yaml #团队配置
├── index
│   └── ComponentIndex.yaml #团队配置
│   └── TraitIndex.yaml #团队配置
├── provisions
│   └── testing.tf #资源声明（IaC）   
└── trait-def
    └── trait-def-A.yaml #运维插件
```