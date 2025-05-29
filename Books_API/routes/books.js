const fs = require('fs');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/Books_API/data/";

async function consultBooks() {

    try {

        let booksList = [];
        let fileNames = await fs.promises.readdir(DATA_ROUTE);

        for (let fileName of fileNames) {

            let bookData = await fs.promises.readFile(`${DATA_ROUTE}${fileName}`, 'utf8');
            let book = JSON.parse (bookData);
            booksList.push (book);
            //console.log(book);
        }

        return booksList;
    } catch {

        console.log('Books Not Found');
        return { message: "Error to Find Books"};

    }
}

async function consultBookById (id) {

    try {

        if (!await searchBookById(id)){

            err;
        } else {

            return await searchBookById(id);
        }

    } catch (err) {

        console.log('Book Not Found');
        return {message: "Book Not Found"};
        
    }
}

async function saveBook (title, autor) {

    let newID = await createID();
    let newBookData = {
        "id": newID,
        title,
        autor
    }

    fs.writeFile(`${DATA_ROUTE}${newID}.json`, JSON.stringify(newBookData, null, 2), (err) => {
    
        if (err) {

            return { message: "Failed to save book" };
        }
    });

    return newBookData;
}

async function createID () {
    try {

        let idMaximum = 0;
        let fileNames = await fs.promises.readdir(DATA_ROUTE);
        
        for (let fileName of fileNames) {

            let fileId = parseInt(fileName.replace('.json', ''));
            //console.log(fileId);
            
            if (fileId > idMaximum) {

                idMaximum = fileId;
            }
        }

        idMaximum +=1;
        return idMaximum;
        
    } catch {

        console.log('Error to generate ID');
    }
};

async function searchBookById(id) {

    try {

        let fileNames = await fs.promises.readdir(DATA_ROUTE);

        for (let fileName of fileNames) {

            let fileId = fileName.replace('.json', '');
            //console.log(fileId);
            
            if (fileId === id) {

                let bookData = await fs.promises.readFile(`${DATA_ROUTE}${fileName}`, 'utf8');
                let book = JSON.parse (bookData);
        
                //console.log(book);        
                return book;
            }
        }

        err;
    } catch (err) {

        return false;
    }
}

async function deleteBook (id) {
    try {

        if (!await searchBookById(id)){

            err;
        } else {
            
            fs.unlink(`${DATA_ROUTE}${id}.json`, (err) => {

                if (err) {

                    return { message: "Book Not Found" };
                } else {

                    console.log("Deleted Book");
                }
            });

            return { message: `Deleted Book ${id}.json` };
        }
    } catch (err) {
        
        return { message: "Book Not Found or Not Exist" };
    }
}

module.exports = {consultBooks, consultBookById, saveBook, deleteBook};