const axios = require("axios");

module.exports = [{
    name: "Get Auth Token",
    desc: "Ambil token ResponWA",
    category: "ResponWA",
    path: "/responwa/token?apikey=&email=&password=",

    async run(req, res) {
        const { apikey, email, password } = req.query;

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

        if (!email)
            return res.json({
                status: false,
                error: "Email diperlukan"
            });

        if (!password)
            return res.json({
                status: false,
                error: "Password diperlukan"
            });

        try {
            const { data } = await axios.post(
                "https://responwa.org/api/auth/login",
                {
                    email,
                    password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }
            );

            return res.json({
                status: true,
                token: data.token,
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