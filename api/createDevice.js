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
    name: "Create Device",
    desc: "Buat device baru",
    category: "ResponWA",
    path: "/responwa/create?apikey=&token=&name=",

    async run(req, res) {
        const { apikey, token, name } = req.query;

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

        if (!name)
            return res.json({
                status: false,
                error: "Name diperlukan"
            });

        try {
            const { data } = await axios.post(
                "https://responwa.org/api/user/devices",
                { name },
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