const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3001; // Puerto fijo

// Simulación de base de datos de inventario
const inventory = {
    'PROD001': { quantity: 100 },
    'PROD002': { quantity: 50 },
    'PROD003': { quantity: 0 }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'inventory-service' });
});

// Verificar disponibilidad de producto
app.get('/inventory/:productId', (req, res) => {
    const product = inventory[req.params.productId];
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// Verificar y actualizar inventario
app.post('/check-inventory', (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const product = inventory[productId];

    if (!product) {
        return res.status(404).json({
            available: false,
            error: 'Producto no encontrado'
        });
    }

    const available = product.quantity >= quantity;

    if (available) {
        // Actualizar inventario
        product.quantity -= quantity;
    }

    res.json({
        available,
        currentStock: product.quantity
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servicio de inventario ejecutándose en puerto ${port}`);
}); 