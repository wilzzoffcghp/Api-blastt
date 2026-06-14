const axios = require("axios");

function authHeaders(token) {
    return {
        Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        Accept: "application/json"
    };
}

module.exports = [{
    name: "Get QR",
    desc: "Ambil QR Base64",
    category: "ResponWA",
    path: "/responwa/getqr?apikey=&token=&deviceId=",

    async run(req, res) {
        const { apikey, token, deviceId } = req.query;

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

        if (!deviceId)
            return res.json({
                status: false,
                error: "Device ID diperlukan"
            });

        try {
            const { data } = await axios.get(
                `https://responwa.org/api/user/devices/${deviceId}/qr`,
                {
                    headers: authHeaders(token)
                }
            );

            return res.json({
                status: true,
                result: data
            });

        } catch (e) {
            return res.json({
                status: false,
                error: e.response?.data || e.message
            });
        }
    }
}];