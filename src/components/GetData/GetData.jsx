import React from 'react';
import './GetData.scss';
const axios = require('axios');

let connection;

class LoadingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = () => {
        // 連接資料庫並取得數據
        this.connectAndGetDataFromDataBase();
    }

    // 連接資料庫並取得數據
    connectAndGetDataFromDataBase = () => {
        axios('http://hvr.isunupcg.com/year2019/contacts.php', {
            params: {
                openID: 'oRbr0w4RNYkdxuBZvkB5oUxI7QkQ'
            }
        }).then(resp => {
            // axios(require('../../api/contacts.php')).then(resp => {
            console.log(resp.data.user)
        })
    }

    // 將數據更新到資料庫
    updateDataToDatabase = () => {
        axios('http://hvr.isunupcg.com/year2019/save.php', {
            params: {
                openID: 'oRbr0w4RNYkdxuBZvkB5oUxI7QkQ',
                usrPlanetRadius: '23',
                usrPlanetTone: '23',
                usrPlanetMountainHeight: '43',
                usrPlanetMountainDensity: '43'
            }
        }).then(resp => {
            axios('http://hvr.isunupcg.com/year2019/contacts.php', {
                params: {
                    openID: 'oRbr0w4RNYkdxuBZvkB5oUxI7QkQ'
                }
            }).then(resp => {
                // axios(require('../../api/contacts.php')).then(resp => {
                console.log(resp.data.user)
            })
        })
    }

    render() {
        return (
            <div className="GetData">
                <button onClick={() => this.updateDataToDatabase()}>更新數據到資料庫</button>
            </div>
        )
    }
}

export default LoadingPage;