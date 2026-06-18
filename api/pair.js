const axios = require("axios");

function authHeaders(token) {
    return {
        Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        Accept: "application/json"
    };
}

module.exports = [{
    name: "Pair Device",
    desc: "Generate pairing code secara otomatis",
    category: "ResponWA",
    path: "/responwa/pair?apikey=&token=&deviceId=&phone=",
    
    async run(req, res) {  
        const {  
            apikey,  
            token,  
            deviceId,  
            phone  
        } = req.query;  

        // 1. Validasi Input Dasar
        if (!global.apikey || !global.apikey.includes(apikey)) {  
            return res.json({ status: false, error: "Apikey invalid" });  
        }  
        if (!token || !deviceId || !phone) {  
            return res.json({ status: false, error: "Token, Device ID, dan Phone diperlukan" });  
        }  

        try {  
            const headers = authHeaders(token);

            await axios.post(  
                `https://responwa.org/api/user/devices/${deviceId}/scan-qr`,  
                {}, // Body kosong sesuai standard init
                { headers }  
            ).catch(err => {
                // Kita diamkan/log jika seandainya device memang sudah dalam status 'connecting'
                console.log("Init scan-qr status:", err.response?.data || err.message);
            });

            await new Promise(resolve => setTimeout(resolve, 500));

       
            const { data } = await axios.post(  
                `https://responwa.org/api/user/devices/${deviceId}/pair`,  
                { phone: phone },  
                { headers }  
            );  

            // Mengembalikan hasil kode pairing langsung ke user Anda
            return res.json({  
                status: true,  
                result: data // Berisi {"code": "WLSYMDNE"} jika sukses
            });  

        } catch (e) {  
            return res.json({  
                status: false,  
                error: e.response?.data?.error || e.response?.data || e.message  
            });  
        }  
    }  
}];