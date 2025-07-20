const fs = require('fs');
const path = require('path');

async function checkVueComponents() {
  console.log('🔍 檢查 Vue 組件可能的問題...\n');
  
  const componentDir = path.join(__dirname, '../src/main/vue/components/ui');
  const files = ['ProductImageGallery.vue', 'ProductDetails.vue', 'ProductContent.vue'];
  
  for (const file of files) {
    console.log(`📄 檢查 ${file}:`);
    
    try {
      const filePath = path.join(componentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 檢查常見問題
      const issues = [];
      
      // 檢查是否有未定義的 computed 或 methods
      const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
      if (scriptMatch) {
        const script = scriptMatch[1];
        
        // 檢查 import 語句
        const imports = script.match(/import.*from.*['"](.*)['"]/g);
        if (imports) {
          imports.forEach(imp => {
            if (imp.includes('dompurify') || imp.includes('DOMPurify')) {
              issues.push('⚠️ 使用了 DOMPurify 但可能未安裝');
            }
            if (imp.includes('@vueuse/head')) {
              issues.push('⚠️ 使用了 @vueuse/head 但可能未安裝');
            }
          });
        }
        
        // 檢查 store getters
        const storeGetters = script.match(/store\.getters\['([^']+)'\]/g);
        if (storeGetters) {
          storeGetters.forEach(getter => {
            console.log(`   使用 Store getter: ${getter}`);
          });
        }
        
        // 檢查 store dispatch
        const storeDispatches = script.match(/store\.dispatch\('([^']+)'/g);
        if (storeDispatches) {
          storeDispatches.forEach(dispatch => {
            console.log(`   使用 Store dispatch: ${dispatch}`);
          });
        }
      }
      
      // 檢查模板中的問題
      const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
      if (templateMatch) {
        const template = templateMatch[1];
        
        // 檢查 v-if/v-for 組合
        if (template.includes('v-if') && template.includes('v-for')) {
          const lines = template.split('\n');
          lines.forEach((line, index) => {
            if (line.includes('v-if') && line.includes('v-for')) {
              issues.push(`⚠️ 第 ${index + 1} 行: v-if 和 v-for 在同一元素上可能有問題`);
            }
          });
        }
        
        // 檢查未定義的變數引用
        const vueVariables = template.match(/\{\{\s*([^}]+)\s*\}\}/g);
        if (vueVariables) {
          vueVariables.forEach(variable => {
            const varName = variable.replace(/[{}]/g, '').trim().split('.')[0];
            if (!script.includes(varName) && !['$vuetify', '$router', '$route', '$store'].includes(varName)) {
              // issues.push(`⚠️ 可能未定義的變數: ${varName}`);
            }
          });
        }
      }
      
      if (issues.length === 0) {
        console.log('   ✅ 無明顯問題');
      } else {
        issues.forEach(issue => console.log(`   ${issue}`));
      }
      
    } catch (error) {
      console.log(`   ❌ 讀取失敗: ${error.message}`);
    }
  }
}

async function checkStoreModules() {
  console.log('\n🗃️ 檢查 Store 模組...\n');
  
  const storeDir = path.join(__dirname, '../src/main/vue/store/modules');
  const files = ['products.js', 'cart.js', 'favorites.js', 'ui.js', 'auth.js'];
  
  for (const file of files) {
    console.log(`📦 檢查 ${file}:`);
    
    try {
      const filePath = path.join(storeDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 檢查基本結構
      const hasState = content.includes('const state');
      const hasGetters = content.includes('const getters');
      const hasMutations = content.includes('const mutations');
      const hasActions = content.includes('const actions');
      const hasExport = content.includes('export default');
      
      console.log(`   狀態 (state): ${hasState ? '✅' : '❌'}`);
      console.log(`   取得器 (getters): ${hasGetters ? '✅' : '❌'}`);
      console.log(`   變更 (mutations): ${hasMutations ? '✅' : '❌'}`);
      console.log(`   動作 (actions): ${hasActions ? '✅' : '❌'}`);
      console.log(`   匯出 (export): ${hasExport ? '✅' : '❌'}`);
      
      // 檢查依賴
      const imports = content.match(/import.*from.*['"](.*)['"]/g);
      if (imports) {
        imports.forEach(imp => {
          console.log(`   依賴: ${imp}`);
        });
      }
      
    } catch (error) {
      console.log(`   ❌ 讀取失敗: ${error.message}`);
    }
  }
}

async function checkAPIServices() {
  console.log('\n🌐 檢查 API 服務...\n');
  
  const servicesDir = path.join(__dirname, '../src/main/vue/services');
  
  try {
    const files = fs.readdirSync(servicesDir);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        console.log(`🔗 檢查 ${file}:`);
        
        const filePath = path.join(servicesDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 檢查 API 設定
        const hasApiConfig = content.includes('API_CONFIG') || content.includes('baseURL');
        const hasAxios = content.includes('axios');
        const hasExport = content.includes('export');
        
        console.log(`   API 配置: ${hasApiConfig ? '✅' : '❌'}`);
        console.log(`   Axios 客戶端: ${hasAxios ? '✅' : '❌'}`);
        console.log(`   匯出服務: ${hasExport ? '✅' : '❌'}`);
      }
    }
  } catch (error) {
    console.log(`❌ 讀取服務目錄失敗: ${error.message}`);
  }
}

async function checkMockDataIntegrity() {
  console.log('\n📊 檢查 Mock 資料完整性...\n');
  
  try {
    const mockPath = path.join(__dirname, '../src/mocks/db.json');
    const mockData = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
    
    // 檢查產品資料
    if (mockData.products) {
      console.log(`商品數量: ${mockData.products.length}`);
      
      mockData.products.forEach(product => {
        const issues = [];
        
        if (!product.name) issues.push('缺少名稱');
        if (!product.price) issues.push('缺少價格');
        if (!product.images || product.images.length === 0) issues.push('缺少圖片');
        if (!product.description) issues.push('缺少描述');
        
        if (issues.length === 0) {
          console.log(`   ✅ 商品 ${product.id} (${product.name}): 完整`);
        } else {
          console.log(`   ⚠️ 商品 ${product.id}: ${issues.join(', ')}`);
        }
      });
    }
    
    // 檢查其他資料
    console.log(`分類數量: ${mockData.categories ? mockData.categories.length : 0}`);
    console.log(`使用者數量: ${mockData.users ? mockData.users.length : 0}`);
    
  } catch (error) {
    console.log(`❌ 檢查 Mock 資料失敗: ${error.message}`);
  }
}

async function main() {
  console.log('🔧 Vue 組件錯誤深度檢查\n');
  console.log('============================\n');
  
  await checkVueComponents();
  await checkStoreModules();
  await checkAPIServices();
  await checkMockDataIntegrity();
  
  console.log('\n✨ 深度檢查完成！');
  console.log('\n💡 如果仍有問題，請:');
  console.log('1. 在瀏覽器中打開開發者工具');
  console.log('2. 檢查 Console 標籤中的錯誤訊息');
  console.log('3. 檢查 Network 標籤中的失敗請求');
  console.log('4. 確認所有功能是否正常運作');
}

main().catch(console.error);