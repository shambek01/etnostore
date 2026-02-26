const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { v4: uuidv4 } = require('uuid');

// Create a new order
router.post('/', (req, res) => {
  const db = getDb();
  const { 
    customer_name, 
    customer_phone, 
    customer_email, 
    delivery_city, 
    delivery_address, 
    items 
  } = req.body;

  if (!customer_name || !customer_phone || !delivery_city || !delivery_address || !items || !items.length) {
    return res.status(400).json({ success: false, error: 'Missing required order fields or items' });
  }

  // Calculate total amount from items to prevent exact price manipulation
  let total_amount = 0;
  
  try {
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, customer_name, customer_phone, customer_email, delivery_city, delivery_address, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new')
    `);
    
    const insertItem = db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const getProductPrice = db.prepare('SELECT price, name FROM products WHERE id = ?');

    const orderId = uuidv4();
    const orderItemsData = [];

    // Verify and calculate everything first
    for (const item of items) {
      const product = getProductPrice.get(item.product_id);
      if (!product) throw new Error(`Product not found: ${item.product_id}`);
      
      const price = product.price;
      const quantity = item.quantity || 1;
      total_amount += price * quantity;

      orderItemsData.push([
        uuidv4(),
        orderId,
        item.product_id,
        product.name,
        quantity,
        price
      ]);
    }

    // Wrap inserts in a transaction
    const processOrderTransaction = db.transaction(() => {
      insertOrder.run(orderId, customer_name, customer_phone, customer_email, delivery_city, delivery_address, total_amount);
      
      for (const itemData of orderItemsData) {
        insertItem.run(...itemData);
      }
    });

    processOrderTransaction();

    res.json({ success: true, orderId });

  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all orders (for admin)
router.get('/', (req, res) => {
  const db = getDb();
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    
    // Also fetch items for each order
    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    
    for (let order of orders) {
      order.items = getItems.all(order.id);
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Update order status (for admin)
router.put('/:id/status', (req, res) => {
  const db = getDb();
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }

  try {
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

module.exports = router;
