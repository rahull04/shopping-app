// @flow
import * as React from 'react';
const db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

const createDatabase = () => {
    db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS CART_ITEMS (id integer primary key, name varchar, price varchar, size varchar, discount varchar,slug varchar,quantity varchar,u_id integer)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id integer primary key, uname varchar, pass varchar)'); 
        console.log('Database created');
    });
}

const insertData = (name,price,size,discount,slug,u_id) => {  
    db.transaction(function (tx) {   
        tx.executeSql('select * from CART_ITEMS where slug = ? and size = ? and u_id = ?', [slug,size,u_id], function (tx, results) { 
            
            if(results.rows.length > 0){
                let dataLength = parseInt(results.rows.item(0).quantity);
                db.transaction(function (tx) {   
                    tx.executeSql('update CART_ITEMS set quantity=? where slug=? and size=?', [(dataLength+1),slug,size], function (tx, results) { 
                    }, null); 
                    console.log('Data updated',name,price,size,discount);
                });
            }else{
                db.transaction(function (tx) {   
                    tx.executeSql('INSERT INTO CART_ITEMS (name,price,size,discount,slug,quantity,u_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [name,price,size,discount,slug,'1',u_id], function (tx, results) { 
                    }, null); 
                    console.log('Data saved to database',name,price,size,discount);
                });
            }
         }, null); 
    });

    
} 


export default {db,createDatabase,insertData};