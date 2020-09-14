module.exports = {
    servers: {
        one: {
            host: "server.mileniomoveis.com.br",
            username: "root",
            password: "M.moveis768"
        }
    },

    meteor: {
        name: "lojainteligente-api-staging",
        path: "../../",
        servers: {
            one: {}
        },
        buildOptions: {
            serverOnly: true,
            debug: true
        },
        env: {
            PORT: 3010,
            ROOT_URL: "http://api-staging.mileniomoveis.com.br",
            MONGO_URL:
                "mongodb://staging:Mmoveis768Staging@4b9d5596-187a-4cac-bff1-8864513be956-0.8f7bfd8f3faa4218aec56e069eb46187.databases.appdomain.cloud:30941,4b9d5596-187a-4cac-bff1-8864513be956-1.8f7bfd8f3faa4218aec56e069eb46187.databases.appdomain.cloud:30941/staging?authSource=staging&replicaSet=replset&ssl=true"
        },

        dockerImage: "cwaring/meteord:base",
        deployCheckWaitTime: 60,
        enableUploadProgressBar: true
    }
};
