// ================================================================
//  구글 시트 Apps Script 코드
//  붙여넣기 위치: 구글 시트 → 확장 프로그램 → Apps Script
// ================================================================

const SHEET_PRODUCTS = '상품';
const SHEET_ORDERS   = '주문';

function doGet(e) {
  const action = e.parameter.action;
  try {
    if (action === 'getProducts') return ok(getProducts());
    if (action === 'getProduct')  return ok(getProduct(e.parameter.id));
    if (action === 'getOrders')   return ok(getOrders(e.parameter.productId));
  } catch(err) {
    return err_(err.message);
  }
  return err_('unknown action');
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  try {
    if (body.action === 'addProduct')    return ok(addProduct(body.product));
    if (body.action === 'deleteProduct') return ok(deleteProduct(body.id));
    if (body.action === 'addOrder')      return ok(addOrder(body.order));
  } catch(err) {
    return err_(err.message);
  }
  return err_('unknown action');
}

// ── 상품 조회 ──
function getProducts() {
  const rows = getSheet(SHEET_PRODUCTS).getDataRange().getValues();
  const headers = rows[0];
  return {
    products: rows.slice(1)
      .filter(r => r[0])
      .map(r => rowToObj(headers, r))
  };
}

function getProduct(id) {
  const rows = getSheet(SHEET_PRODUCTS).getDataRange().getValues();
  const headers = rows[0];
  const row = rows.slice(1).find(r => r[0] == id);
  if (!row) throw new Error('상품을 찾을 수 없습니다');
  return { product: rowToObj(headers, row) };
}

// ── 상품 등록 ──
function addProduct(p) {
  const sheet = getSheet(SHEET_PRODUCTS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id','title','price','desc','image','deadline','options','createdAt']);
  }
  const id = Date.now().toString();
  sheet.appendRow([id, p.title, p.price, p.desc, p.image, p.deadline, p.options, new Date().toISOString()]);
  return { success: true, id };
}

// ── 상품 삭제 ──
function deleteProduct(id) {
  const sheet = getSheet(SHEET_PRODUCTS);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == id) { sheet.deleteRow(i + 1); break; }
  }
  return { success: true };
}

// ── 주문 조회 ──
function getOrders(productId) {
  const sheet = getSheet(SHEET_ORDERS);
  if (sheet.getLastRow() === 0) return { orders: [] };
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  let orders = rows.slice(1).filter(r => r[0]).map(r => rowToObj(headers, r));
  if (productId) orders = orders.filter(o => o.productId == productId);
  return { orders };
}

// ── 주문 접수 ──
function addOrder(o) {
  const sheet = getSheet(SHEET_ORDERS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id','productId','productTitle','name','phone','address',
                     'color','size','shoeSize','quantity','payment','other','createdAt']);
  }
  sheet.appendRow([
    Date.now().toString(), o.productId, o.productTitle,
    o.name, o.phone, o.address,
    o.color, o.size, o.shoeSize, o.quantity,
    o.payment, o.other, new Date().toISOString()
  ]);
  return { success: true };
}

// ── 유틸 ──
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i] ?? '');
  return obj;
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function err_(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
