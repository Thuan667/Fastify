const crypto = require('crypto');
const qs = require('qs');

const vnp_Config = {
  vnp_TmnCode: 'Q30BHOBA',
  vnp_HashSecret: 'P8FN4B9IDSDYMDVOEPNEVU2SZDDRNI7E',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'http://localhost:8080/api/payment/vnpay-return',
};

function pad(number) {
  return number < 10 ? '0' + number : number.toString();
}

function getFormattedDate() {
  const date = new Date();
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function getExpireDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 15);
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj).sort().forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

function buildQueryString(params) {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
}

function createVNPayUrl(orderId, amount, ipAddr) {
  const createDate = getFormattedDate();
  const expireDate = getExpireDate();

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnp_Config.vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: String(orderId),
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: 'billpayment',
    vnp_Amount: String(amount * 100),
    vnp_ReturnUrl: vnp_Config.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
    // **Không thêm vnp_SecureHashType vào params khi tạo chữ ký**
  };

  // Tạo chữ ký không bao gồm vnp_SecureHashType
  const signData = buildQueryString(vnp_Params);

  const hmac = crypto.createHmac('sha256', vnp_Config.vnp_HashSecret);
  const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex').toUpperCase();

  // Thêm vnp_SecureHash và vnp_SecureHashType vào params gửi lên URL
  const paymentParams = {
    ...vnp_Params,
    vnp_SecureHashType: 'SHA256',
    vnp_SecureHash: secureHash,
  };

  // Tạo URL cuối cùng (lúc này encode bình thường)
  const paymentUrl = `${vnp_Config.vnp_Url}?${qs.stringify(paymentParams, { encode: true })}`;

  console.log('SignData:', signData);
  console.log('SecureHash:', secureHash);
  console.log('Payment URL:', paymentUrl);

  return paymentUrl;
}


function verifyVNPay(params) {
  console.log('===== XÁC THỰC CALLBACK VNPay =====');
  console.log('Params received:', params);

  const receivedSecureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });
  console.log('SignData (Verify):', signData);

  const hmac = crypto.createHmac('sha256', vnp_Config.vnp_HashSecret);
  const checkHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex').toUpperCase();

  console.log('Received SecureHash:', receivedSecureHash);
  console.log('Computed SecureHash:', checkHash);
  console.log('Compare result:', checkHash === receivedSecureHash.toUpperCase());
  console.log('=====================================');

  return checkHash === receivedSecureHash.toUpperCase();
}


module.exports = {
  createVNPayUrl,
  verifyVNPay,
  vnp_Config,
};
