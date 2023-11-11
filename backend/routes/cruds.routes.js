import express from 'express'
import {MongoClient, ObjectId} from 'mongodb'
import dotenv from 'dotenv'
import { checkVersionHeader } from '../libs/header.js'

dotenv.config()
const router = express.Router()

const base = process.env.MONGO_ELN
const nombrebase = 'Quiromark'


// todo -> -------------------------------------TALLA------------------------------------------------------
router.get('/talla',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('talla')
        const result = await collection.find().toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/talla',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {descripcion} = req.body

        const talla={
            descripcion
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('talla')
        const result = await collection.insertOne(talla)

        res.json({talla, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/talla/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('talla')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "Talla eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "Talla no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/talla/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {descripcion} = req.body

        const talla={
            descripcion
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('talla')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: talla})

        if (!result.value) {
            res.json({
                "message": "Usuario actualizado correctamente",
                talla
            });
        } else if (result.value) {
            res.status(404).json({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


// todo -> -------------------------------------EMPRESA------------------------------------------------------
router.get('/empresa',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('empresa')
        const result = await collection.aggregate([
            {
                $lookup:{
                    from: "municipio",
                    localField: "id_municipio",
                    foreignField: "_id",
                    as: "id_municipio"
                }
            },
            {
                $unwind: "$id_municipio"
            },
            {
                $lookup: {
                    from: "departamento",
                    localField: "id_municipio.id_departamento",
                    foreignField: "_id",
                    as: "id_departamento"

                }
            },
            {
                $unwind: "$id_departamento"
            },
            {
                $lookup: {
                    from: "pais",
                    localField: "id_departamento.id_pais",
                    foreignField: "_id",
                    as: "id_pais"

                }
            },
            {
                $unwind: "$id_pais"
            },
            {
                $project:{
                    _id:0,
                    nit:1,
                    razon_social:1,
                    representante_legal:1,
                    fecha_creacion:1,
                    "id_municipio.id_departamento":{
                        nombre:"$id_departamento.nombre",
                        id_pais:{
                            nombre: "$id_pais.nombre"
                        } 
                    }
                }
            }
        ]).toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/empresa',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {nit, razon_social, representante_legal, fecha_creacion, id_municipio} = req.body

        const empresa={
            nit,
            razon_social,
            representante_legal,
            fecha_creacion: new Date(fecha_creacion),
            id_municipio:new ObjectId(id_municipio)
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('empresa')
        const result = await collection.insertOne(empresa)

        res.json({empresa, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/empresa/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('empresa')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "Empresa eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "Empresa no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/empresa/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {nit, razon_social, representante_legal, fecha_creacion, id_municipio} = req.body

        const empresa={
            nit,
            razon_social,
            representante_legal,
            fecha_creacion: new Date(fecha_creacion),
            id_municipio:new ObjectId(id_municipio)
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('empresa')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: empresa})

        if (!result.value) {
            res.json({
                "message": "Empresa actualizado correctamente",
                empresa
            });
        } else if (result.value) {
            res.status(404).json({ error: "Empresa no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

// todo -> -------------------------------------PAIS------------------------------------------------------
router.get('/pais',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('pais')
        const result = await collection.find().toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/pais',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {nombre} = req.body

        const pais={
            nombre
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('pais')
        const result = await collection.insertOne(pais)

        res.json({pais, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/pais/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('pais')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "Pais eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "Pais no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/pais/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {nombre} = req.body

        const pais={
            nombre
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('pais')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: pais})

        if (!result.value) {
            res.json({
                "message": "Usuario actualizado correctamente",
                pais
            });
        } else if (result.value) {
            res.status(404).json({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

// todo -> -------------------------------------DEPARTAMENTO------------------------------------------------------
router.get('/departamento',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('departamento')
        const result = await collection.aggregate([
            {
                $lookup: {
                    from: "pais",
                    localField: "id_pais",
                    foreignField: "_id",
                    as: "id_pais"

                }
            },
            {
                $unwind: "$id_pais"
            },
        ]).toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/departamento',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {nombre, id_pais} = req.body

        const departamento={
            nombre,
            id_pais: new ObjectId(id_pais)
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('departamento')
        const result = await collection.insertOne(departamento)

        res.json({departamento, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/departamento/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('departamento')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "departamento eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "departamento no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/departamento/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {nombre, id_pais} = req.body

        const departamento={
            nombre,
            id_pais: new ObjectId(id_pais)
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('departamento')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: departamento})

        if (!result.value) {
            res.json({
                "message": "Usuario actualizado correctamente",
                departamento
            });
        } else if (result.value) {
            res.status(404).json({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


// todo -> -------------------------------------MUNICIPIO------------------------------------------------------
router.get('/municipio',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('municipio')
        const result = await collection.aggregate([
            {
                $lookup: {
                    from: "departamento",
                    localField: "id_departamento",
                    foreignField: "_id",
                    as: "id_departamento"

                }
            },
            {
                $unwind: "$id_departamento"
            },
            {
                $lookup: {
                    from: "pais",
                    localField: "id_departamento.id_pais",
                    foreignField: "_id",
                    as: "id_pais"

                }
            },
            {
                $unwind: "$id_pais"
            },
            {
                $project:{
                    _id:0,
                    "id_departamento.nombre":1,
                    "id_departamento.id_pais":{
                        "nombre":"$id_pais.nombre"
                    }
                }
            }
        ]).toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/municipio',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {nombre, id_departamento} = req.body

        const municipio={
            nombre,
            id_departamento: new ObjectId(id_departamento)
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('municipio')
        const result = await collection.insertOne(municipio)

        res.json({municipio, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/municipio/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('municipio')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "municipio eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "municipio no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/municipio/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {nombre, id_departamento} = req.body

        const municipio={
            nombre,
            id_departamento: new ObjectId(id_departamento)
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('municipio')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: municipio})

        if (!result.value) {
            res.json({
                "message": "Usuario actualizado correctamente",
                municipio
            });
        } else if (result.value) {
            res.status(404).json({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

// todo -> -------------------------------------TIPO PERSONA------------------------------------------------------
router.get('/tipopersona',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('tipo_persona')
        const result = await collection.find().toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/tipopersona',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {nombre} = req.body

        const tipopersona={
            nombre
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('tipo_persona')
        const result = await collection.insertOne(tipopersona)

        res.json({tipopersona, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/tipopersona/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('tipo_persona')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "tipo_persona eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "tipo_persona no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/tipopersona/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {nombre} = req.body

        const tipopersona={
            nombre
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('tipo_persona')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: tipopersona})

        if (!result.value) {
            res.json({
                "message": "tipo_persona actualizado correctamente",
                tipopersona
            });
        } else if (result.value) {
            res.status(404).json({ error: "tipo_persona no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

// todo -> -------------------------------------TIPO PERSONA------------------------------------------------------
router.get('/cargo',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('cargo')
        const result = await collection.find().toArray()

        res.json(result)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.post('/cargo',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const {descripcion, sueldo_base} = req.body

        const cargo={
            descripcion,
            sueldo_base
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('cargo')
        const result = await collection.insertOne(cargo)

        res.json({cargo, result})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})

router.delete('/cargo/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('cargo')
        const result = await collection.findOneAndDelete({_id: new ObjectId(id)})

        if (!result.value) {
            res.json({
                "message": "cargo eliminado correctamente",
                result
            });
        } else if (result.value) {
            res.status(404).json({ error: "cargo no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})


router.patch('/tipopersona/:id',checkVersionHeader, async(req,res)=>{
    const client = new MongoClient(base)

    try {
        const id = req.params
        const {descripcion, sueldo_base} = req.body

        const cargo={
            descripcion,
            sueldo_base
        }

        await client.connect()
        const db = client.db(nombrebase)
        const collection = db.collection('cargo')
        const result = await collection.findOneAndUpdate({_id: new ObjectId(id)},{$set: cargo})

        if (!result.value) {
            res.json({
                "message": "tipo_persona actualizado correctamente",
                cargo
            });
        } else if (result.value) {
            res.status(404).json({ error: "tipo_persona no encontrado" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error interno del servidor"})
    } finally{
        client.close()
        console.log('finalizo peticion');
    }
})





export default router;