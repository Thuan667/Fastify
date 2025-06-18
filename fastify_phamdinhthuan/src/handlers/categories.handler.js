const categoriesService = require('../services/categories.service');

function getAll(req, res){
categoriesService.getAll(this.mysql)
.then((result) => {
res.send(result);
})
.catch((err) =>{
    console.error('Database error: ', err);
    res.status(500).send({error: 'Internal Server Error'});
});
}

function getOne(req,res){
   const id= req.params.id;
    categoriesService.getOne(this.mysql,id).then((result)=>{
        if(!result){
            res.status(404).send({error:'Not found'});
            return;
        }
        res.send(result);
    })
    .catch((err)=>{
        console.error('Database error:', err);
        res.status(500).send({error: 'Internal Server Error'});
    });
}

function createCategory(req,res){
    const data = req.body;
    categoriesService.createCategory(this.mysql, data)
    .then(result=>{
        const id = result.insertId;
        return categoriesService.getOne(this.mysql,id);
    })
    .then(item =>{
        res.send(item);
    })
    .catch(err =>{
        console.error('Database error:', err);
        res.status(500).send({error: 'Internal Server Error'});
    });
}

function updateCategory(req, res) {
    const  id  = req.params.id;
    const data = req.body;

    categoriesService.updateCategory(this.mysql,data,id)
        .then(async(result) => {
            if(result.affectedRows === 0){
                res.status(404).send({Error:'Not Found'})
                return;
            }
            const item =await categoriesService.getOne(this.mysql,id);
            res.send(item);
        })
        .catch(err => {
            console.error('Database error:', err);
        });
}
async function delCategory(req,res) {
    const id = req.params.id;
    try{
        const item = await categoriesService.getOne(this.mysql,id);
        console.log("Item:",item);
        if(!item){
            res.status(404).send({error:'Category not found'});
        }
        const result =await categoriesService.delCategory(this.mysql,id);
        if(result.error){
            res.status(404).send(result);
        }else{
            res.send(item);
        }
    }catch(err){
console.error('Database error:',err);
res.status(404).send({error:'Internal server error'});
    }
    
}

module.exports = {
    getAll,
    getOne,
    createCategory,
    updateCategory,
    delCategory,
}