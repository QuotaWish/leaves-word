// vite.config.ts
import { sentryVitePlugin } from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/@sentry+vite-plugin@3.2.2_encoding@0.1.13/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import path from "node:path";
import process from "node:process";
import Vue from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.14_@types+node@22.13.1_less@4.2.2_lightningcss@1.22.1_sass@_nuvq43two53iwpibumcjkbi3le/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import UnoCSS from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/unocss@0.62.4_postcss@8.5.1_rollup@4.34.4_vite@5.4.14_@types+node@22.13.1_less@4.2.2_lightnin_atjlqk3j4hp4zaogunqavuoj4m/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/unplugin-auto-import@0.18.6_@nuxt+kit@3.15.4_@vueuse+core@11.3.0_vue@3.5.13_typescript@5.7.3___rollup@4.34.4/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.9_@nuxt+kit@3.15.4_rollup@4.34.4_vue@3.5.13_typescript@5.7.3_/node_modules/unplugin-vue-components/dist/vite.js";
import VueMacros from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/unplugin-vue-macros@2.14.5_@vueuse+core@11.3.0_vue@3.5.13_typescript@5.7.3___esbuild@0.23.1_r_7r7qzqlcbxgec4iomuyppqe3xa/node_modules/unplugin-vue-macros/dist/vite.js";
import { VueRouterAutoImports } from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/unplugin-vue-router@0.10.9_rollup@4.34.4_vue-router@4.5.0_vue@3.5.13_typescript@5.7.3___vue@3.5.13_typescript@5.7.3_/node_modules/unplugin-vue-router/dist/index.js";
import VueRouter from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/unplugin-vue-router@0.10.9_rollup@4.34.4_vue-router@4.5.0_vue@3.5.13_typescript@5.7.3___vue@3.5.13_typescript@5.7.3_/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig, loadEnv } from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.1_less@4.2.2_lightningcss@1.22.1_sass@1.84.0_sugarss@2.0.0_terser@5.38.1/node_modules/vite/dist/node/index.js";
import { vitePluginVersionMark } from "file:///E:/Documents/%E5%8D%83%E5%8F%B6%E5%8D%95%E8%AF%8D/leaves-word/node_modules/.pnpm/vite-plugin-version-date-mark@0.1.0_vite@5.4.14_@types+node@22.13.1_less@4.2.2_lightningcss@1_eyie7hpxfnp26dq2abwj2dvs7i/node_modules/vite-plugin-version-date-mark/dist/vite/index.js";
var __vite_injected_original_dirname = "E:\\Documents\\\u5343\u53F6\u5355\u8BCD\\leaves-word\\apps\\view";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    resolve: {
      alias: {
        "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    plugins: [
      VueMacros({
        defineOptions: false,
        defineModels: false,
        plugins: {
          vue: Vue({
            script: {
              propsDestructure: true,
              defineModel: true
            }
          })
        }
      }),
      // https://github.com/posva/unplugin-vue-router
      VueRouter(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "@vueuse/core",
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            "vue-router/auto": ["useLink"]
          }
        ],
        dts: true,
        dirs: [
          "./src/composables"
        ],
        vueTemplate: true
      }),
      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true
      }),
      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      UnoCSS({}),
      // sentry connect
      sentryVitePlugin({
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        org: "quotawish",
        project: "leaves_word"
      }),
      // version displayer
      vitePluginVersionMark({
        name: "LEAVES_WORD",
        ifShortSHA: true,
        ifMeta: true,
        ifLog: true,
        ifGlobal: true
      })
    ],
    // https://github.com/vitest-dev/vitest
    test: {
      environment: "jsdom"
    },
    build: {
      sourcemap: true
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEb2N1bWVudHNcXFxcXHU1MzQzXHU1M0Y2XHU1MzU1XHU4QkNEXFxcXGxlYXZlcy13b3JkXFxcXGFwcHNcXFxcdmlld1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRG9jdW1lbnRzXFxcXFx1NTM0M1x1NTNGNlx1NTM1NVx1OEJDRFxcXFxsZWF2ZXMtd29yZFxcXFxhcHBzXFxcXHZpZXdcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0RvY3VtZW50cy8lRTUlOEQlODMlRTUlOEYlQjYlRTUlOEQlOTUlRTglQUYlOEQvbGVhdmVzLXdvcmQvYXBwcy92aWV3L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nXHJcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cclxuXHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcclxuaW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJ1xyXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IFZ1ZU1hY3JvcyBmcm9tICd1bnBsdWdpbi12dWUtbWFjcm9zL3ZpdGUnXHJcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcclxuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IHZpdGVQbHVnaW5WZXJzaW9uTWFyayB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZlcnNpb24tZGF0ZS1tYXJrJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiB7IG1vZGU6IHN0cmluZyB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxyXG5cclxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnfi8nOiBgJHtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyl9L2AsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIHBsdWdpbnM6IFtWdWVNYWNyb3Moe1xyXG4gICAgICBkZWZpbmVPcHRpb25zOiBmYWxzZSxcclxuICAgICAgZGVmaW5lTW9kZWxzOiBmYWxzZSxcclxuICAgICAgcGx1Z2luczoge1xyXG4gICAgICAgIHZ1ZTogVnVlKHtcclxuICAgICAgICAgIHNjcmlwdDoge1xyXG4gICAgICAgICAgICBwcm9wc0Rlc3RydWN0dXJlOiB0cnVlLFxyXG4gICAgICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSksXHJcbiAgICAgIH0sXHJcbiAgICB9KSwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXJcclxuICAgIFZ1ZVJvdXRlcigpLCAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tYXV0by1pbXBvcnRcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgVnVlUm91dGVyQXV0b0ltcG9ydHMsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLy8gYWRkIGFueSBvdGhlciBpbXBvcnRzIHlvdSB3ZXJlIHJlbHlpbmcgb25cclxuICAgICAgICAgICd2dWUtcm91dGVyL2F1dG8nOiBbJ3VzZUxpbmsnXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6IHRydWUsXHJcbiAgICAgIGRpcnM6IFtcclxuICAgICAgICAnLi9zcmMvY29tcG9zYWJsZXMnLFxyXG4gICAgICBdLFxyXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgIH0pLCAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tY29tcG9uZW50c1xyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIGR0czogdHJ1ZSxcclxuICAgIH0pLCAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXHJcbiAgICAvLyBzZWUgdW5vLmNvbmZpZy50cyBmb3IgY29uZmlnXHJcbiAgICBVbm9DU1Moe30pLFxyXG4gICAgLy8gc2VudHJ5IGNvbm5lY3RcclxuICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xyXG4gICAgICBhdXRoVG9rZW46IGVudi5WSVRFX1NFTlRSWV9BVVRIX1RPS0VOLFxyXG4gICAgICBvcmc6ICdxdW90YXdpc2gnLFxyXG4gICAgICBwcm9qZWN0OiAnbGVhdmVzX3dvcmQnLFxyXG4gICAgfSksXHJcbiAgICAvLyB2ZXJzaW9uIGRpc3BsYXllclxyXG4gICAgdml0ZVBsdWdpblZlcnNpb25NYXJrKHtcclxuICAgICAgbmFtZTogJ0xFQVZFU19XT1JEJyxcclxuICAgICAgaWZTaG9ydFNIQTogdHJ1ZSxcclxuICAgICAgaWZNZXRhOiB0cnVlLFxyXG4gICAgICBpZkxvZzogdHJ1ZSxcclxuICAgICAgaWZHbG9iYWw6IHRydWUsXHJcbiAgICB9KV0sXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVzdC1kZXYvdml0ZXN0XHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0pXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVixTQUFTLHdCQUF3QjtBQUdwWCxPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZUFBZTtBQUN0QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxTQUFTLDZCQUE2QjtBQWJ0QyxJQUFNLG1DQUFtQztBQWV6QyxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQXdCO0FBQzdDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFFdkMsU0FBTyxhQUFhO0FBQUEsSUFDbEIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsTUFBTSxHQUFHLEtBQUssUUFBUSxrQ0FBVyxLQUFLLENBQUM7QUFBQSxNQUN6QztBQUFBLElBQ0Y7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUFDLFVBQVU7QUFBQSxRQUNsQixlQUFlO0FBQUEsUUFDZixjQUFjO0FBQUEsUUFDZCxTQUFTO0FBQUEsVUFDUCxLQUFLLElBQUk7QUFBQSxZQUNQLFFBQVE7QUFBQSxjQUNOLGtCQUFrQjtBQUFBLGNBQ2xCLGFBQWE7QUFBQSxZQUNmO0FBQUEsVUFDRixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBO0FBQUEsTUFDRCxVQUFVO0FBQUE7QUFBQSxNQUNWLFdBQVc7QUFBQSxRQUNULFNBQVM7QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUE7QUFBQSxZQUVFLG1CQUFtQixDQUFDLFNBQVM7QUFBQSxVQUMvQjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLEtBQUs7QUFBQSxRQUNMLE1BQU07QUFBQSxVQUNKO0FBQUEsUUFDRjtBQUFBLFFBQ0EsYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVCxLQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUE7QUFBQTtBQUFBLE1BRUQsT0FBTyxDQUFDLENBQUM7QUFBQTtBQUFBLE1BRVQsaUJBQWlCO0FBQUEsUUFDZixXQUFXLElBQUk7QUFBQSxRQUNmLEtBQUs7QUFBQSxRQUNMLFNBQVM7QUFBQSxNQUNYLENBQUM7QUFBQTtBQUFBLE1BRUQsc0JBQXNCO0FBQUEsUUFDcEIsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBLFFBQ1AsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLElBQUM7QUFBQTtBQUFBLElBR0YsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLElBQ2Y7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUNiO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
