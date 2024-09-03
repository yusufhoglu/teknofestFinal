require('dotenv').config(); // .env dosyasını yükler

const search = async (req, res) => {
    const { query } = req.query;  // Kullanıcıdan gelen arama sorgusu
    const city = 'Istanbul';  // Aramayı sınırlamak istediğiniz şehir

    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: `${query} in ${city}`,
                key: process.env.MONGODB_URL,
            },
        });
        const results = response.data.results;
        res.json(results);
    } catch (error) {
        console.error('Error fetching data from Google Places API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = search;