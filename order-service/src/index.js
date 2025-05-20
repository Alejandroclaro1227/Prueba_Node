const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const port = 3000;

// Base de datos en memoria para órdenes
const orders = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'order-service' });
});

// Crear un nuevo pedido
app.post('/orders', async (req, res) => {
    try {
        const order = {
            id: Date.now().toString(),
            ...req.body,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        // Guardar la orden
        orders.set(order.id, order);

        // Verificar inventario
        const inventoryResponse = await axios.post('http://localhost:3001/check-inventory', {
            productId: order.productId,
            quantity: order.quantity || 1
        });

        if (inventoryResponse.data.available) {
            // Si hay inventario, crear entrega
            const deliveryResponse = await axios.post('http://localhost:3002/deliveries', {
                orderId: order.id,
                ...order
            });

            order.status = 'PROCESSING';
            order.deliveryId = deliveryResponse.data.deliveryId;
        } else {
            order.status = 'FAILED';
            order.reason = 'No hay inventario suficiente';
        }

        // Actualizar la orden
        orders.set(order.id, order);

        res.status(201).json({
            message: 'Pedido procesado',
            order
        });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        res.status(500).json({ error: 'Error al procesar el pedido' });
    }
});

// Obtener estado de un pedido
app.get('/orders/:orderId', (req, res) => {
    const order = orders.get(req.params.orderId);
    if (!order) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(order);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servicio de órdenes ejecutándose en puerto ${port}`);
}); 