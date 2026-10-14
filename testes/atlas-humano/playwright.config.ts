import { defineConfig,devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  testDir:'./e2e',outputDir:'./test-results',reporter:'list',workers:1,timeout:60000,
  use:{baseURL:'http://127.0.0.1:4176',trace:'retain-on-failure',launchOptions:{args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},
  webServer:{command:'npm run preview:atlas',cwd:fileURLToPath(new URL('../../',import.meta.url)),url:'http://127.0.0.1:4176',reuseExistingServer:!process.env.CI},
  projects:[
    {name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1040}}},
    {name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium',viewport:{width:390,height:844}}},
  ],
});
