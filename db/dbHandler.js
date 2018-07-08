const mysql = require('mysql');
const async = require('async');


module.exports = {
    connection: null,
    connect: function (settings) { // callback(err, connection)
        if (this.connection) return this.connection;

        let connection = mysql.createConnection({
            host: settings.host,
            port: settings.port,
            user: settings.auth.user,
            password: settings.auth.password,
            database: settings.database
        });

        connection.connect()

        this.connection = connection;
    },
    disconnect: function() {
        if (!this.connection || typeof this.connection.end === 'function') return

        this.connection.end()
        this.connection = null;
    }
}
