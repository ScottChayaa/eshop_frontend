const puppeteer = require('puppeteer');

async function checkJSErrors() {
  console.log('🚀 啟動 Puppeteer 檢查 JavaScript 錯誤...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 設置視窗大小
    await page.setViewport({ width: 1280, height: 720 });
    
    // 收集錯誤
    const errors = [];
    const warnings = [];
    const consoleMessages = [];
    
    // 監聽 console 訊息
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      consoleMessages.push({ type, text });
      
      if (type === 'error') {
        errors.push(text);
      } else if (type === 'warning') {
        warnings.push(text);
      }
    });
    
    // 監聽頁面錯誤
    page.on('pageerror', error => {
      errors.push(`頁面錯誤: ${error.message}`);
    });
    
    // 監聽請求失敗
    page.on('requestfailed', request => {
      errors.push(`請求失敗: ${request.url()} - ${request.failure().errorText}`);
    });
    
    const testPages = [
      { name: '首頁', url: 'http://localhost:3000/' },
      { name: 'iPhone 15 Pro 商品頁', url: 'http://localhost:3000/product/1' },
      { name: 'MacBook Pro 商品頁', url: 'http://localhost:3000/product/2' },
      { name: 'AirPods Pro 商品頁', url: 'http://localhost:3000/product/3' },
      { name: 'iPad Air 商品頁', url: 'http://localhost:3000/product/4' }
    ];
    
    for (const testPage of testPages) {
      console.log(`\n📄 檢查 ${testPage.name} (${testPage.url})`);
      
      const pageErrors = [];
      const pageWarnings = [];
      
      // 清空之前的錯誤記錄
      errors.length = 0;
      warnings.length = 0;
      consoleMessages.length = 0;
      
      try {
        // 訪問頁面
        const response = await page.goto(testPage.url, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        
        if (!response.ok()) {
          console.log(`❌ HTTP 錯誤: ${response.status()}`);
          continue;
        }
        
        // 等待頁面完全載入
        await page.waitForTimeout(2000);
        
        // 檢查是否有 Vue 應用
        const hasVueApp = await page.evaluate(() => {
          return !!document.querySelector('#app');
        });
        
        if (!hasVueApp) {
          console.log('❌ 未找到 Vue 應用容器 (#app)');
          continue;
        }
        
        // 檢查頁面基本元素
        const pageTitle = await page.title();
        console.log(`📖 頁面標題: ${pageTitle}`);
        
        // 檢查商品頁面特有元素
        if (testPage.url.includes('/product/')) {
          const hasProductName = await page.$eval('h1', el => el.textContent.trim().length > 0).catch(() => false);
          const hasImages = await page.$$('.v-carousel').then(els => els.length > 0).catch(() => false);
          const hasPrice = await page.$('.text-h6').catch(() => false);
          
          console.log(`📦 商品名稱: ${hasProductName ? '✅' : '❌'}`);
          console.log(`🖼️ 商品圖片: ${hasImages ? '✅' : '❌'}`);
          console.log(`💰 商品價格: ${hasPrice ? '✅' : '❌'}`);
        }
        
        // 檢查首頁特有元素
        if (testPage.url === 'http://localhost:3000/') {
          const hasProductCards = await page.$$('.product-card').then(els => els.length > 0).catch(() => false);
          const hasCarousel = await page.$('.v-carousel').catch(() => false);
          
          console.log(`🛍️ 商品卡片: ${hasProductCards ? '✅' : '❌'}`);
          console.log(`🎠 輪播圖: ${hasCarousel ? '✅' : '❌'}`);
        }
        
        // 收集錯誤和警告
        pageErrors.push(...errors);
        pageWarnings.push(...warnings);
        
        // 顯示結果
        if (pageErrors.length === 0) {
          console.log('✅ 無 JavaScript 錯誤');
        } else {
          console.log(`❌ 發現 ${pageErrors.length} 個錯誤:`);
          pageErrors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
          });
        }
        
        if (pageWarnings.length > 0) {
          console.log(`⚠️ 發現 ${pageWarnings.length} 個警告:`);
          pageWarnings.forEach((warning, index) => {
            console.log(`   ${index + 1}. ${warning}`);
          });
        }
        
        // 顯示重要的 console 訊息
        const importantMessages = consoleMessages.filter(msg => 
          msg.type === 'error' || 
          (msg.type === 'warning' && !msg.text.includes('DevTools'))
        );
        
        if (importantMessages.length > 0) {
          console.log('\n📝 Console 訊息:');
          importantMessages.forEach(msg => {
            const icon = msg.type === 'error' ? '❌' : msg.type === 'warning' ? '⚠️' : 'ℹ️';
            console.log(`   ${icon} [${msg.type}] ${msg.text}`);
          });
        }
        
      } catch (error) {
        console.log(`❌ 測試失敗: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Puppeteer 啟動失敗:', error.message);
    console.log('\n💡 請確認:');
    console.log('1. 開發伺服器是否在 http://localhost:3000 運行');
    console.log('2. Mock API 伺服器是否在 http://localhost:8080 運行');
    console.log('3. npm install puppeteer 是否已安裝');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 檢查伺服器狀態
async function checkServers() {
  console.log('🔍 檢查伺服器狀態...\n');
  
  const { default: fetch } = await import('node-fetch');
  
  try {
    const devServer = await fetch('http://localhost:3000').then(() => true).catch(() => false);
    const mockServer = await fetch('http://localhost:8080').then(() => true).catch(() => false);
    
    console.log(`開發伺服器 (3000): ${devServer ? '✅ 運行中' : '❌ 未啟動'}`);
    console.log(`Mock API (8080): ${mockServer ? '✅ 運行中' : '❌ 未啟動'}`);
    
    if (!devServer || !mockServer) {
      console.log('\n⚠️ 請先啟動所需的伺服器:');
      if (!mockServer) console.log('npm run mock-server');
      if (!devServer) console.log('npm run dev');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('檢查伺服器時發生錯誤:', error.message);
    return false;
  }
}

// 主函數
async function main() {
  console.log('🧪 JavaScript 錯誤檢查工具\n');
  console.log('===========================\n');
  
  const serversReady = await checkServers();
  if (!serversReady) {
    process.exit(1);
  }
  
  await checkJSErrors();
  
  console.log('\n✨ 檢查完成！');
}

main().catch(console.error);