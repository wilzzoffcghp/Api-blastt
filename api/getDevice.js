const axios = require("axios");

module.exports = [{
    name: "Get Devices",
    desc: "Ambil semua device",
    category: "ResponWA",
    path: "/responwa/devices?apikey=&token=",

    async run(req, res) {
        const { apikey, token } = req.query;

        if (!apikey)
            return res.json({
                status: false,
                error: "Apikey diperlukan"
            });

        if (!global.apikey.includes(apikey))
            return res.json({
                status: false,
                error: "Apikey invalid"
            });

        if (!token)
            return res.json({
                status: false,
                error: "Token diperlukan"
            });

        try {

            const jwt = token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`;

            const { data } = await axios({
                method: "GET",
                url: "https://responwa.org/api/user/devices",
                headers: {
                    Authorization: jwt,
                    Accept: "application/json"
                }
            });

            return res.json({
                status: true,
                creator: "xDonzCode",
                result: data
            });

        } catch (e) {

            return res.json({
                status: false,
                creator: "xDonzCode",
                error: e.response?.data || e.message
            });

        }
    }
}];