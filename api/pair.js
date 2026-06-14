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
    name: "Pair Device",
    desc: "Generate pairing code",
    category: "ResponWA",
    path: "/responwa/pair?apikey=&token=&deviceId=&phone=",

    async run(req, res) {
        const {
            apikey,
            token,
            deviceId,
            phone
        } = req.query;

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

        if (!phone)
            return res.json({
                status: false,
                error: "Phone diperlukan"
            });

        try {
            const { data } = await axios.post(
                `https://responwa.org/api/user/devices/${deviceId}/pair`,
                {
                    phoneNumber: phone
                },
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