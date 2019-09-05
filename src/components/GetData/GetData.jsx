import React from 'react';
import './GetData.scss';
var mysql = require('mysql');

let connection;

class LoadingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = () => {
        console.log('成功載入GetData頁');

        // 連接資料庫並取得數據
        this.connectAndGetDataFromDataBase();
    }

    // 連接資料庫並取得數據
    connectAndGetDataFromDataBase = () => {
        // 連接資料庫
        connection = mysql.createConnection({
            host: '120.78.151.121',
            usr: 'year',
            password: 'AHJxa2MGp35PhjRw',
            database: 'year'
        });
        connection.connect();
        connection.end();
    }

    render() {
        return (
            <div className="GetData">

            </div>
        )
    }
}

export default LoadingPage;