const e=JSON.parse('{"key":"v-fde6e23a","path":"/code/system-design/system-design-primer/scaling_aws.html","title":"\u5728 AWS \u4E0A\u8BBE\u8BA1\u652F\u6301\u767E\u4E07\u7EA7\u5230\u5343\u4E07\u7EA7\u7528\u6237\u7684\u7CFB\u7EDF","lang":"zh-CN","frontmatter":{"isOriginal":false,"order":-9999,"article":false,"category":["\u8F6C\u8F7D"],"tag":["\u7CFB\u7EDF\u8BBE\u8BA1"],"summary":"\\" - \u539F\u6587\u5730\u5740\uFF1Agithub.com/donnemartin/system-design-primer\\" \\" - \u8BD1\u6587\u51FA\u81EA\uFF1A\u6398\u91D1\u7FFB\u8BD1\u8BA1\u5212\\" \\" - \u8BD1\u8005\uFF1AXatMassacrE\u3001L9m\u3001Airmacho\u3001xiaoyusilen\u3001jifaxu\u3001\u6839\u53F7\u4E09\\" \u5728 AWS \u4E0A\u8BBE\u8BA1\u652F\u6301\u767E\u4E07\u7EA7\u5230\u5343\u4E07\u7EA7\u7528\u6237\u7684\u7CFB\u7EDF \u6CE8\u91CA\uFF1A\u4E3A\u4E86\u907F\u514D\u91CD\u590D\uFF0C\u8FD9\u7BC7\u6587\u7AE0\u7684\u94FE\u63A5\u76F4\u63A5\u5173\u8054\u5230 \u7CFB\u7EDF\u8BBE\u8BA1\u4E3B\u9898","head":[["meta",{"property":"og:url","content":"https://timpcfan.site/code/system-design/system-design-primer/scaling_aws.html"}],["meta",{"property":"og:site_name","content":"TrystanLei"}],["meta",{"property":"og:title","content":"\u5728 AWS \u4E0A\u8BBE\u8BA1\u652F\u6301\u767E\u4E07\u7EA7\u5230\u5343\u4E07\u7EA7\u7528\u6237\u7684\u7CFB\u7EDF"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2022-10-02T15:15:58.000Z"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:tag","content":"\u7CFB\u7EDF\u8BBE\u8BA1"}],["meta",{"property":"article:modified_time","content":"2022-10-02T15:15:58.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"\u7B2C 1 \u6B65\uFF1A\u7528\u4F8B\u548C\u7EA6\u675F\u6982\u8981","slug":"\u7B2C-1-\u6B65-\u7528\u4F8B\u548C\u7EA6\u675F\u6982\u8981","children":[{"level":3,"title":"\u7528\u4F8B","slug":"\u7528\u4F8B","children":[]},{"level":3,"title":"\u7EA6\u675F\u548C\u5047\u8BBE","slug":"\u7EA6\u675F\u548C\u5047\u8BBE","children":[]}]},{"level":2,"title":"\u7B2C 2 \u6B65\uFF1A\u521B\u5EFA\u9AD8\u7EA7\u8BBE\u8BA1\u65B9\u6848","slug":"\u7B2C-2-\u6B65-\u521B\u5EFA\u9AD8\u7EA7\u8BBE\u8BA1\u65B9\u6848","children":[]},{"level":2,"title":"\u7B2C 3 \u6B65\uFF1A\u8BBE\u8BA1\u6838\u5FC3\u7EC4\u4EF6","slug":"\u7B2C-3-\u6B65-\u8BBE\u8BA1\u6838\u5FC3\u7EC4\u4EF6","children":[{"level":3,"title":"\u7528\u4F8B\uFF1A\u7528\u6237\u8FDB\u884C\u8BFB\u5199\u8BF7\u6C42","slug":"\u7528\u4F8B-\u7528\u6237\u8FDB\u884C\u8BFB\u5199\u8BF7\u6C42","children":[]}]},{"level":2,"title":"\u7B2C 4 \u6B65\uFF1A\u6269\u5C55\u8BBE\u8BA1","slug":"\u7B2C-4-\u6B65-\u6269\u5C55\u8BBE\u8BA1","children":[{"level":3,"title":"\u7528\u6237+","slug":"\u7528\u6237","children":[]},{"level":3,"title":"\u7528\u6237+++","slug":"\u7528\u6237-1","children":[]},{"level":3,"title":"\u7528\u6237+++","slug":"\u7528\u6237-2","children":[]},{"level":3,"title":"\u7528\u6237++++","slug":"\u7528\u6237-3","children":[]},{"level":3,"title":"\u7528\u6237+++++","slug":"\u7528\u6237-4","children":[]}]},{"level":2,"title":"\u989D\u5916\u7684\u8BDD\u9898","slug":"\u989D\u5916\u7684\u8BDD\u9898","children":[{"level":3,"title":"SQL \u6269\u5C55\u6A21\u5F0F","slug":"sql-\u6269\u5C55\u6A21\u5F0F","children":[]},{"level":3,"title":"\u7F13\u5B58","slug":"\u7F13\u5B58","children":[]},{"level":3,"title":"\u5F02\u6B65\u6027\u548C\u5FAE\u670D\u52A1","slug":"\u5F02\u6B65\u6027\u548C\u5FAE\u670D\u52A1","children":[]},{"level":3,"title":"\u6C9F\u901A","slug":"\u6C9F\u901A","children":[]},{"level":3,"title":"\u5B89\u5168\u6027","slug":"\u5B89\u5168\u6027","children":[]},{"level":3,"title":"\u5EF6\u8FDF\u6570\u5B57\u6307\u6807","slug":"\u5EF6\u8FDF\u6570\u5B57\u6307\u6807","children":[]},{"level":3,"title":"\u6B63\u5728\u8FDB\u884C","slug":"\u6B63\u5728\u8FDB\u884C","children":[]}]}],"git":{"createdTime":1664722947000,"updatedTime":1664723758000,"contributors":[{"name":"timpcfan","email":"lztsmail@gmail.com","commits":2}]},"readingTime":{"minutes":13.99,"words":4196},"filePathRelative":"code/system-design/system-design-primer/scaling_aws.md","localizedDate":"2022\u5E7410\u67082\u65E5"}');export{e as data};
