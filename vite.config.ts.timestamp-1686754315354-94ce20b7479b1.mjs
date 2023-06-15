// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///Users/carmineporricelli/Documents/GitHub/pdnd-interop-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/carmineporricelli/Documents/GitHub/pdnd-interop-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { visualizer } from "file:///Users/carmineporricelli/Documents/GitHub/pdnd-interop-frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { parse } from "file:///Users/carmineporricelli/Documents/GitHub/pdnd-interop-frontend/node_modules/node-html-parser/dist/index.js";
var __vite_injected_original_dirname = "/Users/carmineporricelli/Documents/GitHub/pdnd-interop-frontend";
var vite_config_default = defineConfig(({ mode }) => {
  const prodPlugins = [react(), setNonceAttToScripts()];
  const devPlugins = [react(), visualizer(), configurePreviewServer()];
  const testPlugins = [react()];
  const plugins = mode === "development" ? devPlugins : mode === "production" ? prodPlugins : mode === "test" ? testPlugins : void 0;
  return {
    base: "/ui",
    plugins,
    resolve: {
      alias: {
        "@/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    build: {
      target: "es2017",
      minify: mode !== "development",
      sourcemap: mode === "development",
      rollupOptions: {
        external
      },
      commonjsOptions: {
        /** 'auto' does not work very well for mui's icons-material package */
        defaultIsModuleExports(id) {
          if (/@mui\/icons-material/.test(id))
            return false;
          return "auto";
        }
      },
      chunkSizeWarningLimit: 1800
    },
    envPrefix: "REACT_APP_",
    server: {
      port: 3e3
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./setupTests.js",
      coverage: {
        reporter: ["text", "lcov"],
        exclude: [
          "**/node_modules/**",
          "**/__tests__/**",
          "**/__test__/**",
          "**/__mocks__/**",
          "**/api/agreement/**",
          "**/api/attribute/**",
          "**/api/auth/**",
          "**/api/client/**",
          "**/api/eservice/**",
          "**/api/party/**",
          "**/api/purpose/**"
        ]
      }
    }
  };
});
function setNonceAttToScripts() {
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "post",
      transform(html) {
        const dom = parse(html);
        dom.querySelectorAll("script").forEach((script) => {
          script.setAttribute("nonce", "**CSP_NONCE**");
        });
        return dom.toString();
      }
    }
  };
}
function external(source) {
  const chunksToRemove = [];
  return chunksToRemove.some((chunk) => source.includes(chunk));
}
function configurePreviewServer() {
  const testNonce = "OXtve5rl0YunhKAkT+Qlww==";
  const env = Object.assign(process.env, loadEnv("development", process.cwd(), ""));
  return {
    name: "configure-preview-server",
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader(
          "Content-Security-Policy",
          `default-src 'self'; object-src 'none'; connect-src 'self' ${env.REACT_APP_API_HOST}; script-src 'nonce-${testNonce}'; style-src 'self' 'unsafe-inline'; worker-src 'none'; font-src 'self'; img-src 'self' data:; base-uri 'self'`
        );
        next();
      });
    },
    transformIndexHtml: {
      enforce: "post",
      transform(html) {
        const dom = parse(html);
        dom.querySelectorAll("script").forEach((script) => {
          script.setAttribute("nonce", testNonce);
        });
        return dom.toString().replace("**CSP_NONCE**", testNonce);
      }
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FybWluZXBvcnJpY2VsbGkvRG9jdW1lbnRzL0dpdEh1Yi9wZG5kLWludGVyb3AtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9jYXJtaW5lcG9ycmljZWxsaS9Eb2N1bWVudHMvR2l0SHViL3BkbmQtaW50ZXJvcC1mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY2FybWluZXBvcnJpY2VsbGkvRG9jdW1lbnRzL0dpdEh1Yi9wZG5kLWludGVyb3AtZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB0eXBlIHsgUGx1Z2luT3B0aW9uIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ25vZGUtaHRtbC1wYXJzZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IHByb2RQbHVnaW5zID0gW3JlYWN0KCksIHNldE5vbmNlQXR0VG9TY3JpcHRzKCldXG4gIGNvbnN0IGRldlBsdWdpbnMgPSBbcmVhY3QoKSwgdmlzdWFsaXplcigpLCBjb25maWd1cmVQcmV2aWV3U2VydmVyKCldXG4gIGNvbnN0IHRlc3RQbHVnaW5zID0gW3JlYWN0KCldXG5cbiAgY29uc3QgcGx1Z2lucyA9XG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50J1xuICAgICAgPyBkZXZQbHVnaW5zXG4gICAgICA6IG1vZGUgPT09ICdwcm9kdWN0aW9uJ1xuICAgICAgPyBwcm9kUGx1Z2luc1xuICAgICAgOiBtb2RlID09PSAndGVzdCdcbiAgICAgID8gdGVzdFBsdWdpbnNcbiAgICAgIDogdW5kZWZpbmVkXG5cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnL3VpJyxcbiAgICBwbHVnaW5zLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdALyc6IGAke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKX0vYCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDE3JyxcbiAgICAgIG1pbmlmeTogbW9kZSAhPT0gJ2RldmVsb3BtZW50JyxcbiAgICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgZXh0ZXJuYWwsXG4gICAgICB9LFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIC8qKiAnYXV0bycgZG9lcyBub3Qgd29yayB2ZXJ5IHdlbGwgZm9yIG11aSdzIGljb25zLW1hdGVyaWFsIHBhY2thZ2UgKi9cbiAgICAgICAgZGVmYXVsdElzTW9kdWxlRXhwb3J0cyhpZCkge1xuICAgICAgICAgIGlmICgvQG11aVxcL2ljb25zLW1hdGVyaWFsLy50ZXN0KGlkKSkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgcmV0dXJuICdhdXRvJ1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTgwMCxcbiAgICB9LFxuICAgIGVudlByZWZpeDogJ1JFQUNUX0FQUF8nLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogMzAwMCxcbiAgICB9LFxuICAgIHRlc3Q6IHtcbiAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICAgIHNldHVwRmlsZXM6ICcuL3NldHVwVGVzdHMuanMnLFxuICAgICAgY292ZXJhZ2U6IHtcbiAgICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdsY292J10sXG4gICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICAnKiovbm9kZV9tb2R1bGVzLyoqJyxcbiAgICAgICAgICAnKiovX190ZXN0c19fLyoqJyxcbiAgICAgICAgICAnKiovX190ZXN0X18vKionLFxuICAgICAgICAgICcqKi9fX21vY2tzX18vKionLFxuICAgICAgICAgICcqKi9hcGkvYWdyZWVtZW50LyoqJyxcbiAgICAgICAgICAnKiovYXBpL2F0dHJpYnV0ZS8qKicsXG4gICAgICAgICAgJyoqL2FwaS9hdXRoLyoqJyxcbiAgICAgICAgICAnKiovYXBpL2NsaWVudC8qKicsXG4gICAgICAgICAgJyoqL2FwaS9lc2VydmljZS8qKicsXG4gICAgICAgICAgJyoqL2FwaS9wYXJ0eS8qKicsXG4gICAgICAgICAgJyoqL2FwaS9wdXJwb3NlLyoqJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxufSlcblxuLyoqXG4gKiBBZGRzIG5vbmNlIGF0dHJpYnV0ZSB3aXRoIHBsYWNlaG9sZGVyIHRvIGFsbCBzY3JpcHQgdGFncyBpbiBpbmRleC5odG1sXG4gKi9cbmZ1bmN0aW9uIHNldE5vbmNlQXR0VG9TY3JpcHRzKCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2h0bWwtdHJhbnNmb3JtJyxcbiAgICB0cmFuc2Zvcm1JbmRleEh0bWw6IHtcbiAgICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICAgIHRyYW5zZm9ybShodG1sKSB7XG4gICAgICAgIGNvbnN0IGRvbSA9IHBhcnNlKGh0bWwpXG4gICAgICAgIGRvbS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKS5mb3JFYWNoKChzY3JpcHQpID0+IHtcbiAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdub25jZScsICcqKkNTUF9OT05DRSoqJylcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGRvbS50b1N0cmluZygpXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGhlbHBzIHRvIG1hbnVhbGx5IHJlbW92ZSBjaHVua3Mgb2YgY29kZSBvZiBsaWJyYXJpZXMgdGhhdCBkbyBub3Qgc3VwcG9ydCB0cmVlc2hha2luZ1xuICovXG5mdW5jdGlvbiBleHRlcm5hbChzb3VyY2U6IHN0cmluZykge1xuICBjb25zdCBjaHVua3NUb1JlbW92ZSA9IFtdXG4gIHJldHVybiBjaHVua3NUb1JlbW92ZS5zb21lKChjaHVuaykgPT4gc291cmNlLmluY2x1ZGVzKGNodW5rKSlcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlUHJldmlld1NlcnZlcigpOiBQbHVnaW5PcHRpb24ge1xuICBjb25zdCB0ZXN0Tm9uY2UgPSAnT1h0dmU1cmwwWXVuaEtBa1QrUWx3dz09J1xuICBjb25zdCBlbnYgPSBPYmplY3QuYXNzaWduKHByb2Nlc3MuZW52LCBsb2FkRW52KCdkZXZlbG9wbWVudCcsIHByb2Nlc3MuY3dkKCksICcnKSlcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdjb25maWd1cmUtcHJldmlldy1zZXJ2ZXInLFxuICAgIGNvbmZpZ3VyZVByZXZpZXdTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICByZXMuc2V0SGVhZGVyKFxuICAgICAgICAgICdDb250ZW50LVNlY3VyaXR5LVBvbGljeScsXG4gICAgICAgICAgYGRlZmF1bHQtc3JjICdzZWxmJzsgb2JqZWN0LXNyYyAnbm9uZSc7IGNvbm5lY3Qtc3JjICdzZWxmJyAke2Vudi5SRUFDVF9BUFBfQVBJX0hPU1R9OyBzY3JpcHQtc3JjICdub25jZS0ke3Rlc3ROb25jZX0nOyBzdHlsZS1zcmMgJ3NlbGYnICd1bnNhZmUtaW5saW5lJzsgd29ya2VyLXNyYyAnbm9uZSc7IGZvbnQtc3JjICdzZWxmJzsgaW1nLXNyYyAnc2VsZicgZGF0YTo7IGJhc2UtdXJpICdzZWxmJ2BcbiAgICAgICAgKVxuICAgICAgICBuZXh0KClcbiAgICAgIH0pXG4gICAgfSxcbiAgICB0cmFuc2Zvcm1JbmRleEh0bWw6IHtcbiAgICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICAgIHRyYW5zZm9ybShodG1sKSB7XG4gICAgICAgIGNvbnN0IGRvbSA9IHBhcnNlKGh0bWwpXG4gICAgICAgIGRvbS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKS5mb3JFYWNoKChzY3JpcHQpID0+IHtcbiAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdub25jZScsIHRlc3ROb25jZSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGRvbS50b1N0cmluZygpLnJlcGxhY2UoJyoqQ1NQX05PTkNFKionLCB0ZXN0Tm9uY2UpXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1csT0FBTyxVQUFVO0FBQ2hZLFNBQVMsY0FBYyxlQUFlO0FBRXRDLE9BQU8sV0FBVztBQUNsQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGFBQWE7QUFMdEIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxjQUFjLENBQUMsTUFBTSxHQUFHLHFCQUFxQixDQUFDO0FBQ3BELFFBQU0sYUFBYSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsdUJBQXVCLENBQUM7QUFDbkUsUUFBTSxjQUFjLENBQUMsTUFBTSxDQUFDO0FBRTVCLFFBQU0sVUFDSixTQUFTLGdCQUNMLGFBQ0EsU0FBUyxlQUNULGNBQ0EsU0FBUyxTQUNULGNBQ0E7QUFFTixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTjtBQUFBLElBQ0EsU0FBUztB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
