const fs = require('fs');
const { faker } = require('@faker-js/faker');  // ✅ Correct way

let orders = [];
const statuses = ['Delivered', 'Pending', 'Returned'];

for (let i = 1; i <= 1000; i++) {
  orders.push({
    order_id: 'ORD' + i.toString().padStart(4, '0'),
    customer_id: 'CUST' + faker.number.int({ min: 1, max: 25 }).toString().padStart(3, '0'),
    product_id: 'PROD' + faker.number.int({ min: 1, max: 300 }).toString().padStart(4, '0'),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    delivery_date: faker.date.past().toISOString().split('T')[0]
  });
}

fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
console.log('✅ Sample orders.json generated');
