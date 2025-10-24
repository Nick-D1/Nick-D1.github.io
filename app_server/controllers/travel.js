//Changed hardcoded API URL 
const tripsEndpoint = process.env.TRIPS_API_URL || 'http://localhost:3000/api/trips';

/* GET Travel view */
const travel = async (req, res, next) => {
    try {
        //Using async/await instead of .then() for easier to read code
        const response = await fetch(tripsEndpoint, { headers: { Accept: 'application/json' } });

        //  Added proper error handling for non-OK HTTP responses
        if (!response.ok) {
            throw new Error(`Failed to fetch trips: ${response.statusText}`);
        }

        const json = await response.json();

        // Simplified message logic
        
        let message = null;
        let trips = [];

        if (!(json instanceof Array)) {
            message = json;
        } else if (!json.length) {
            message = "No trips exist in our database!";
        } else {
            trips = json;
        }

        //Consistent naming and clear comments for rendering context
        res.render('travel', { 
            title: 'Travlr Getaways', 
            trips, 
            message 
        });

    } catch (err) {
        
        console.error('Error loading trips:', err.message);
        res.status(500).render('error', { message: 'Unable to load trips at this time.' });
    }
};

module.exports = { travel };