const { spawn } = require('child_process');
const fs = require('fs');

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

async function checkPageResponse(url, name) {
  console.log(`\n📄 檢查 ${name} (${url})`);
  
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`❌ HTTP 錯誤: ${response.status}`);
      return false;
    }
    
    const html = await response.text();
    
    // 檢查基本 HTML 結構
    const hasApp = html.includes('id="app"');
    const hasVueScript = html.includes('vue') || html.includes('/src/main/vue/main.js');
    const hasTitle = /<title>.*<\/title>/.test(html);
    
    console.log(`📦 Vue 應用容器: ${hasApp ? '✅' : '❌'}`);
    console.log(`📜 Vue 腳本: ${hasVueScript ? '✅' : '❌'}`);
    console.log(`📖 頁面標題: ${hasTitle ? '✅' : '❌'}`);
    
    // 檢查是否有明顯的錯誤訊息
    const hasError = html.includes('error') || html.includes('Error') || html.includes('404');
    if (hasError && !html.includes('mdi-error')) { // 排除圖標
      console.log('⚠️ 可能包含錯誤訊息');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ 請求失敗: ${error.message}`);
    return false;
  }
}

async function checkAPIEndpoints() {
  console.log('\n🔌 檢查 API 端點...\n');
  
  const endpoints = [
    { name: '商品列表', url: 'http://localhost:8080/products' },
    { name: '分類列表', url: 'http://localhost:8080/categories' },
    { name: '單一商品', url: 'http://localhost:8080/products/1' }
  ];
  
  try {
    const { default: fetch } = await import('node-fetch');
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        const data = await response.json();
        
        console.log(`${endpoint.name}: ${response.ok ? '✅' : '❌'} (${response.status})`);
        
        if (endpoint.url.includes('/products/1') && response.ok) {
          console.log(`   商品名稱: ${data.name || '未找到'}`);
          console.log(`   圖片數量: ${data.images ? data.images.length : 0}`);
          console.log(`   規格變體: ${data.variants ? data.variants.length : 0}`);
        }
        
        if (endpoint.url.includes('/products') && !endpoint.url.includes('/1') && response.ok) {
          console.log(`   商品總數: ${Array.isArray(data) ? data.length : '未知'}`);
        }
        
      } catch (error) {
        console.log(`${endpoint.name}: ❌ (${error.message})`);
      }
    }
  } catch (error) {
    console.error('檢查 API 時發生錯誤:', error.message);
  }
}

async function checkBuildErrors() {
  console.log('\n🔧 檢查建構錯誤...\n');
  
  return new Promise((resolve) => {
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'pipe',
      shell: true
    });
    
    let stdout = '';
    let stderr = '';
    
    buildProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    buildProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 建構成功，無語法錯誤');
      } else {
        console.log('❌ 建構失敗，發現錯誤:');
        if (stderr) {
          console.log(stderr);
        }
        if (stdout) {
          console.log(stdout);
        }
      }
      resolve(code === 0);
    });
    
    // 設定超時
    setTimeout(() => {
      buildProcess.kill();
      console.log('⏰ 建構超時，停止檢查');
      resolve(false);
    }, 60000); // 60 秒超時
  });
}

async function checkConsoleErrorsFromLogs() {
  console.log('\n📝 檢查可能的運行時錯誤...\n');
  
  // 檢查常見的 JavaScript 錯誤模式
  const testPages = [
    { name: '首頁', url: 'http://localhost:3000/' },
    { name: 'iPhone 商品頁', url: 'http://localhost:3000/product/1' },
    { name: 'MacBook 商品頁', url: 'http://localhost:3000/product/2' }
  ];
  
  try {
    const { default: fetch } = await import('node-fetch');
    
    for (const page of testPages) {
      console.log(`檢查 ${page.name}...`);
      
      try {
        const response = await fetch(page.url);
        const html = await response.text();
        
        // 檢查頁面是否正常載入 JavaScript
        const hasMainScript = html.includes('/src/main/vue/main.js') || html.includes('main.js');
        const hasVueError = html.includes('Vue error') || html.includes('vue error');
        const hasUncaughtError = html.includes('Uncaught') || html.includes('uncaught');
        
        console.log(`   主腳本載入: ${hasMainScript ? '✅' : '❌'}`);
        
        if (hasVueError) {
          console.log('   ⚠️ 發現可能的 Vue 錯誤');
        }
        
        if (hasUncaughtError) {
          console.log('   ⚠️ 發現可能的未捕獲錯誤');
        }
        
        if (!hasVueError && !hasUncaughtError) {
          console.log('   ✅ 無明顯錯誤跡象');
        }
        
      } catch (error) {
        console.log(`   ❌ 檢查失敗: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('檢查時發生錯誤:', error.message);
  }
}

async function main() {
  console.log('🧪 JavaScript 錯誤檢查工具 (簡化版)\n');
  console.log('==========================================\n');
  
  // 1. 檢查伺服器狀態
  const serversReady = await checkServers();
  if (!serversReady) {
    process.exit(1);
  }
  
  // 2. 檢查頁面響應
  await checkPageResponse('http://localhost:3000/', '首頁');
  await checkPageResponse('http://localhost:3000/product/1', 'iPhone 商品頁');
  await checkPageResponse('http://localhost:3000/product/2', 'MacBook 商品頁');
  
  // 3. 檢查 API 端點
  await checkAPIEndpoints();
  
  // 4. 檢查運行時錯誤跡象
  await checkConsoleErrorsFromLogs();
  
  // 5. 檢查建構錯誤
  await checkBuildErrors();
  
  console.log('\n✨ 檢查完成！');
  console.log('\n💡 建議:');
  console.log('1. 在瀏覽器開發者工具中檢查 Console 頁籤');
  console.log('2. 檢查 Network 頁籤是否有失敗的請求');
  console.log('3. 測試各項功能是否正常運作');
}

main().catch(console.error);