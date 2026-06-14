const axios = require("axios");

function authHeaders(token) {
    return {
        Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
    };
}

module.exports = [{
    name: "Set Device Mode",
    desc: "Mode Blast Yang Valid: slow,normal,fast",
    category: "ResponWA",
    path: "/responwa/mode?apikey=&token=&device=&mode=",

    async run(req, res) {
        const { apikey, token, device, mode } = req.query;

        if (!apikey)
            return res.json({ status: false, error: "Apikey diperlukan" });

        if (!global.apikey.includes(apikey))
            return res.json({ status: false, error: "Apikey invalid" });

        if (!token)
            return res.json({ status: false, error: "Token diperlukan" });

        if (!device)
            return res.json({ status: false, error: "Device diperlukan" });

        if (!["slow", "normal", "fast"].includes(mode))
            return res.json({
                status: false,
                error: "Mode harus slow, normal, atau fast"
            });

        try {
            const { data } = await axios.put(
                `https://responwa.org/api/user/devices/${device}/mode`,
                { mode },
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