const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3002; // Puerto fijo

// Simulación de base de datos de entregas
const deliveries = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'delivery-service' });
});

// Crear nueva entrega
app.post('/deliveries', (req, res) => {
    const { orderId } = req.body;

    const delivery = {
        deliveryId: `DEL-${Date.now()}`,
        orderId,
        status: 'SCHEDULED',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
    };

    // Guardar la entrega
    deliveries.set(orderId, delivery);

    // Simular actualización de estado después de 5 segundos
    setTimeout(() => {
        delivery.status = 'IN_PROGRESS';
        console.log(`Entrega ${orderId} actualizada a IN_PROGRESS`);
    }, 5000);

    res.status(201).json(delivery);
});

// Obtener estado de entrega
app.get('/deliveries/:orderId', (req, res) => {
    const delivery = deliveries.get(req.params.orderId);
    if (!delivery) {
        return res.status(404).json({ error: 'Entrega no encontrada' });
    }
    res.json(delivery);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servicio de entregas ejecutándose en puerto ${port}`);
}); 