import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:5000/api', // URL backend của bạn
    headers: {
        'Content-Type': 'application/json',
    }
});
