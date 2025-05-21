const fs = require('fs');

let booksList = [];
let dataRoute = "/home/user/Documentos/prompt-history/Books_API/data/";

function consultBooks(){

    fs.promises.readdir(dataRoute)
    .then(fileNames => {

        for (let fileName of fileNames){

            //console.log(fileName);
            
            fs.readFile(`${dataRoute}${fileName}`, 'utf8', function(err, data) {
            
                if (err) {

                    console.log("Error");
                    
                }
            
                //console.log(data);
                booksList = JSON.parse(data);
                console.log(booksList);
    
            });
            
            
        }
        return booksList;
    })
    .catch(err => {

        console.log("not files found");
        
    });

}

module.exports = consultBooks;