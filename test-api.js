
const axios = require('axios');

async function testBooking() {
    const payload = {
        purpose: 'tourism',
        details: {
            country: 'United Arab Emirates',
            travelers: '2',
            budget: 'mid',
            interests: 'backwaters',
            travelDates: '2026-03-01'
        },
        contact: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+971 123456789',
            country: 'United Arab Emirates'
        }
    };

    try {
        const response = await axios.post('http://localhost:3000/api/bookings', payload);
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testBooking();
